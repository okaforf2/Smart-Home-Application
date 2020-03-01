import React from 'react';
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../index.css';
import { Switch } from 'antd';

// Switch should be set to actual light status but will leave it at off for now
class Light extends React.Component {
    state = {
        isSwitchOn: false
    };
    handlePressed = (e) => {
        const { websocket } = this.props;
        const message = { type: 'light', state: e }
        websocket.send(JSON.stringify(message))
        console.log(e);
        this.setState({
            isSwitchOn: e
        });
        if (this.state.isSwitchOn === false) {
            console.log('Light is now on, changed from off');            
        } else {
            console.log('Light is now off, changed from on');
        }
    }

    passStatus = messageStatus =>
        this.setState(state => ({ switchOff: [messageStatus, ...state.switchOff] }))

    changeSwitchState(state) {
        console.log("Switch state was changed externally");
        this.setState({
            isSwitchOn: state
        });
    }

    // submitMessage = messageString => {
    // 	// on submitting the ChatInput form, send the message, add it to the list and reset the input
    // 	if (String(messageString).length !== 0) {
    // 		const message = { type: 'message', name: this.state.name, message: messageString }
    // 		this.ws.send(JSON.stringify(message))
    // 		this.addMessage(message)
    // 	}
    // }


    // onChange(checked) {
    //     console.log(`switch to ${checked}`);
    // }


    render() {
        // const buttonPressed = this.state.buttonPressed
        return (
            <div>
                <p>Light: <Switch defaultChecked onClick={this.handlePressed} checked={this.state.isSwitchOn} /> </p>
            </div>
        );
    }

}

export default Light;
