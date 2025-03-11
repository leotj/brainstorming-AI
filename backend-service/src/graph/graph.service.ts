import { Injectable } from '@nestjs/common';
import { GraphRepository } from './graph.repository';
import { NER } from './graph.type';

@Injectable()
export class GraphService {
  constructor(private readonly graphRepository: GraphRepository) {}

  async addUserKnowledgeGraph(userId: string, conversationId: string, graphData: NER) {
    return await this.graphRepository.addUserKnowledgeGraph(userId, conversationId, graphData);
  }

  async getUserKnowledgeGraph(userId: string, conversationId: string) {
    const result = await this.graphRepository.getUserKnowledgeGraph(userId, conversationId);
    return result[0];
  }

  async deleteUserKnowledgeGraph(userId: string, conversationId: string) {
    return await this.graphRepository.deleteUserKnowledgeGraph(userId, conversationId);
  }
}
