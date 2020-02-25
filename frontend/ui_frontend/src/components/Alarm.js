import React from 'react'
import '../index.css'
import 'antd/dist/antd.css';
import { Switch } from 'antd';

class Alarm extends React.Component {
    onChange(checked) {
        console.log(`switch to ${checked}`);
    }

    render() {
        return (
            <div>
                <p>Alarm: <Switch defaultChecked onChange={this.onChange} /> </p>
            </div>
        );
    }

}


export default Alarm;