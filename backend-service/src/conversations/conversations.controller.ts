import { Controller, Post, Body, Req, HttpCode, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestWithCookies } from 'src/types/request';
import { ConversationsService } from 'src/conversations/conversations.service';
import {
  InitiateConversationRequestDto,
  InitiateConversationResponseDto,
} from './dto/initiate-conversation.dto';
import { GetConversationHistoryResponseDto } from './dto/get-conversation-history.dto';

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
  initiateConversation(
    @Req() req: RequestWithCookies,
    @Body() initiateConversationRequestDto: InitiateConversationRequestDto,
  ): Promise<InitiateConversationResponseDto> {
    return this.conversationsService.initiateConversation(
      req.cookies.userId,
      initiateConversationRequestDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get conversation history',
    description:
      "Retrieves the user's entire conversation history, including user inputs and AI responses.",
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation history retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        conversationId: { type: 'string', example: 'conv-12345' },
        history: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', example: 'user' },
              content: { type: 'string', example: 'msg-12345' },
            },
          },
        },
      },
    },
  })
  getConversationHistory(
    @Req() req: RequestWithCookies,
  ): Promise<GetConversationHistoryResponseDto | undefined> {
    return this.conversationsService.getConversationHistory(req.cookies.userId);
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
  select() {
    return null;
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
  async resetKnowledgeGraph(@Req() req: RequestWithCookies) {
    await this.conversationsService.reset(req.cookies.userId);
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
