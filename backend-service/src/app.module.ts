import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserIdMiddleware } from 'src/middlewares/user-id.middleware';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { OpenAIService } from 'src/openai/openai.service';
import { EventsModule } from 'src/events/events.module';
import { CacheModule } from 'src/cache/cache.module';
import { SurrealdbModule } from './surrealdb/surrealdb.module';
import { GraphModule } from './graph/graph.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    CacheModule,
    ConversationsModule,
    EventsModule,
    SurrealdbModule,
    GraphModule,
  ],
  providers: [OpenAIService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdMiddleware).forRoutes('*');
  }
}
