import { Injectable } from '@nestjs/common';
import { GraphData } from 'src/types/graph';
import { GraphRepository } from './graph.repository';

@Injectable()
export class GraphService {
  constructor(private readonly graphRepository: GraphRepository) {}

  async saveGraph(graphData: GraphData) {
    await this.graphRepository.saveGraph(graphData);
  }
}
