import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class EventsService
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy
{
  @WebSocketServer()
  private server: Server;

  private logger = new Logger(EventsService.name);
  private intervalId: NodeJS.Timeout | null = null;

  onModuleInit() {
    this.startEmittingUpdates();
  }

  onModuleDestroy() {
    this.stopEmittingUpdates();
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('clientMessage')
  handleMessage(@MessageBody() data: { message: string }): string {
    this.logger.log(`Received message from client: ${data.message}`);
    return `Server received: ${data.message}`;
  }

  private startEmittingUpdates() {
    this.intervalId = setInterval(() => {
      const randomValue = Math.random();
      this.server.emit('updateGraph', { value: randomValue });
      this.logger.log(`Emitting updateGraph event: ${randomValue}`);
    }, 3000); // Emit every 3 seconds
  }

  private stopEmittingUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
