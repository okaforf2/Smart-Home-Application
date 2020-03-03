import React from 'react';
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../index.css';
import { InputNumber } from 'antd';

// Switch should be set to actual light status but will leave it at off for now
class PowerUsageDisplay extends React.Component {
    state = {
        value: 0,
        disabled: true
    };

    changePowerUsageValueState(state) {
        console.log("Power usage value state was changed externally");
        this.setState({
            value: state
        });
    }

    render() {

        return (
            <div>
                <p>Power Usage: <InputNumber defaultValue={this.state.value} disabled={this.state.disabled} /> </p>
            </div>
        );
    }

}

export default PowerUsageDisplay;