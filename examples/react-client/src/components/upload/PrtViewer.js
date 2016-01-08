import React from 'react';

/**
 * PrtViewer class documentation
 */
export default class PrtViewer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const echoServiceURL = GATEWAY_URL + '/api/echo/test';
    return (<div>
      <h1>Test Services</h1>
      <a href={echoServiceURL}>Echo test</a>
      <a href="http://www.filltext.com/?rows=10&id={numberLength|3}}&name={lorem|2}">Cases from FillText</a>
    </div>);
  }
}

PrtViewer.propTypes = {};

PrtViewer.defaultProps = {};
