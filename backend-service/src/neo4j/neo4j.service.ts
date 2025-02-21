import { Injectable } from '@nestjs/common';
import { Neo4jRepository } from './neo4j.repository';
import { RecordShape, Result } from 'neo4j-driver';
import { Edge, GraphData, Node } from 'src/types/graph';

@Injectable()
export class Neo4jService {
  constructor(private readonly repository: Neo4jRepository) {}

  async runQuery<T extends RecordShape>(
    query: string,
    params: Record<string, any> = {},
  ): Promise<Result<T>> {
    return await this.repository.runQuery(query, params);
  }

  async addUserKnowledgeGraph(userId: string, conversationId: string, graphData: GraphData) {
    await this.repository.addUserKnowledgeGraph(userId, conversationId, graphData);
  }

  async getUserKnowledgeGraph(userId: string, conversationId: string) {
    const neo4jGraph = await this.repository.getUserKnowledgeGraph(userId, conversationId);

    const nodeSet = new Set<string>();
    const edgeSet = new Set<string>();

    const addToSet = (set: Set<string>, value: Node | Edge) => {
      const key = JSON.stringify(value); // Convert object to string for comparison
      if (!set.has(key)) {
        set.add(key);
      }
    };

    neo4jGraph.records.forEach((r) => {
      addToSet(nodeSet, {
        id: r.get('t1').elementId,
        label: r.get('t1').properties.label,
      });
      addToSet(nodeSet, {
        id: r.get('t2').elementId,
        label: r.get('t2').properties.label,
      });
      addToSet(edgeSet, {
        from: r.get('r').startNodeElementId,
        to: r.get('r').endNodeElementId,
        label: r.get('r').type,
      });
    });

    const graphData: GraphData = {
      nodes: [...nodeSet].map<Node>((n): Node => JSON.parse(n) as Node),
      edges: [...edgeSet].map<Edge>((n): Edge => JSON.parse(n) as Edge),
    };

    return graphData;
  }

  async deleteUserKnowledgeGraph(userId: string, conversationId: string) {
    await this.repository.deleteUserKnowledgeGraph(userId, conversationId);
  }
}
