import { Injectable } from '@nestjs/common';
import { InitiateConversationDto } from 'src/conversations/dto/initiate-conversation.dto';
import { SelectConversationDto } from 'src/conversations/dto/select-conversation.dto';
import { OpenAIService } from 'src/openai/openai.service';
import { GraphService } from 'src/graph/graph.service';
import { EventsService } from 'src/events/events.service';
import { GraphData } from 'src/types/graph';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly openAIService: OpenAIService,
    private readonly graphService: GraphService,
    private readonly eventsService: EventsService,
  ) {}

  async initiateConversation(initiateConversationDto: InitiateConversationDto) {
    const response = await this.openAIService.getResponses(initiateConversationDto.message);

    const content = response.choices[0].message.content;

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
