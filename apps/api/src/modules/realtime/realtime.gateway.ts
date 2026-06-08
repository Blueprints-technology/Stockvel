import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  broadcastOverview(payload: unknown) {
    this.server.emit('market:overview', payload);
    this.logger.debug('Broadcasted market overview');
  }

  broadcastPriceUpdate(type: 'stock' | 'crypto', payload: unknown) {
    this.server.emit(`${type}:price-update`, payload);
  }
}
