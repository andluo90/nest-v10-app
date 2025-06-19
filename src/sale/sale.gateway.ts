import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { SaleService } from './sale.service';

interface DataType {
  url:string
  sku:string
  saleHistory:{data:string,saleQuantity:string}[]
}

@WebSocketGateway({cors: {
    origin: ["https://api.bianxie.ai","https://detail.1688.com","https://air.1688.com"]
  }}) 
export class SaleGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly saleService: SaleService) {}

  handleConnection(client: WebSocket) {
    console.log('客户端已连接');

    client.on('message', async (msg: string) => {
      console.log('收到消息：',msg);
      // try {
      //   const data = JSON.parse(msg);
      //   await this.saleService.saveSaleData(data);
      //   client.send(JSON.stringify({ status: 'ok' }));
      // } catch (err) {
      //   console.error('Invalid message or save error', err);
      //   client.send(JSON.stringify({ status: 'error', error: err.message }));
      // }
    });

    client.on('saleData', async (data: DataType) => {
      console.log('收到saleData');
      try {
        await this.saleService.saveSaleData(data);
        console.log(`保存成功`);
        client.send(JSON.stringify({ status: 'ok' }));
      } catch (err) {
        console.error('Invalid message or save error', err);
        client.send(JSON.stringify({ status: 'error', error: err.message }));
      }
    });    

  }

  handleDisconnect(client: WebSocket) {
    console.log(`客户端已断开连接: ${client.id}`);
  }

  afterInit(server:Server) {
    console.log('WebSocket 已初始化');
  }
 

}