import { Module } from '@nestjs/common';
import { GraphModule } from 'src/graph/graph.module';
import { EventsModule } from 'src/events/events.module';
import { ConversationsService } from './conversations.service';
import { OpenAIService } from '../openai/openai.service';
import { ConversationsController } from './conversations.controller';

@Module({
  imports: [GraphModule, EventsModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, OpenAIService],
})
export class ConversationsModule {}
