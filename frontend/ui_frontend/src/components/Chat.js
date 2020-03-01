// NO.1
import React, { Component } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

class Chat extends Component {
	state = {
		name: 'Bob',
		messages: [],
	}

	addMessage = message =>
		this.setState(state => ({ messages: [message, ...state.messages] }))

	submitMessage = messageString => {
		// on submitting the ChatInput form, send the message, add it to the list and reset the input
		if (String(messageString).length !== 0) {
			const { websocket } = this.props;
			const message = { type: 'message', name: this.state.name, message: messageString }
			websocket.send(JSON.stringify(message))
			this.addMessage(message)
		}
	}

	render() {
		return (
			<div className="NameForm">
				<div>
					<h1>Message Board</h1>
				</div>
				<label htmlFor="name">
					Name:&nbsp;
				<input
						// style={{ position: 'absolute', right: '150px', width: '200px', height: '120px'}}
						type="text"
						id={'name'}
						placeholder={'Enter your name...'}
						value={this.state.name}
						onChange={e => this.setState({ name: e.target.value })}
					/>
				</label>

				{/* Chat input component */}
				<ChatInput
					ws={this.ws}
					onSubmitMessage={messageString => this.submitMessage(messageString)}
				/>

				{/* Chat Message component */}
				{this.state.messages.map((message, index) =>
					<ChatMessage
						key={index}
						message={message.message}
						name={message.name}
					/>,
				)}
			</div>
		)
	}
}

export default Chat
