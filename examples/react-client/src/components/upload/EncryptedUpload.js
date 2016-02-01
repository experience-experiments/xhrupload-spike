import React from 'react';

import XHRUpload from './XHRUpload';

const UPLOAD_URL = `http://calimshan.local:3000/api/uploadfile`;

import {encrypt} from '../encryption/encrypt.js';

export default class EncryptedUpload extends React.Component {

  render() {
    return (
    <div>
      <pre style={{fontSize: 10}}>
        {`
  <XHRUpload
  url='${UPLOAD_URL}'
  auto
  maxFiles='1'
  chunks
  encrypt
  encryptor='${encrypt}'
  encryptionKey='some key'
  chunkSize='512 * 1024'
  />
        `}
      </pre>
      <XHRUpload
        url={UPLOAD_URL}
        auto
        maxFiles={1}
        chunks
        encryptor={encrypt}
        encryptionKey='some key'
        chunkSize={512 * 1024}
      />
    </div>
    );
  }
}
