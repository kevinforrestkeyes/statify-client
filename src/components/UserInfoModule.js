import React, {Component} from 'react';
import '../styles/UserInfoModule.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class UserInfoModule extends Component {
	constructor() {
		super();
		this.state = {
			user_info: {
				user_display_name: '',
				user_image: '',
			},
		};
	}

	componentDidMount() {
		spotifyApi.setAccessToken(this.props.token);
		this.getUserInfo();
	}

	getUserInfo() {
		spotifyApi.getMe().then(response => {
			this.handleUserInfoData(response);
		});
	}

	handleUserInfoData(response) {
		if (response.item !== null) {
			const user_display_name = response.display_name;
			const user_image = response.images[0].url;
			this.setState({
				user_info: {
					user_display_name: user_display_name,
					user_image: user_image,
				},
			});
		}
	}

	render() {
		return (
			<div className="module__user-info">
				<div className="user-info">
					{
						<img
							className="user-image"
							src={this.state.user_info.user_image}
							alt={this.state.user_info.user_display_name}
						/>
					}
					<div className="info-fields">
						<p className="info-field name">
							{this.state.user_info.user_display_name}
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default UserInfoModule;
