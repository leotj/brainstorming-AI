import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { Neo4jModule } from 'src/neo4j/neo4j.module';
import { EventsService } from './events.service';

@Module({
  imports: [CacheModule, Neo4jModule],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
