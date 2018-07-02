const PeerServer = require('peer').PeerServer;
const express = require("express");
const path = require("path");
const app = express();
const port = parseInt(process.env.PORT) || 3000;
const Topics = {
    USER_CONNECTED: 'user-connected',
    USER_DISCONNECTED: 'user-disconnected',
    USER_MESSAGE: 'user-message'
};

app.use(express.static(path.join(__dirname, "build")));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

const server = app.listen(port, () => {
    console.log('Server Start');
});

const io = require('socket.io').listen(server);

console.log('Listening on port', port);

var peerServer = new PeerServer({ port: 9000, path: '/chat' });

peerServer.on('connection', function (id) {
    io.emit(Topics.USER_CONNECTED, id);
    console.log('User connected with #', id);
});

peerServer.on('disconnect', function (id) {
    io.emit(Topics.USER_DISCONNECTED, id);
    console.log('User disconnected with #', id);
});