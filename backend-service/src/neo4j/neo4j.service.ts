import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver, Session, Neo4jError } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleDestroy {
  private readonly driver: Driver;

  constructor(private readonly configService: ConfigService) {
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

    this.driver = neo4j.driver(url!, neo4j.auth.basic(username!, password!));
  }

  async runQuery(query: string, params: Record<string, any> = {}): Promise<any> {
    const session: Session = this.driver.session();
    try {
      return await session.run(query, params);
    } catch (error) {
      if (error instanceof Neo4jError) {
        throw new Error(`Neo4j query failed (${error.code}): ${error.message}`);
      }
      throw new Error(`Unexpected error: ${(error as Error).message}`);
    } finally {
      await session.close();
    }
  }

  onModuleDestroy() {
    return this.driver.close();
  }
}
