import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { HistoryCache } from 'src/types/cache';

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
    private readonly neo4jService: Neo4jService,
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
      const historyCache = await this.cacheService.get(userId);

      if (!userId) {
        this.logger.log('No userId found in cookies. Disconnecting client.');
        client.disconnect();
        return;
      }

      this.clients.set(userId, client.id);
      this.logger.log(`User ${userId} connected with socket ID ${client.id}`);

      if (historyCache) {
        const conversationId = (historyCache as HistoryCache).id;
        this.logger.log(`User ${userId} has active conversationId ${conversationId}`);
        await this.emitGraphDataUpdated(userId, conversationId);
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
      const graphData = await this.neo4jService.getUserKnowledgeGraph(userId, conversationId);
      this.server.emit('graphDataUpdated', graphData);
    } catch (error) {
      this.logger.log('Failed to get graph data', error);
    }
  }
}
