import React, {Component} from 'react';
import '../styles/TopModule.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class TopModule extends Component {
	constructor() {
		super();
		this.state = {
			term: 'long_term',
			area: 'artists',
			data: {},
		};
	}

	componentDidMount() {
		spotifyApi.setAccessToken(this.props.token);
		this.getTop(this.props.area, this.props.term);
	}

	componentDidUpdate() {
		if (
			this.props.term !== this.state.term ||
			this.props.area !== this.state.area
		) {
			this.getTop(this.props.area, this.props.term);
		}
	}

	getTop(area, term) {
		if (area === 'artists') {
			spotifyApi
				.getMyTopArtists({
					limit: 50,
					time_range: term,
				})
				.then(response => {
					this.handleTopData(response, term, area);
				});
		} else if (area === 'songs') {
			spotifyApi
				.getMyTopTracks({
					limit: 50,
					time_range: term,
				})
				.then(response => {
					this.handleTopData(response, term, area);
				});
		}
	}

	handleTopData(response, term, area) {
		let data = [];
		let ranking = 1;
		if (area === 'artists') {
			for (let entry of response.items) {
				const artist_name = entry.name;
				const artist_genres = entry.genres;
				const artist_id = entry.id;
				const arist_popularity = entry.popularity;
				const data_entry = {
					artist_name: artist_name,
					artist_genres: artist_genres,
					artist_id: artist_id,
					arist_popularity: arist_popularity,
					artist_ranking: ranking,
				};
				data.push(data_entry);
				ranking++;
			}
		} else if (area === 'songs') {
			for (let entry of response.items) {
				const artist_name = entry.artists.map(artist => artist.name).join(', ');
				const song_name = entry.name;
				const album_name = entry.album.name;
				const song_id = entry.id;
				const song_popularity = entry.popularity;
				const song_duration = entry.duration / 1000;
				const data_entry = {
					artist_name: artist_name,
					song_name: song_name,
					album_name: album_name,
					song_id: song_id,
					song_popularity: song_popularity,
					song_duration: song_duration,
					song_ranking: ranking,
				};
				data.push(data_entry);
				ranking++;
			}
		}
		this.setState({
			area: area,
			term: term,
			data: data,
		});
	}

	renderData(area, limit, offset = 0) {
		const upper_limit = limit + offset;
		if (this.state.data.length > 0) {
			let top_list = [];
			for (let entry of this.state.data) {
				if (area === 'artists') {
					if (
						entry.artist_ranking > offset &&
						entry.artist_ranking <= upper_limit
					) {
						top_list.push(
							<li key={entry.artist_id} className="entry">
								<p className="name">
									{entry.artist_ranking}. {entry.artist_name}
								</p>
							</li>
						);
					}
				} else if (area === 'songs') {
					if (
						entry.song_ranking > offset &&
						entry.song_ranking <= upper_limit
					) {
						top_list.push(
							<li key={entry.song_id} className="entry">
								<p className="name">
									{entry.song_ranking}. {entry.song_name} - {entry.artist_name}
								</p>
							</li>
						);
					}
				}
			}
			return top_list;
		}
	}

	render() {
		return (
			<div className="module__top">
				<div className="module-heading">
					<h2 className="module-title">
						top {this.state.area} {this.state.term}
					</h2>
				</div>
				<ol className="top-list section-1">
					{this.renderData(this.state.area, 25)}
				</ol>
				<ol className="top-list section-2">
					{this.renderData(this.state.area, 25, 25)}
				</ol>
			</div>
		);
	}
}

export default TopModule;
