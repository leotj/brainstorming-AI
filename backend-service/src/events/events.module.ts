import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { GraphModule } from 'src/graph/graph.module';
import { EventsService } from './events.service';

@Module({
  imports: [CacheModule, GraphModule],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
