import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { InitiateConversationDto } from 'src/conversations/dto/initiate-conversation.dto';
import { SelectConversationDto } from 'src/conversations/dto/select-conversation.dto';
import { OpenAIService } from 'src/openai/openai.service';
import { GraphService } from 'src/graph/graph.service';
import { EventsService } from 'src/events/events.service';
import { GraphData } from 'src/types/graph';
import { INITIAL_SYSTEM_ROLE } from 'src/prompt/conversation.prompt';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly openAIService: OpenAIService,
    private readonly graphService: GraphService,
    private readonly eventsService: EventsService,
    private readonly cacheService: CacheService,
  ) {}

  private async cacheConversationHistory(userId: string, data: { message: string }) {
    let history: any[] = [];

    const message = {
      role: 'user',
      content: data.message,
    };

    const historyCache = await this.cacheService.get(userId);

    if (!historyCache) {
      history.push(INITIAL_SYSTEM_ROLE);
      history.push(message);
      return await this.cacheService.set(userId, history, '1d');
    } else {
      history = history.concat(historyCache);
      history.push(message);
      return await this.cacheService.set(userId, history);
    }
  }

  async initiateConversation(userId: string, initiateConversationDto: InitiateConversationDto) {
    const historyCache = await this.cacheService.get(userId);

    let messages: any[] = [];

    if (!historyCache) {
      messages.push(INITIAL_SYSTEM_ROLE);
    } else {
      messages = messages.concat(historyCache);
    }

    messages.push({
      role: 'user',
      content: initiateConversationDto.message,
    });

    const response = await this.openAIService.getResponses(
      messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    );

    const content = response.choices[0].message.content;

    messages.push({
      role: 'system',
      content,
    });

    await this.cacheService.set(userId, messages, '1d');

    if (content) {
      const completion = await this.openAIService.getStructuredResponse(content);
      const rawArguments = completion.choices[0].message.tool_calls![0].function
        .arguments as unknown as string;
      const graphData = JSON.parse(rawArguments) as GraphData;
      await this.graphService.saveGraph(graphData);
      await this.eventsService.emitGraphDataUpdated();
    }

    return response;
  }

  async select(selectConversationDto: SelectConversationDto) {
    const { message } = selectConversationDto;

    const completion = await this.openAIService.getStructuredResponse(message);

    const rawArguments = completion.choices[0].message.tool_calls![0].function
      .arguments as unknown as string;

    const graphData = JSON.parse(rawArguments) as GraphData;

    await this.graphService.saveGraph(graphData);

    return graphData;
  }

  async reset() {
    const response = await this.graphService.deleteGraph();
    await this.eventsService.emitGraphDataUpdated();
    return response;
  }
}
