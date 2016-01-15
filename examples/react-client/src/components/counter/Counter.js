import React from 'react';

const MyH2 = ({step, counter}) => {
  MyH2.propTypes = {
    step: React.PropTypes.number,
    counter: React.PropTypes.number
  };
  return (
    <h2>
      Counter (step = {step}): {counter}
    </h2>
  );
};

/**
 * Counter class documentation
 */
export default class Counter extends React.Component {
  static get propTypes() {
    return {
      step: React.PropTypes.number.isRequired
    };
  }

  static get defaultProps() {
    return { step: 1 };
  }

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
    return (<div style={{backgroundColor: '#ececec', padding: 20}}>
        <MyH2 step={this.props.step} counter={this.state.counter}/>
        <a onClick={this.handleIncrement.bind(this)} className="icon-star-full icon-button">add</a><br/>
        <a onClick={this.handleDecrement.bind(this)} className="icon-star-empty icon-button">subtract</a>
      </div>
    );
  }
}
