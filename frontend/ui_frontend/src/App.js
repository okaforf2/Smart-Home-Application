import React, { Component } from 'react';
// import { w3cwebsocket as W3CWebSocket } from "websocket";
import Chat from './components/Chat'
import Alarm from './components/Alarm'
import Light from './components/Light'


class App extends Component {
  
    render() {
        return (
            <div style={{paddingRight: 10, paddingLeft: 10}}>
                <br />
                <Alarm />
                <br />
                <Light />
                <br />
                <Chat />
            </div>
        );
         
    }
}

export default App;