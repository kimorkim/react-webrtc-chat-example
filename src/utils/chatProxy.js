import { Topics } from './topics';
import io from 'socket.io-client';
const EventEmitter = require('events');

export default class ChatProxy extends EventEmitter {
    constructor(props) {
        super(props);
        this._peers = {};
    }

    connect(username) {
        this.setUsername(username);
        this.socket = io();
        this.socket.on('connect', () => {
            this.socket.on(Topics.USER_CONNECTED, (userId) => {
                console.log('sadsadsad8421', userId, this.getUsername());
                if (userId === this.getUsername()) {
                    return;
                }
                this._connectTo(userId);
                this.emit(Topics.USER_CONNECTED, userId);
                console.log('User connected', userId);
            });
            this.socket.on(Topics.USER_DISCONNECTED, (userId) => {
                if (userId === this.getUsername()) {
                    return;
                }
                this._disconnectFrom(userId);
                this.emit(Topics.USER_DISCONNECTED, userId);
                console.log('User disconnected', userId);
            });
        });
        console.log('Connecting with username', username);
        // eslint-disable-next-line
        this.peer = new Peer(username, {
            host: window.location.hostname,
            port: 80,
            path: '/chat',
        });
        this.peer.on('open', (userId) => {
            this.setUsername(userId);
        });
        this.peer.on('connection', (conn) => {
            console.log('connection', conn.peer);
            this._registerPeer(conn.peer, conn);
            this.emit(Topics.USER_CONNECTED, conn.peer);
        });
    }

    onMessage(cb) {
        this.addListener(Topics.USER_MESSAGE, cb);
    }

    getUsername() {
        return this._username;
    }

    setUsername(username) {
        this._username = username;
    }

    onUserConnected(cb) {
        this.addListener(Topics.USER_CONNECTED, cb);
    }

    onUserDisconnected(cb) {
        this.addListener(Topics.USER_DISCONNECTED, cb);
    }

    send(user, message) {
        this._peers[user].send(message);
    }

    broadcast(msg) {
        for (var peer in this._peers) {
            this.send(peer, msg);
        }
    }

    _connectTo(username) {
        console.log('_connectTo');
        var conn = this.peer.connect(username);
        conn.on(
            'open',
            function() {
                this._registerPeer(username, conn);
            }.bind(this)
        );
    }

    _registerPeer(username, conn) {
        console.log('Registering', username);
        this._peers[username] = conn;
        conn.on(
            'data',
            function(msg) {
                console.log('Messaga received', msg);
                this.emit(Topics.USER_MESSAGE, {
                    content: msg,
                    author: username,
                });
            }.bind(this)
        );
    }

    _disconnectFrom(username) {
        delete this._peers[username];
    }
}
