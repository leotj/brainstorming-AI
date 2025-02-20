import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { GraphService } from 'src/graph/graph.service';
import { Edge, GraphData, Node } from 'src/types/graph';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class EventsService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private logger = new Logger(EventsService.name);

  constructor(private readonly graphService: GraphService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.emitGraphDataUpdated()
      .then(() => {})
      .catch(() => {});
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  private async getGraphData() {
    const neo4jGraph = await this.graphService.getGraph();

    const nodeSet = new Set<string>();
    const edgeSet = new Set<string>();

    const addToSet = (set: Set<string>, value: Node | Edge) => {
      const key = JSON.stringify(value); // Convert object to string for comparison
      if (!set.has(key)) {
        set.add(key);
      }
    };

    neo4jGraph.records.forEach((r) => {
      addToSet(nodeSet, {
        id: r.get('n').elementId,
        label: r.get('n').properties.label,
      });
      addToSet(nodeSet, {
        id: r.get('m').elementId,
        label: r.get('m').properties.label,
      });
      addToSet(edgeSet, {
        from: r.get('r').startNodeElementId,
        to: r.get('r').endNodeElementId,
        label: r.get('r').type,
      });
    });

    const graphData: GraphData = {
      nodes: [...nodeSet].map<Node>((n): Node => JSON.parse(n) as Node),
      edges: [...edgeSet].map<Edge>((n): Edge => JSON.parse(n) as Edge),
    };

    return graphData;
  }

  async emitGraphDataUpdated(): Promise<void> {
    try {
      const graphData = await this.getGraphData();
      this.server.emit('graphDataUpdated', graphData);
    } catch (error) {
      this.logger.log('Failed to get graph data', error);
    }
  }
}
