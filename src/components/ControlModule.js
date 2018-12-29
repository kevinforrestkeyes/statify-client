import React, {Component} from 'react';
import '../styles/ControlModule.css';

class ControlModule extends Component {
	constructor() {
		super();
		this.state = {
			data: {},
		};
	}

	componentDidMount() {}

	handleControlClick(setting, value) {
		const active_button = document.querySelector('[data-value=' + value + ']');
		const parent_element = active_button.parentElement;
		if (setting === 'metric') {
			const metric_parent = parent_element.parentElement;
			for (let button_row of metric_parent.childNodes) {
				for (let button of button_row.childNodes) {
					button.classList.remove('active');
				}
			}
		} else {
			for (let sibling of parent_element.childNodes) {
				sibling.classList.remove('active');
			}
		}
		active_button.classList.add('active');
		this.props.handleControlClick(setting, value);
	}

	render() {
		return (
			<div className="module__control">
				<div className="data-selectors">
					<div className="group-selector">
						<span className="selector-label">top:</span>
						<button
							className="active"
							onClick={() => this.handleControlClick('area', 'artists')}
							data-value="artists">
							artists
						</button>
						<button
							onClick={() => this.handleControlClick('area', 'songs')}
							data-value="songs">
							songs
						</button>
					</div>
					<div className="term-selector">
						<span className="selector-label">term:</span>
						<button
							className="active"
							onClick={() => this.handleControlClick('term', 'long')}
							data-value="long">
							long
						</button>
						<button
							onClick={() => this.handleControlClick('term', 'medium')}
							data-value="medium">
							medium
						</button>
						<button
							onClick={() => this.handleControlClick('term', 'short')}
							data-value="short">
							short
						</button>
					</div>
				</div>
				<div className="metric-selector">
					<span className="selector-label">metric:</span>
					<div className="button-container">
						<div className="button-row">
							<button
								className="active"
								onClick={() => this.handleControlClick('metric', 'popularity')}
								data-value="popularity">
								popularity
							</button>
							<button
								onClick={() => this.handleControlClick('metric', 'explicit')}
								data-value="explicit">
								explicit
							</button>
						</div>
						<div className="button-row">
							<button
								onClick={() => this.handleControlClick('metric', 'genre')}
								data-value="genre">
								genre
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ControlModule;
