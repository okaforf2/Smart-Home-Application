import React from 'react';
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../index.css';
import { Switch } from 'antd';

const URL = 'ws://localhost:8000'
// Switch should be set to actual light status but will leave it at off for now
class Light extends React.Component {
    state = {
    switchOff: false
    };  
      handlePressed = (e) => {
        if (this.setState.switchOff === false ){
          console.log('Light is off. Changing to on.');
          this.setState.switchOff = true;
        } else {
          console.log('Light is on. Changing to off.');
          this.setState.switchOff = false;
        }
      }
    

	ws = new WebSocket(URL)

	componentDidMount() {
		this.ws.onopen = () => {
			// on connecting, do nothing but log it to the console
			console.log('connected')
		}

		this.ws.switchOff = evt => {
			// on receiving a message, add it to the list of messages
			console.log(evt);
			const messageStatus = JSON.parse(evt.data)
			this.passStatus(messageStatus)
		}


		// this.ws.onclose = () => {
		// 	console.log('disconnected')
		// 	// automatically try to reconnect on connection loss
		// 	this.setState({
		// 		ws: new WebSocket(URL),
		// 	})
		// }
	}

	passStatus = messageStatus =>
		this.setState(state => ({ switchOff: [messageStatus, ...state.switchOff] }))

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
                <p>Light: <Switch defaultChecked   onClick={this.handlePressed} /> </p>
            </div>
        );
    }

}

export default Light;
