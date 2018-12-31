import React, {Component} from 'react';
import '../styles/AppInfo.css';

class AppInfo extends Component {
    constructor() {
        super();
        this.state = {
            
        };
    }

    render() {
        return (
            <div className="module__app-info">
                <h1 className="heading">statify</h1>
                <h2 className="sub-heading">react-based user interface for viewing certain statistics exposed through spotify's api</h2>
                <div className="author-tag">
                    <a href="https://github.com/kevinforrestkeyes">
                        <img className="github-profile" src="/github_icon.png" alt="github"/>
                        <h2 className="sub-heading">kevinforrestkeyes</h2>
                    </a>
                </div>
                <div className="info-body">
                    <p>this project was built using <a href="https://github.com/facebook/create-react-app">create-react-app</a>, <a href="https://github.com/thelinmichael/spotify-web-api-node">spotify-web-api-node</a>, and <a href="https://github.com/plotly/react-plotly.js">plotly.js</a></p>
                    <p>using spotify's api, we pull in certain aspects of the user's data and generate some simple graphs based on listening history. spotify only exposes a user's top 50 songs/artists for different time periods, and the specifics of this ranking system are unknown, so the data used is only based on these sets and is not complete.</p>
                    <p>the genre graph only represents your top 10 genres from the given data set. spotify associates several genres for each song/artist so you end of with 300+ individual genres per set, which was too many for a pie chart so i opted to just do the top 10.</p>
                    <p>the popularity graph represents the spread of spotify's assigned "popularity" score per each entry, from 0-100.</p>
                    <p>i plan to continue adding different stats and modules to this over time, if you have any ideas, questions, or suggestions, <a href="https://github.com/kevinforrestkeyes/statify-client">let me know</a>.</p>
                </div>
            </div>
        )
    }
}

export default AppInfo;