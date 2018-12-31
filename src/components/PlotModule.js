import React, {Component} from 'react';
import '../styles/PlotModule.css';
import Plot from 'react-plotly.js';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class PlotModule extends Component {
	constructor() {
		super();
		this.state = {
			chart_type: 'pie',
			metric: 'explicit',
			term: 'long',
			area: 'artists',
			values: [],
			labels: [],
		};
	}

	componentDidMount() {
		spotifyApi.setAccessToken(this.props.token);
		this.getTop(this.props.area, this.props.term, this.props.metric);
	}

	componentDidUpdate() {
		if (
			this.props.term !== this.state.term ||
			this.props.area !== this.state.area ||
			this.props.metric !== this.state.metric
		) {
			this.getTop(this.props.area, this.props.term, this.props.metric);
		}
	}

	getTop(area, term, metric) {
		if (area === 'artists') {
			spotifyApi
				.getMyTopArtists({
					limit: 50,
					time_range: term,
				})
				.then(response => {
					this.handleTopData(response, term, area, metric);
				});
		} else if (area === 'songs') {
			spotifyApi
				.getMyTopTracks({
					limit: 50,
					time_range: term,
				})
				.then(response => {
					this.handleTopData(response, term, area, metric);
				});
		}
	}

	async handleTopData(response, term, area, metric) {
		if (metric === 'genre') {
			const genres = await this.parseGenreData(response, area);
			this.handleGenreData(genres);
			this.setState({
				chart_type: 'pie',
				area: area,
				term: term,
				metric: metric,
			});
		} else if (metric === 'explicit') {
			if (area === 'artists') {
				this.setState({
					chart_type: 'unsupported',
					area: area,
					term: term,
					metric: metric,
				});
			} else if (area === 'songs') {
				const [explicit_count, clean_count] = await this.parseExplicitData(
					response
				);
				this.handleExplicitData(explicit_count, clean_count);
				this.setState({
					area: area,
					term: term,
					metric: metric,
				});
			}
		} else if (metric === 'popularity') {
			const popularity_array = await this.parsePopularityData(response, area);
			this.handlePopularityData(popularity_array);
			this.setState({
				area: area,
				term: term,
				metric: metric,
			});
		}
	}

	async parsePopularityData(response, area) {
		let popularity_array = [];
		for (let i = 1; i <= 10; i++) {
			let index = i * 10;
			popularity_array[index] = 0;
		}
		if (area === 'artists') {
			for (let artist of response.items) {
				let popularity = Math.ceil(artist.popularity / 10) * 10;
				popularity_array[popularity] = popularity_array[popularity] + 1;
			}
		} else if (area === 'songs') {
			for (let song of response.items) {
				let popularity = Math.ceil(song.popularity / 10) * 10;
				popularity_array[popularity] = popularity_array[popularity] + 1;
			}
		}
		return popularity_array;
	}

	handlePopularityData(popularity_array) {
		const labels = Object.keys(popularity_array).map(
			value => parseInt(value) - 10 + ' - ' + (parseInt(value) - 1)
		);
		const value_set = popularity_array.filter(function(item) {
			return item !== undefined;
		});
		this.setState({
			chart_type: 'bar',
			values: value_set,
			labels: labels,
		});
	}

	async parseExplicitData(response) {
		let explicit_count = 0;
		let clean_count = 0;
		for (let song of response.items) {
			if (song.explicit) {
				explicit_count++;
			} else {
				clean_count++;
			}
		}
		return [explicit_count, clean_count];
	}

	handleExplicitData(explicit_count, clean_count) {
		this.setState({
			chart_type: 'pie',
			values: [explicit_count, clean_count],
			labels: ['explicit', 'clean'],
		});
	}

	async parseGenreData(response, area) {
		let genres = {};
		if (area === 'artists') {
			for (let artist of response.items) {
				for (let genre of artist.genres) {
					if (genres[genre]) {
						genres[genre] = genres[genre] + 1;
					} else {
						genres[genre] = 1;
					}
				}
			}
		} else if (area === 'songs') {
			for (let song of response.items) {
				const artist_id_set = song.artists.map(artist => artist.id);
				for (let artist_id of artist_id_set) {
					let response = await spotifyApi.getArtist(artist_id);
					for (let genre of response.genres) {
						if (genres[genre]) {
							genres[genre] = genres[genre] + 1;
						} else {
							genres[genre] = 1;
						}
					}
				}
			}
		}
		return genres;
	}

	handleGenreData(genres) {
		let sortable_array = [];
		for (let genre in genres) {
			sortable_array.push([genre, genres[genre]]);
		}
		sortable_array.sort(function(a, b) {
			return b[1] - a[1];
		});
		let top_genres = sortable_array.slice(0, 10);
		let sum = 0;
		for (let top_genre of top_genres) {
			sum += top_genre[1];
		}
		let small_percent = 100 / sum;
		let values = [];
		let genre_names = [];
		for (let top_genre of top_genres) {
			let percentage = Math.round(top_genre[1] * small_percent * 100) / 100;
			top_genre[2] = percentage;
			values.push(percentage);
			genre_names.push(top_genre[0]);
		}
		this.setState({
			values: values,
			labels: genre_names,
		});
	}

	render() {
		return (
			<div className={`module__plot ${this.state.metric} ${this.state.chart_type}`}>
				{this.state.chart_type === 'pie' && (
					<Plot className="plot"
						data={[
							{
								type: this.state.chart_type,
								values: this.state.values,
								labels: this.state.labels,
								marker: {
									colors: ['#293372','#909CF1','#1D2241','#7E8EF3','#6F7280','#A8AECD','#2B3256','#333541','#4B5383','#5263CB']
								}
							},
						]}
						layout={{
							title: `${this.state.metric} ${this.state.area} ${
								this.state.term
							}`,
							autosize: true,
							margin: {
								l: 24,
								r: 24,
								t: 24,
								b: 36,
							},
							legend: {
								"orientation": "h"
							},
							xaxis: {
								fixedrange: true
							},
							yaxis: {
								fixedrange: true
							}
						}}
					/>
				)}
				{this.state.chart_type === 'bar' && (
					<Plot className="plot"
						data={[
							{
								type: this.state.chart_type,
								x: this.state.labels,
								y: this.state.values,
								marker: {
									color: "#3D4470",
								},
								hoverinfo: 'none',
							},
						]}
						layout={{
							title: `${this.state.metric} ${this.state.area} ${
								this.state.term
							}`,
							autosize: true,
							margin: {
								l: 36,
								r: 24,
								t: 24,
								b: 40,
							},
							xaxis: {
								fixedrange: true,
								title: "popularity range",
								titlefont: {
									size: 14,
								},
								tickfont: {
									size: 8,
								}
							},
							yaxis: {
								fixedrange: true,
								title: "percentage of total",
								titlefont: {
									size: 14,
								},
								tickfont: {
									size: 8,
								}
							}
						}}
					/>
				)}
				{this.state.chart_type === 'unsupported' && (
					<div className="unsupported-message">
						<p className="message-text">
							chart not supported for selected combination
						</p>
					</div>
				)}
			</div>
		);
	}
}

export default PlotModule;
