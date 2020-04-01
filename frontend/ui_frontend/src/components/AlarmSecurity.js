import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../index.css';
import { Slider, Switch } from 'antd';

// Switch should be set to actual light status but will leave it at off for now
class AlarmSecurity extends Component {
    state = {
        switchState: 0
    };
    
    // probably done this wrong
    handlePressed = (e) => {
        let holder = 0
        if(e){
        holder = 1;
}
        const { websocket } = this.props;
        const message = { type: 'light', state: holder}
        // This line is buggy...
        websocket.send(JSON.stringify(message))
        console.log(holder);
        this.setState({
            switchState: holder
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
        let alarmText
        {this.state.switchState? alarmText = "Alarm Activated" : alarmText = "Alarm Deactivated"}
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
        <br />
        <Switch name="Door" checkedChildren="Door Locked" />
        </div>
        );
    }

}

export default AlarmSecurity;
