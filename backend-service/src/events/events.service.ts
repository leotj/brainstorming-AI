import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { GraphService } from 'src/graph/graph.service';
import { ConversationCache } from 'src/types/cache';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
@Injectable()
export class EventsService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private logger = new Logger(EventsService.name);
  private clients: Map<string, string> = new Map();

  constructor(
    private readonly cacheService: CacheService,
    private readonly graphService: GraphService,
  ) {}

  private parseCookies(cookieHeader: string): Record<string, string> {
    return cookieHeader
      .split(';')
      .map((cookie) => cookie.trim().split('='))
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );
  }

  async handleConnection(client: Socket) {
    try {
      const handshake = client.handshake;
      const cookies = this.parseCookies(handshake.headers.cookie || '');
      const userId = cookies['userId'];

      if (!userId) {
        this.logger.log('No userId found in cookies. Disconnecting client.');
        client.disconnect();
        return;
      }

      this.clients.set(userId, client.id);
      this.logger.log(`User ${userId} connected with socket ID ${client.id}`);

      const conversationCache = await this.cacheService.get<ConversationCache>(userId);

      if (conversationCache && conversationCache.id) {
        this.logger.log(`User ${userId} has active conversationId ${conversationCache.id}`);
        await this.emitGraphDataUpdated(userId, conversationCache.id);
      }
    } catch (error) {
      this.logger.error('Error during connection:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async emitGraphDataUpdated(userId: string, conversationId: string): Promise<void> {
    try {
      const graphData = await this.graphService.getUserKnowledgeGraph(userId, conversationId);
      this.server.emit('graphDataUpdated', graphData);
    } catch (error) {
      this.logger.log('Failed to get graph data', error);
    }
  }
}
