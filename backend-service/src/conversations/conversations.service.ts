import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  InitiateConversationRequestDto,
  InitiateConversationResponseDto,
} from 'src/conversations/dto/initiate-conversation.dto';
import { OpenAIService } from 'src/openai/openai.service';
import { EventsService } from 'src/events/events.service';
import { INITIAL_SYSTEM_ROLE } from 'src/prompt/conversation.prompt';
import { CacheService } from 'src/cache/cache.service';
import { MessageCache, ConversationCache } from 'src/types/cache';
import { GraphService } from 'src/graph/graph.service';
import { NER } from 'src/graph/graph.type';
import { GetConversationHistoryResponseDto } from './dto/get-conversation-history.dto';

interface Content {
  response: string;
  graph: {
    nodes: string[];
    edges: {
      from: string;
      to: string;
      label: string;
    }[];
  };
}

@Injectable()
export class ConversationsService {
  constructor(
    private readonly openAIService: OpenAIService,
    private readonly eventsService: EventsService,
    private readonly cacheService: CacheService,
    private readonly graphService: GraphService,
  ) {}

  private async composeNewConversationCacheData(
    userId: string,
    message: string,
  ): Promise<ConversationCache> {
    let newMessageCacheData: MessageCache[] = [];

    const conversationCache = await this.cacheService.get<ConversationCache>(userId);

    if (!conversationCache || !conversationCache.messages) {
      newMessageCacheData.push(INITIAL_SYSTEM_ROLE);
    } else {
      newMessageCacheData = newMessageCacheData.concat(conversationCache.messages);
    }

    newMessageCacheData.push({
      role: 'user',
      content: message,
    });

    return {
      id: conversationCache?.id,
      messages: newMessageCacheData,
    };
  }

  private transformOpenAIGeneratedGraph(content: Content) {
    const { nodes, edges } = content.graph;
    const graph: NER = {
      nodes: nodes.map((node) => ({
        label: node,
      })),
      edges,
    };
    return graph;
  }

  async initiateConversation(
    userId: string,
    { message }: InitiateConversationRequestDto,
  ): Promise<InitiateConversationResponseDto> {
    const newConversationCacheData = await this.composeNewConversationCacheData(userId, message);

    const payload =
      newConversationCacheData?.messages as unknown as OpenAI.Chat.Completions.ChatCompletionMessageParam[];
    const openAIResponses = await this.openAIService.getResponses(payload);

    const rawContent = openAIResponses.choices[0].message.content as unknown as string;
    const content = JSON.parse(rawContent) as Content;

    if (content) {
      /**
       * Enrich the new conversation cache data
       * Use the OpenAI completion chat ID coming from the beginning of the conversation session as conversation ID
       * Add OpenAI natural language response to the conversation cache for context continuity purpose
       */
      if (!newConversationCacheData.id) {
        newConversationCacheData.id = openAIResponses.id;
      }
      newConversationCacheData.messages?.push({
        role: 'system',
        content: content.response,
      });

      const knowledgeGraph = this.transformOpenAIGeneratedGraph(content);
      await this.graphService.addUserKnowledgeGraph(
        userId,
        newConversationCacheData.id,
        knowledgeGraph,
      );
      await this.cacheService.set(userId, newConversationCacheData, '1d');
      await this.eventsService.emitGraphDataUpdated(userId, newConversationCacheData.id);
    }

    return {
      response: content.response,
    };
  }

  async getConversationHistory(
    userId: string,
  ): Promise<GetConversationHistoryResponseDto | undefined> {
    const conversationCache = await this.cacheService.get<ConversationCache>(userId);

    if (conversationCache && conversationCache.messages) {
      conversationCache.messages = conversationCache.messages.slice(1);
    }

    return conversationCache;
  }

  async reset(userId: string) {
    const conversationCache = await this.cacheService.get<ConversationCache>(userId);

    if (!conversationCache || !conversationCache.id) return;

    await this.graphService.deleteUserKnowledgeGraph(userId, conversationCache.id);
    await this.cacheService.delete(userId);
  }
}
