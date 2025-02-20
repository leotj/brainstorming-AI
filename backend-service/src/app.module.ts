import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserIdMiddleware } from 'src/middlewares/user-id.middleware';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { Neo4jModule } from 'src/neo4j/neo4j.module';
import { OpenAIService } from 'src/openai/openai.service';
import { GraphModule } from 'src/graph/graph.module';
import { EventsModule } from 'src/events/events.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    CacheModule,
    ConversationsModule,
    Neo4jModule,
    GraphModule,
    EventsModule,
  ],
  providers: [OpenAIService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdMiddleware).forRoutes('*');
  }
}
