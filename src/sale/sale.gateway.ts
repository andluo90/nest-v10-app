import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { SaleService } from './sale.service';

@WebSocketGateway({ cors: true }) // 不要写 path
export class SaleGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() server: Server;

  handleConnection(client: WebSocket) {
    console.log('客户端已连接');

    client.on('message', (msg: string) => {
      console.log('收到消息：', msg);
    });
  }

  afterInit() {
    console.log('WebSocket 已初始化');
  }
}