import React from 'react';
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../index.css';
import { Switch } from 'antd';

class Light extends React.Component {

    onChange(checked) {
        console.log(`switch to ${checked}`);
    }

    render() {
        return (
            <div>
                <p>Light: <Switch defaultChecked onChange={this.onChange} /> </p>
            </div>
        );
    }

}

export default Light;
