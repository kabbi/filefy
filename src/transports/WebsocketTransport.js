import websocket from 'websocket-stream';

import { randomUUID } from '../utils/Random';

export default class WebsocketTransport {

  static share(brokerAddr, server) {
    const addr = `${brokerAddr}?session=${randomUUID()}`;
    const socket = websocket(addr);
    server.share(socket);
    return addr;
  }

  static join(addr, client) {
    const socket = websocket(addr);
    client.connect(socket);
  }
}
