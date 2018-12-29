import React, {Component} from 'react';
import '../styles/NowPlayingModule.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class NowPlayingModule extends Component {
	constructor() {
		super();
		this.state = {
			active: 'inactive',
			now_playing: {
				name: '',
				album_art: '',
			},
		};
	}

	componentDidMount() {
		spotifyApi.setAccessToken(this.props.token);
		setInterval(() => this.getNowPlaying(), 1000);
	}

	getNowPlaying() {
		spotifyApi.getMyCurrentPlaybackState().then(response => {
			this.handleNowPlayingData(response);
		});
	}

	handleNowPlayingData(response) {
		if (response.length !== 0) {
			if (response.item !== null) {
				const name = response.item.name;
				const artists = response.item.artists
					.map(artist => artist.name)
					.join(', ');
				const album_name = response.item.album.name;
				const album_art = response.item.album.images[0].url;
				this.setState({
					active: 'active',
					now_playing: {
						name: name,
						artist: artists,
						album_name: album_name,
						album_art: album_art,
					},
				});
			}
		} else {
			this.setState({
				active: 'inactive',
			});
		}
	}

	render() {
		return (
			<div className={'module__now-playing ' + this.state.active}>
				<div className="song-info">
					<img
						className="album-art"
						src={this.state.now_playing.album_art}
						alt={this.state.now_playing.name}
					/>
					<div className="info-fields">
						<span className="song">
							<p className="info-field song-title">
								{this.state.now_playing.name}
							</p>
						</span>
						<span className="artist-album">
							<p className="info-field artist-name">
								{this.state.now_playing.artist}
							</p>
							<p className="info-field separator">—</p>
							<p className="info-field album-name">
								{this.state.now_playing.album_name}
							</p>
						</span>
					</div>
				</div>
			</div>
		);
	}
}

export default NowPlayingModule;
