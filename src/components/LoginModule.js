import React, { Component } from 'react';
import '../styles/LoginModule.css';

class LoginModule extends Component {
	constructor() {
		super();
		this.state = {};
	}

	componentDidMount() {
		console.log(process.env);
	}

	render() {
		return (
			<div className="module__login">
				<a className="login-button" href="https://statify-server.herokuapp.com/">
					get started
				</a>
			</div>
		);
	}
}

export default LoginModule;
