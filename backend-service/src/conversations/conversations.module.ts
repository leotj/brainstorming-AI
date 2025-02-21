import { Module } from '@nestjs/common';
import { EventsModule } from 'src/events/events.module';
import { ConversationsService } from './conversations.service';
import { OpenAIService } from '../openai/openai.service';
import { ConversationsController } from './conversations.controller';
import { CacheModule } from 'src/cache/cache.module';
import { Neo4jModule } from 'src/neo4j/neo4j.module';

@Module({
  imports: [EventsModule, CacheModule, Neo4jModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, OpenAIService],
})
export class ConversationsModule {}
