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
        model: this.configService.get<string>('OPENAI_DEPLOYMENT') || 'gpt-4',
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

  async getStructuredResponse(message: string): Promise<ChatCompletion> {
    try {
      const chatCompletion = await this.client.chat.completions.create({
        model: this.configService.get<string>('OPENAI_DEPLOYMENT') || 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are a precise assistant that extracts entities and relationships from text and returns them in JSON format.',
          },
          {
            role: 'user',
            content: `Extract structured data from this text: ${message}`,
          },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_graph_data',
              description:
                'Extracts nodes and relationships from text and returns structured graph data.',
              parameters: {
                type: 'object',
                properties: {
                  nodes: {
                    type: 'array',
                    description:
                      'List of nodes representing entities in the text (use single words only)',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          description:
                            'ID derived from the label (same as label) with capitalized first letter',
                        },
                        label: {
                          type: 'string',
                          description:
                            'Entity name (single word only) with capitalized first letter',
                        },
                      },
                      required: ['id', 'label'],
                    },
                  },
                  edges: {
                    type: 'array',
                    description: 'List of directed relationships between nodes',
                    items: {
                      type: 'object',
                      properties: {
                        source: {
                          type: 'string',
                          description: 'ID of the source entity',
                        },
                        target: {
                          type: 'string',
                          description: 'ID of the target entity',
                        },
                        label: {
                          type: 'string',
                          description:
                            'Description of the relationship with all letters capitalized and underscore to replace space',
                        },
                      },
                      required: ['source', 'target', 'label'],
                    },
                  },
                },
                required: ['nodes', 'edges'],
              },
            },
          },
        ],
        n: 1,
        temperature: Number(this.configService.get<number>('OPENAI_CHAT_COMPLETIONS_TEMPERATURE')),
        max_tokens: 200,
      });
      return chatCompletion;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        throw new Error(
          `Failed to get structured OpenAI response (${error.status}): ${error.message}`,
        );
      }
      throw error;
    }
  }
}
