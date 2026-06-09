import { Server } from 'socket.io';
export declare class RealtimeGateway {
    server: Server;
    private readonly logger;
    broadcastOverview(payload: unknown): void;
    broadcastPriceUpdate(type: 'stock' | 'crypto', payload: unknown): void;
}
