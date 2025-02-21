import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, {
  Driver,
  Session,
  Neo4jError,
  RecordShape,
  Result,
  ManagedTransaction,
} from 'neo4j-driver';
import { GraphData } from 'src/types/graph';
import { TopicRelatedToTopic } from 'src/types/neo4j';

@Injectable()
export class Neo4jRepository implements OnModuleDestroy {
  private readonly driver: Driver;

  constructor(private readonly configService: ConfigService) {
    this.driver = this.connect();
  }

  onModuleDestroy() {
    return this.driver.close();
  }

  connect(): Driver {
    const url = this.configService.get<string>('NEO4J_URL');
    const username = this.configService.get<string>('NEO4J_USERNAME');
    const password = this.configService.get<string>('NEO4J_PASSWORD');

    const missingVars = [];
    if (!url) missingVars.push('NEO4J_URL');
    if (!username) missingVars.push('NEO4J_USERNAME');
    if (!password) missingVars.push('NEO4J_PASSWORD');

    if (missingVars.length > 0) {
      throw new Error(
        `Can't connect to Neo4j. Missing environment variable(s): ${missingVars.join(', ')}`,
      );
    }

    return neo4j.driver(url!, neo4j.auth.basic(username!, password!));
  }

  disconnect() {
    return this.driver.close();
  }

  async runQuery<T extends RecordShape>(
    query: string,
    params: Record<string, any> = {},
  ): Promise<Result<T>> {
    const session: Session = this.driver.session();
    try {
      return await session.run<T>(query, params);
    } catch (error) {
      if (error instanceof Neo4jError) {
        throw new Error(`Neo4j query failed (${error.code}): ${error.message}`);
      }
      throw new Error(`Unexpected error: ${(error as Error).message}`);
    } finally {
      await session.close();
    }
  }

  async addUserKnowledgeGraph(userId: string, conversationId: string, graphData: GraphData) {
    const session: Session = this.driver.session();
    await session.executeWrite(async (trx: ManagedTransaction) => {
      await trx.run('MERGE (u:User {userId: $userId}) RETURN u', { userId });
      await trx.run('MERGE (c:Conversation {conversationId: $conversationId}) RETURN c', {
        conversationId,
      });
      await trx.run(
        `MATCH (u:User {userId: $userId}), (c:Conversation {conversationId: $conversationId})
         MERGE (u)-[:HAVING]->(c)`,
        { userId, conversationId },
      );
      await trx.run(
        `UNWIND $nodes as node
        MERGE (t:Topic {label: node.label})`,
        { nodes: graphData.nodes },
      );
      await trx.run(
        `UNWIND $nodes as node
        MATCH (c:Conversation {conversationId: $conversationId}), (t:Topic {label: node.label})
        MERGE (c)-[:MENTIONS]->(t)`,
        { conversationId, nodes: graphData.nodes },
      );

      for (const edge of graphData.edges) {
        const query = `
            MATCH (source:Topic {label: $from})
            MATCH (target:Topic {label: $to})
            MERGE (source)-[:${edge.label}]->(target)
        `;

        await trx.run(query, {
          from: edge.from,
          to: edge.to,
        });
      }
    });
  }

  async getUserKnowledgeGraph(userId: string, conversationId: string) {
    const session: Session = this.driver.session();
    return await session.executeRead(async (trx: ManagedTransaction) => {
      return await trx.run<TopicRelatedToTopic>(
        `MATCH (u:User {userId: $userId})-[:HAVING]->(c:Conversation {conversationId: $conversationId})
        MATCH (c)-[:MENTIONS]->(t:Topic)
        OPTIONAL MATCH (t1:Topic)-[r]->(t2:Topic) // Dynamic relationship match
        RETURN t1, r, t2`,
        { userId, conversationId },
      );
    });
  }

  async deleteUserKnowledgeGraph(userId: string, conversationId: string) {
    const session: Session = this.driver.session();
    return await session.executeWrite(async (trx: ManagedTransaction) => {
      return await trx.run<TopicRelatedToTopic>(
        `MATCH (u:User {userId: $userId})-[:HAVING]->(c:Conversation {conversationId: $conversationId})
        MATCH (c)-[:MENTIONS]->(t:Topic)
        OPTIONAL MATCH (t1:Topic)-[r]->(t2:Topic) // Dynamic relationship match
        DETACH DELETE c, r`,
        { userId, conversationId },
      );
    });
  }
}
