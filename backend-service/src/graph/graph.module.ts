import { Module } from '@nestjs/common';
import { Neo4jModule } from 'src/neo4j/neo4j.module';
import { GraphService } from './graph.service';
import { GraphRepository } from './graph.repository';

@Module({
  imports: [Neo4jModule],
  providers: [GraphService, GraphRepository],
  exports: [GraphService],
})
export class GraphModule {}
