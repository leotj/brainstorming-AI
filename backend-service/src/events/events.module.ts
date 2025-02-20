import { Module } from '@nestjs/common';
import { GraphModule } from 'src/graph/graph.module';
import { EventsService } from './events.service';

@Module({
  imports: [GraphModule],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
