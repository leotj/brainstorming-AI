import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { InitiateConversationDto } from 'src/conversations/dto/initiate-conversation.dto';
import { OpenAIService } from 'src/openai/openai.service';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { EventsService } from 'src/events/events.service';
import { INITIAL_SYSTEM_ROLE } from 'src/prompt/conversation.prompt';
import { CacheService } from 'src/cache/cache.service';
import { GraphData } from 'src/types/graph';
import { HistoryCache } from 'src/types/cache';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly openAIService: OpenAIService,
    private readonly neo4jService: Neo4jService,
    private readonly eventsService: EventsService,
    private readonly cacheService: CacheService,
  ) {}

  async initiateConversation(userId: string, initiateConversationDto: InitiateConversationDto) {
    const historyCache = await this.cacheService.get(userId);

    let messages: any[] = [];

    if (!historyCache) {
      messages.push(INITIAL_SYSTEM_ROLE);
    } else {
      messages = messages.concat((historyCache as HistoryCache).messages);
    }

    messages.push({
      role: 'user',
      content: initiateConversationDto.message,
    });

    const response = await this.openAIService.getResponses(
      messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    );

    const conversationId = historyCache ? (historyCache as HistoryCache).id : response.id;
    const content = response.choices[0].message.content;

    messages.push({
      role: 'system',
      content,
    });

    const history = {
      id: conversationId,
      messages,
    };

    await this.cacheService.set(userId, history, '1d');

    if (content) {
      const completion = await this.openAIService.getStructuredResponse(content);
      const rawArguments = completion.choices[0].message.tool_calls![0].function
        .arguments as unknown as string;
      const graphData = JSON.parse(rawArguments) as GraphData;
      await this.neo4jService.addUserKnowledgeGraph(userId, conversationId, graphData);
      await this.eventsService.emitGraphDataUpdated(userId, conversationId);
    }

    return response;
  }

  async getConversationHistory(userId: string): Promise<any[]> {
    const historyCache = await this.cacheService.get(userId);
    return (historyCache as HistoryCache).messages.slice(1);
  }

  async select() {
    // const { message } = selectConversationDto;
    // const completion = await this.openAIService.getStructuredResponse(message);
    // const rawArguments = completion.choices[0].message.tool_calls![0].function
    //   .arguments as unknown as string;
    // const graphData = JSON.parse(rawArguments) as GraphData;
    // await this.graphService.saveGraph(graphData);
    // return graphData;
  }

  async reset(userId: string) {
    const historyCache = await this.cacheService.get(userId);
    const conversationId = (historyCache as HistoryCache).id;

    await this.neo4jService.deleteUserKnowledgeGraph(userId, conversationId);
    await this.cacheService.delete(userId);
    await this.eventsService.emitGraphDataUpdated(userId, conversationId);
  }
}
