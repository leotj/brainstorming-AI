import { Module } from '@nestjs/common';
import { GraphModule } from 'src/graph/graph.module';
import { EventsService } from './events.service';

@Module({
  imports: [GraphModule],
  providers: [EventsService],
})
export class EventsModule {}
