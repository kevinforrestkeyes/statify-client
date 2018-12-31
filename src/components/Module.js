import React, {Component} from 'react';
import NowPlayingModule from './NowPlayingModule.js';
import LoginModule from './LoginModule.js';
import InfoModule from './AppInfoModule.js';
import UserInfoModule from './UserInfoModule.js';
import TopModule from './TopModule.js';
import ControlModule from './ControlModule.js';
import PlotModule from './PlotModule.js';
import '../styles/Module.css';

class Module extends Component {
	constructor() {
		super();
		this.state = {
			active: 'active',
		};
	}

	componentDidMount() {
		setInterval(() => this.checkForEmptyModule(), 1000);
	}

	checkForEmptyModule = () => {
		const current_module = document.querySelector('.module.' + this.props.module);
		const child_module = current_module.children[0];
		if (
			child_module.classList.contains('inactive') &&
			this.state.active === 'active'
		) {
			this.setState({
				active: 'inactive',
			});
		} else if (
			child_module.classList.contains('active') &&
			this.state.active === 'inactive'
		) {
			this.setState({
				active: 'active',
			});
		}
	};

	render() {
		return (
			<div className={'module ' + this.props.module + ' ' + this.state.active}>
				{this.props.module === 'login' && (
					<LoginModule />
				)}
				{this.props.module === 'app_info' && (
					<InfoModule />
				)}
				{this.props.module === 'user_info' && (
					<UserInfoModule token={this.props.token} />
				)}
				{this.props.module === 'now_playing' && (
					<NowPlayingModule token={this.props.token} />
				)}
				{this.props.module === 'control' && (
					<ControlModule handleControlClick={this.props.handleControlClick} />
				)}
				{this.props.module === 'top' && (
					<TopModule
						token={this.props.token}
						area={this.props.area}
						term={this.props.term}
					/>
				)}
				{this.props.module === 'plot' && (
					<PlotModule
						token={this.props.token}
						area={this.props.area}
						term={this.props.term}
						metric={this.props.metric}
					/>
				)}
			</div>
		);
	}
}

export default Module;
