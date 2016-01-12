import React from 'react';

import './Uploader.scss';

import XHRUpload from './XHRUpload';
const UPLOAD_URL = 'http://localhost:3000/api/uploadfile';

/**
 * Uploader class documentation
 */
export default class Uploader extends React.Component {

  render() {
    return (
    <div className="Uploader">
      <pre>
        {`
<XHRUpload
  url='${UPLOAD_URL}'
/>
        `}
      </pre>
      <XHRUpload url={UPLOAD_URL}/>
      <pre>
        {`
<XHRUpload
  url='${UPLOAD_URL}'
  auto
/>
        `}
      </pre>
      <XHRUpload url={UPLOAD_URL} auto/>
    </div>
    );
  }
}
