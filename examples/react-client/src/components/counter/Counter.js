import React from 'react';

import './Counter.scss';

/**
 * Counter class documentation
 */
export default class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
  }

  handleIncrement() {
    this.setState({
      counter: this.state.counter + this.props.step
    });
  }

  handleDecrement() {
    this.setState({
      counter: this.state.counter - this.props.step
    });
  }

  render() {
    return (<div className="Counter">
        <h2>
          Counter (step = { this.props.step}): {this.state.counter}
        </h2>
        <a><span className="Counter__Button icon-add_circle_outline" onClick={this.handleIncrement.bind(this)}/></a>
        <a><span className="Counter__Button icon-remove_circle_outline" onClick={this.handleDecrement.bind(this)}/></a>
      </div>
    );
  }
}

Counter.propTypes = {
  step: React.PropTypes.number.isRequired
};

Counter.defaultProps = { step: 1 };
