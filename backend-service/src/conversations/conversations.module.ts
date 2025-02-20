import { Module } from '@nestjs/common';
import { GraphModule } from 'src/graph/graph.module';
import { EventsModule } from 'src/events/events.module';
import { ConversationsService } from './conversations.service';
import { OpenAIService } from '../openai/openai.service';
import { ConversationsController } from './conversations.controller';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [GraphModule, EventsModule, CacheModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, OpenAIService],
})
export class ConversationsModule {}
