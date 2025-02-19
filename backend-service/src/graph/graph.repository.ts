import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { GraphData } from 'src/types/graph';

@Injectable()
export class GraphRepository {
  constructor(private readonly neo4jService: Neo4jService) {}

  async saveGraph(graphData: GraphData) {
    const { nodes, edges } = graphData;

    const createNodesQuery = `
      UNWIND $nodes as node
      MERGE (n:Topic {label: node.label})
    `;

    await this.neo4jService.runQuery(createNodesQuery, { nodes });

    for (const edge of edges) {
      const query = `
          MATCH (source:Topic {label: $sourceLabel})
          MATCH (target:Topic {label: $targetLabel})
          MERGE (source)-[:${edge.label}]->(target)
      `;

      await this.neo4jService.runQuery(query, {
        sourceLabel: edge.source,
        targetLabel: edge.target,
      });
    }
  }
}
