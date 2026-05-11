import {WebSocketServer, WebSocket} from 'ws';

const wss = new WebSocketServer({port: 8080});
console.log(`WebSocket server is running on ${wss.options.port}`);


wss.on('connection', (socket, request) => {
  const ip = request.socket.remoteAddress;
  socket.on('message', (rawData) => {
      const msg = rawData.toString();
      console.log(`Received message from ${ip}: ${msg}`);

      wss.clients.forEach(client => {
          if(client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({message: `Broadcast: ${msg}`}));
          }
      })
  })

  socket.on('error', (error) => {
      console.log(`Error: ${error} :`, {ip});
  })

  socket.on('close', () => {
    console.log('Client disconnected:',{ip});
  })
});