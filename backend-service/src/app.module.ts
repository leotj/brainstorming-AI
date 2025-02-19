import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConversationsModule } from './conversations/conversations.module';
import { OpenAIService } from './openai/openai.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    ConversationsModule,
  ],
  providers: [OpenAIService],
})
export class AppModule {}
