import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConversationsService } from 'src/conversations/conversations.service';
import { InitiateConversationDto } from './dto/initiate-conversation.dto';
import { SelectConversationDto } from './dto/select-conversation.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Initiate a conversation and get AI responses',
    description:
      'Starts a new conversation with the provided user input, sends the input to LLM, and returns a set of potential AI responses.',
  })
  @ApiResponse({
    status: 201,
    description: 'Conversation initiated and AI responses returned.',
    schema: {
      type: 'object',
      properties: {
        messageId: { type: 'string', example: 'msg-12345' },
        responses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              responseId: { type: 'string', example: 'resp-1' },
              responseText: {
                type: 'string',
                example: 'This is an AI response.',
              },
            },
          },
        },
      },
    },
  })
  initiateConversation(@Body() initiateConversationDto: InitiateConversationDto) {
    return this.conversationsService.initiateConversation(initiateConversationDto);
  }

  @Post('/select')
  @ApiOperation({
    summary: 'Select an AI response and update the knowledge graph',
    description:
      "Signals the user's selection of a specific AI response.  The backend uses the messageId and responseId to identify the relevant response and update the knowledge graph accordingly.  The backend infers the conversation context based on the messageId.",
  })
  @ApiResponse({
    status: 200,
    description: 'Knowledge graph updated successfully.',
  })
  select(@Body() selectConversationDto: SelectConversationDto) {
    return this.conversationsService.select(selectConversationDto);
  }

  @Post('/reset')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Clear chat context',
    description:
      'Removes all chat history along with knowledge graph nodes and their relationships.',
  })
  @ApiResponse({ status: 200, description: 'Successfully reset the knowledge graph.' })
  @ApiResponse({ status: 403, description: 'Forbidden - You do not have permission.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async resetKnowledgeGraph() {
    await this.conversationsService.reset();
    return { message: 'Knowledge graph has been reset.' };
  }

  @Post('/elaborate')
  @ApiOperation({
    summary: 'Request elaboration on a specific response',
    description:
      "Requests further details or clarification on a previously selected AI response.  The backend uses the messageId and responseId to identify the original response and combines it with the user's elaborationInput to generate new AI responses.",
  })
  @ApiResponse({
    status: 201,
    description: 'Elaboration responses returned.',
    schema: {
      type: 'object',
      properties: {
        messageId: { type: 'string', example: 'msg-12345' },
        responses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              responseId: { type: 'string', example: 'resp-1' },
              responseText: {
                type: 'string',
                example: 'This is an AI response.',
              },
            },
          },
        },
      },
    },
  })
  elaborate() {
    return null;
  }

  @Post('/generate')
  @ApiOperation({
    summary: 'Generate new content based on selected nodes',
    description:
      'Generates new content related to the provided knowledge graph nodes. The backend uses the selectedNodeIds to retrieve the relevant node content and constructs a prompt for OpenAI to generate new, related content.',
  })
  @ApiResponse({
    status: 201,
    description: 'Generated content responses returned.',
    schema: {
      type: 'object',
      properties: {
        messageId: { type: 'string', example: 'msg-12345' },
        responses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              responseId: { type: 'string', example: 'resp-1' },
              responseText: {
                type: 'string',
                example: 'This is an AI response.',
              },
            },
          },
        },
      },
    },
  })
  generate() {
    return null;
  }
}
