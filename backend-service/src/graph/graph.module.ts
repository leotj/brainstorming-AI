import { Module } from '@nestjs/common';
import { GraphService } from './graph.service';
import { GraphRepository } from './graph.repository';
import { SurrealdbModule } from 'src/surrealdb/surrealdb.module';

@Module({
  imports: [SurrealdbModule],
  providers: [GraphService, GraphRepository],
  exports: [GraphService],
})
export class GraphModule {}
