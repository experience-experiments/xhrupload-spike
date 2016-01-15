import React, { Component } from 'react';
import { Link } from 'react-router';

export class App extends Component {

  static get propTypes() {
    return {
      style: React.PropTypes.object,
      menuStyle: React.PropTypes.object,
      menuItemStyle: React.PropTypes.object
    };
  }

  static get defaultProps() {
    return {
      style: {},
      menuStyle: {
        backgroundColor: '#9da0a4',
        padding: 10
      },
      menuItemStyle: {
        textDecoration: 'none',
        color: '#ffffff',
        padding: 10
      }
    };
  }

  render() {
    const {style, menuStyle, menuItemStyle} = this.props;
    return (
      <div style={style}>
        <nav style={menuStyle}>
          <Link style={menuItemStyle} to="/upload">Uploader</Link>
          <Link style={menuItemStyle} to="/counter">Counter</Link>
        </nav>
        {this.props.children}
      </div>
    );
  }
}
