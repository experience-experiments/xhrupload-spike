import React, { Component } from 'react';
import { Link } from 'react-router';

import './App.scss';

export class App extends Component {

  render() {
    return (
      <div className="App">
        <nav className="App__Menu">
          <Link className="App__MenuItem" to="/upload">Uploader</Link>
          <Link className="App__MenuItem" to="/counter">Counter</Link>
        </nav>
        {this.props.children}
      </div>
    );
  }
}
