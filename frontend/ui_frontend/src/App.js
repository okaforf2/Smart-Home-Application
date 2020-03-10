import React, { Component } from 'react';
// import { w3cwebsocket as W3CWebSocket } from "websocket";
//  import Chat from './components/Chat'
// import Alarm from './components/Alarm'
import Light from './components/Light'
import Time from './components/Time'
import PowerUsageDisplay from './components/PowerUsageDisplay'
import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;
const URL = 'ws://localhost:8000'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ws: null
        };
        this.chatChild = React.createRef();
        this.lightChild = React.createRef();
        this.powerUsageDisplayChild = React.createRef();
    }

    componentDidMount() {
        this.connect();
    }

    connect = () => {
        let ws = new WebSocket(URL);

        ws.onopen = () => {
            // on connecting, log it to the console
            console.log('connected')
            this.setState({ ws: ws });
        }

        ws.onmessage = evt => {
            console.log(evt);
            try {
                const message = JSON.parse(evt.data)
                switch (message.type) {
                    case "message":
                        this.passChatMessage(message);
                        break;
                    case "light":
                        this.changeLightSwitchState(message.state);
                        break;
                    case "power usage":
                        this.changePowerUsageState(message.state);
                        break;    
                    default:
                        break;
                }
            } catch (err) {
                console.log(err);
            }
        }

        ws.onclose = () => {
            console.log('disconnected')
            // automatically try to reconnect on connection loss
            this.setState({
                ws: new WebSocket(URL),
            })
        }
    }

    changeLightSwitchState(data) {
        this.lightChild.current.changeSwitchState(data);
    }

    changePowerUsageState(data) {
        this.powerUsageDisplayChild.current.changePowerUsageValueState(data);
    }

    passChatMessage(data) {
        this.chatChild.current.addMessage(data);
    }

    render() {

        return (
            <Layout className="layout">
                <Header>
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1">Kitchen</Menu.Item>
                        <Menu.Item key="2">Toilet</Menu.Item>
                        <Menu.Item key="3">Garage</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '20px 50px' }}>
                    <Breadcrumb style={{ margin: '16px 0px' }}>
                        {/* <Breadcrumb.Item>Kitchen</Breadcrumb.Item>
                        <Breadcrumb.Item>Toilet</Breadcrumb.Item>
                        <Breadcrumb.Item>Garage</Breadcrumb.Item> */}
                    </Breadcrumb>
                    <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                        <Time />
                        {/* <Alarm /> */}
                        <br />
                        <Light websocket={this.state.ws} ref={this.lightChild} />
                        <br />
                        {/* <Chat websocket={this.state.ws} ref={this.chatChild} /> */}
                        <br />
                        <PowerUsageDisplay websocket={this.state.ws} ref={this.powerUsageDisplayChild} />

                    </div>

                </Content>
                <Footer style={{ textAlign: 'center' }}>Team Rabbit ;)</Footer>
            </Layout>

        );

    }
}

export default App;
