import React, {Component} from 'react';
import '../styles/App.css';
import Module from './Module.js';

class App extends Component {
  constructor() {
    super();
    this.handleControlClick = this.handleControlClick.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
    const params = this.getHashParams();
    const token = params.access_token;
    this.getToken = function() {
      return token;
    };
    this.state = {
      loggedIn: token ? true : false,
      showInfo: false,
      nowPlaying: {
        name: 'Not Checked',
        albumArt: '',
      },
      contentView: {
        area: 'artists',
        term: 'long',
        metric: 'popularity',
      },
    };
  }

  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  toggleInfo() {
    if(this.state.showInfo) {
      this.setState({
        showInfo: false
      })
    } else {
      this.setState({
        showInfo: true
      })
    }
  }

  handleControlClick(setting, value) {
    console.log(this);
    if (setting === 'term') {
      this.setState({
        contentView: {
          term: value,
          area: this.state.contentView.area,
          metric: this.state.contentView.metric,
        },
      });
    } else if (setting === 'area') {
      this.setState({
        contentView: {
          term: this.state.contentView.term,
          area: value,
          metric: this.state.contentView.metric,
        },
      });
    } else if (setting === 'metric') {
      this.setState({
        contentView: {
          area: this.state.contentView.area,
          term: this.state.contentView.term,
          metric: value,
        },
      });
    }
  }

  render() {
    return (
      <div className="App" data-show-info={this.state.showInfo}>
      {!this.state.loggedIn && (
        <Module token={this.getToken()} module="login" />
      )}
      {this.state.loggedIn && (
        <div className="app-content">
          <div className="top-bar">
            <Module token={this.getToken()} module="user_info" />
            <Module token={this.getToken()} module="now_playing" />
            <Module
              module="control"
              handleControlClick={this.handleControlClick}
            />
          </div>
          <div className="content-section">
            <Module
              token={this.getToken()}
              module="plot"
              term={this.state.contentView.term + '_term'}
              area={this.state.contentView.area}
              metric={this.state.contentView.metric}
            />
            <Module
              token={this.getToken()}
              module="top"
              term={this.state.contentView.term + '_term'}
              area={this.state.contentView.area}
            />
          </div>
        </div>
      )}
      <div className="info-content">
        <Module token={this.getToken()} module="app_info"/>
      </div>
      <div className="info-button">
        <button onClick={this.toggleInfo}>
          <img src="/tooltip.png" className="info" alt="info"/>
        </button>
      </div>
      </div>
    );
  }
}

export default App;
