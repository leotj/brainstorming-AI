import { Module } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import { Neo4jRepository } from './neo4j.repository';

@Module({
  providers: [Neo4jService, Neo4jRepository],
  exports: [Neo4jService],
})
export class Neo4jModule {}
