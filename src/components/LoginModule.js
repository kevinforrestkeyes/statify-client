import React, {Component} from 'react';
import '../styles/LoginModule.css';

class LoginModule extends Component {
	constructor() {
		super();
		this.state = {};
	}

	render() {
		return (
			<div className="module__login">
				<a className="login-button" href="http://localhost:8888">
					get started
				</a>
			</div>
		);
	}
}

export default LoginModule;
