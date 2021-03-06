import React, { Component } from 'react';
import { ChatFeed, Message } from 'react-chat-ui';
import './App.css';

class App extends Component {
    state = {
        users: [],
        username: 'default' + Math.ceil(Math.random() * 10000),
        is_typing: false,
        messages: [],
    };
    componentDidMount() {
        const { ChatProxy } = this.props;
        const { username } = this.state;
        this.chatProxy = ChatProxy;
        this.chatProxy.connect(username);
        this.chatProxy.onMessage(this.addMessage);
        this.chatProxy.onUserConnected(this.userConnected);
        this.chatProxy.onUserDisconnected(this.userDisconnected);
    }
    addMessage = ({ content, author }) => {
        this.setState(({ messages, username }) => {
            return {
                messages: [
                    ...messages,
                    {
                        id: 1,
                        message: content,
                        senderName: author,
                    },
                ],
            };
        });
    };
    userConnected = () => {
        console.log('userConnected');
    };
    userDisconnected = () => {
        console.log('userDisconnected');
    };
    send = () => {
        const { input = {} } = this.refs;
        const { value = '...' } = input;
        this.chatProxy.broadcast(value);
        this.setState(({ messages, username }) => {
            return {
                messages: [
                    ...messages,
                    {
                        id: 0,
                        message: value,
                        senderName: username,
                    },
                ],
            };
        });
    };
    render() {
        const { messages } = this.state;
        return (
            <div>
                <ChatFeed
                    messages={messages}
                    isTyping={this.state.is_typing}
                    hasInputField={false}
                    showSenderName={true}
                />
                <input ref="input" />
                <button onClick={this.send}>send</button>
            </div>
        );
    }
}

export default App;
