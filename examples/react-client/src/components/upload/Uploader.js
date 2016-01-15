import React from 'react';

import XHRUpload from './XHRUpload';

const UPLOAD_URL = `http://${window.location.hostname}:3000/api/uploadfile`;

/**
 * Uploader class documentation
 */
export default class Uploader extends React.Component {

  render() {
    return (
    <div>
      <pre style={{fontSize: 10}}>
        {`
<XHRUpload
  url='${UPLOAD_URL}'
  maxFiles='2'
/>
        `}
      </pre>
      <XHRUpload url={UPLOAD_URL} maxFiles={2}/>
      <pre style={{fontSize: 10}}>
        {`
<XHRUpload
  url='${UPLOAD_URL}'
  auto
  maxFiles='5'
/>
        `}
      </pre>
      <XHRUpload url={UPLOAD_URL} auto maxFiles={5}/>
    </div>
    );
  }
}
