import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { Neo4jModule } from 'src/neo4j/neo4j.module';
import { OpenAIService } from 'src/openai/openai.service';
import { GraphModule } from 'src/graph/graph.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    ConversationsModule,
    Neo4jModule,
    GraphModule,
    EventsModule,
  ],
  providers: [OpenAIService],
})
export class AppModule {}
