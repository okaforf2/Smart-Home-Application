import React from 'react';
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../index.css';
import { Slider } from 'antd';

// Switch should be set to actual light status but will leave it at off for now
class Light extends React.Component {
    state = {
        switchState: 0
    };
    handlePressed = (e) => {
        const { websocket } = this.props;
        const message = { type: 'light', state: e/25 }
        websocket.send(JSON.stringify(message))
        console.log(e);
        this.setState({
            switchState: e
        });
        // if (this.state.isSwitchOn === false) {
        //     console.log('Light is now on, changed from off');            
        // } else {
        //     console.log('Light is now off, changed from on');
        // }
    }

    passStatus = messageStatus =>
        this.setState(state => ({ switchOff: [messageStatus, ...state.switchOff] }))

    changeSwitchState(state) {
        console.log("Switch state was changed externally");
        this.setState({
            isSwitchOn: state
        });
    }

// 25% (light)

    render() {
        // const buttonPressed = this.state.buttonPressed
        const marks = {
            0: '0%',
            25: '25%',
            50: '50%',
            75: '75%',
            100: {
              style: {
                color: '#f50',
              },
              label: <strong>100%</strong>,
            },
          };
        return (
            <div>
                {/* <p>Light: <Switch defaultChecked onClick={this.handlePressed} checked={this.state.isSwitchOn} /> </p> */}


                <p>Light: <Slider marks={marks} step={null} defaultValue={0} onChange={this.handlePressed} checked={this.state.isSwitchOn}/> </p>
            </div>
        );
    }

}

export default Light;
