const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path'); // Importez le module path

const PORT = process.env.PORT || 3000;
const app = express();

// Création d'un serveur HTTP
const server = http.createServer(app);

// Définir le répertoire contenant les fichiers statiques (comme le fichier HTML)
app.use(express.static(path.join(__dirname, 'PFA_MAP')));

// Création d'un serveur WebSocket attaché au serveur HTTP
const wss = new WebSocket.Server({ server });

// Écoute des connexions WebSocket
wss.on('connection', function connection(ws) {
  console.log('Client connected');

  // Événement déclenché lorsqu'un message est reçu du client
  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);

    // Redistribuer le message à tous les clients connectés
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// Démarrage du serveur HTTP
server.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
