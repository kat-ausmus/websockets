import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const wss = new WebSocketServer({ server });

console.log(`Server is running on http://localhost:8080`);

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
server.listen(8080);
