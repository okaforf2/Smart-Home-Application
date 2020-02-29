import React, { Component } from 'react';
// import { w3cwebsocket as W3CWebSocket } from "websocket";
// import Chat from './components/Chat'
// import Alarm from './components/Alarm'
import Light from './components/Light'
import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;
class App extends Component {
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
        <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Kitchen</Breadcrumb.Item>
        <Breadcrumb.Item>Toilet</Breadcrumb.Item>
        <Breadcrumb.Item>Garage</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          
      {/* <Alarm /> */}
      <br />
      <Light /> 
      <br />
      {/* <Chat /> */}
          
          </div>     

    </Content>
    <Footer style={{ textAlign: 'center' }}>Team Rabbit ;)</Footer>
  </Layout>

          );
         
    }
}

export default App;
