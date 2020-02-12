import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Input from './components/Input.js'

const client = new W3CWebSocket('ws://localhost:8000');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentWillMount() {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            try {
                var jsonParsed = JSON.parse(message.data);
                console.log(jsonParsed)
            } catch (err) {
                console.log(err);
            }
        };
    }

    handleClick(e) {
        e.preventDefault();
        console.log('The link was clicked.');
        client.send("test");
    }

    render() {
        return (
            //<Input client={client} />
            <a href="#" onClick={this.handleClick}>
                Click me
            </a>
        );
    }
}

export default App;