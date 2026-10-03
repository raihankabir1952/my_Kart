import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RatingsGateway {
  @WebSocketServer()
  server: Server;

  emitRatingUpdate(
    productId: string,
    data: {
      averageRating: number;
      totalRatings: number;
    },
  ) {
    this.server.emit('ratingUpdated', {
      productId,
      ...data,
    });
  }
}