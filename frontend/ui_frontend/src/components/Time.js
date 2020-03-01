import React, { Component } from 'react'

class Time extends Component {
    render() {
        const date = new Date()
        const hours = date.getHours()
        let timeOfDay
        
        if (hours < 12) {
            timeOfDay = "Morning"
        } else if (hours >= 12 && hours < 17) {
            timeOfDay = "Afternoon"
        } else {
            timeOfDay = "Night"
        }
        return (
            <h1 style={{color: 'blue'}}>Good {timeOfDay}</h1>
        )
    }
}

export default Time;