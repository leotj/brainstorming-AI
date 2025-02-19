import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI, { AzureOpenAI } from 'openai';
import { ChatCompletion } from 'openai/resources';

@Injectable()
export class OpenAIService {
  private client: AzureOpenAI;

  constructor(private readonly configService: ConfigService) {
    const client = new AzureOpenAI({
      endpoint: this.configService.get<string>('OPENAI_ENDPOINT'),
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      apiVersion: this.configService.get<string>('OPENAI_API_VERSION'),
      deployment: this.configService.get<string>('OPENAI_DEPLOYMENT'),
    });
    this.client = client;
  }

  async getResponses(query: string): Promise<ChatCompletion> {
    try {
      const chatCompletion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
              'You are a knowledgeable assistant that provides multiple perspectives on topics',
          },
          {
            role: 'user',
            content: query,
          },
        ],
        model: 'gpt-4o',
        n: 3,
        temperature: Number(this.configService.get<number>('OPENAI_CHAT_COMPLETIONS_TEMPERATURE')),
        max_tokens: Number(this.configService.get<number>('OPENAI_CHAT_COMPLETIONS_MAX_TOKENS')),
      });

      return chatCompletion;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new Error(`OpenAI API Error (${error.status}): ${error.message}`);
      }
      throw error;
    }
  }
}
