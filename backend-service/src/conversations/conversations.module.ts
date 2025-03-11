import { Module } from '@nestjs/common';
import { EventsModule } from 'src/events/events.module';
import { ConversationsService } from './conversations.service';
import { OpenAIService } from '../openai/openai.service';
import { ConversationsController } from './conversations.controller';
import { CacheModule } from 'src/cache/cache.module';
import { GraphModule } from 'src/graph/graph.module';

@Module({
  imports: [EventsModule, CacheModule, GraphModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, OpenAIService],
})
export class ConversationsModule {}
