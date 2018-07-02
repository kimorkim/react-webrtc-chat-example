const PeerServer = require('peer').PeerServer;
const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');
const app = express();
const port = parseInt(process.env.PORT) || 3000;
const proxy = new httpProxy.createProxyServer({
    target: {
        host: 'localhost',
        port: 9000,
    },
});
const Topics = {
    USER_CONNECTED: 'user-connected',
    USER_DISCONNECTED: 'user-disconnected',
    USER_MESSAGE: 'user-message',
};

app.use(express.static(path.join(__dirname, 'build')));

app.post('/chat/*', function(req, res) {
    proxy.web(req, res);
});

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = app.listen(port, () => {
    console.log(`Server Start ${port}`);
});

const io = require('socket.io').listen(server);

server.on('upgrade', function (req, socket, head) {
    if(req.url.indexOf('/chat') > -1) {
        proxy.ws(req, socket, head);
    }
});

console.log('Listening on port', port);

var peerServer = new PeerServer({ port: 9000, path: '/chat' });

peerServer.on('connection', function(id) {
    io.emit(Topics.USER_CONNECTED, id);
    console.log('User connected with #', id);
});

peerServer.on('disconnect', function(id) {
    io.emit(Topics.USER_DISCONNECTED, id);
    console.log('User disconnected with #', id);
});
