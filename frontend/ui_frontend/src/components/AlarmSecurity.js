import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../index.css';
import { Slider, Switch } from 'antd';

// Switch should be set to actual light status but will leave it at off for now
class AlarmSecurity extends Component {
    state = {
        switchState: 0,
        doorState: 0
    };
    
    handlePressed = (e) => {
        let holder = 0
        if(e){
        holder = 1;
}
        const { websocket } = this.props;
        const message = { type: 'alarm', state: holder}
        websocket.send(JSON.stringify(message))
        console.log(holder);
        this.setState({
            switchState: holder
        });
    }

    doorHandle = (e) => {
        let holder2 = 0
        if(e){
        holder2 = 1;
}
        const { websocket } = this.props;
        const message = { type: 'door', state: holder2}
        websocket.send(JSON.stringify(message))
        console.log(holder2);
        this.setState({
            doorState: holder2
        });
    }

    passStatus = messageStatus =>
        this.setState(state => ({ switchOff: [messageStatus, ...state.switchOff] }))

    changeSwitchState(state) {
        console.log("Switch state was changed externally");
        this.setState({
            isSwitchOn: state
        });
    }

    render(){
        const date = new Date()
        const hours = date.getHours()
        let timeOfDay

        let alarmText
        {this.state.switchState && hours > 12? alarmText = "Alarm Activated" : alarmText = "Alarm Deactivated"}

        // {this.state.switchState && hours >= 12 && hours < 17? alarmText = "Alarm Activated" : alarmText = "Alarm Deactivated"}

        let doorText
        {this.state.doorState? doorText = "Door Alarm Activated" : doorText = "Door Alarm Deactivated"}
        return(
            <div>
        <Switch 
        name="House Alarm" 
        checkedChildren="Alarm On"
        unCheckedChildren="Alarm Off"
        onChange={this.handlePressed} 
        />
        <h1>{alarmText}</h1>
        <br />
        <Switch 
        name="Door" 
        checkedChildren="Door Locked"
        unCheckedChildren="Door Unlocked"
        onChange={this.doorHandle} 
        />
        <h1>{doorText}</h1>
        </div>
        );
    }

}

export default AlarmSecurity;
