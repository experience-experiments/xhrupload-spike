import React from 'react';

import './XHRUpload.scss';

export default class XHRUpload extends React.Component {

  static get propTypes() {
    return {
      url: React.PropTypes.string.isRequired,
      auto: React.PropTypes.bool,
      preview: React.PropTypes.bool,
      fieldName: React.PropTypes.string,
      label: React.PropTypes.string,
      accepts: React.PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      auto: false,
      preview: false,
      fieldName: 'datafile',
      label: 'Upload'
    };
  }

  constructor(props) {
    super(props);
    this.state = {file: null, progress: 0, log: []};
  }

  onClick() {
    this.refs.fileInput.click();
  }

  onUploadButtonClick() {
    const file = this.refs.fileInput.files[0];
    this.upload(file);
  }

  onChange() {
    const file = this.refs.fileInput.files[0];
    if (this.props.preview) {
      file.preview = window.URL.createObjectURL(file);
    }
    this.setState({file: file}, () => {
      if(this.props.auto) {
        this.upload(file);
      }
    });
  }

  onDragEnter(e) {
    e.preventDefault();

    const dataTransferItems = e.dataTransfer && e.dataTransfer.items ? e.dataTransfer.items : [];
    const file = dataTransferItems[0];
    const fileAccepted = this.fileAccepted(file);
    this.setState({
      isDragActive: fileAccepted,
      isDragReject: !fileAccepted
    });
  }

  onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  onDragLeave(e) {
    e.preventDefault();
    this.setState({
      isDragActive: false,
      isDragReject: false
    });
  }

  onDrop(e) {
    e.preventDefault();

    this.setState({
      isDragActive: false,
      isDragReject: false
    });

    const droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    const file = droppedFiles[0];
    if (this.props.preview) {
      file.preview = window.URL.createObjectURL(file);
    }
    this.setState({file: file}, () => {
      if(this.props.auto) {
        this.upload(file);
      }
    });
  }

  fileAccepted(file) {
    if(this.props.accepts) {
      return file.name.toLowerCase().endsWith(this.props.accepts);
    }
    return true;
  }

  upload(file) {
    this.log(`Attempting to upload file ${file.name}`);
    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append(this.props.fieldName, file, file.name);

    xhr.onload = (e) => {
      this.log(`${xhr.status}:${xhr.response}:${e}`);
    };

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100;
        this.setState({progress: progress});
      }
    };

    xhr.open('POST', this.props.url, true);
    xhr.send(formData);
  }

  log(message) {
    this.setState({log: [...this.state.log, message]});
  }

  renderFileDetails(file) {
    if(file) {
      const progress = this.state.progress;
      const sizeInMB = (file.size / 1000000).toPrecision(2);
      return (
        <div className="XHRUpload__file-details">
          <span className="icon-file">{`${file.name}, ${file.type}, ${sizeInMB}MB`}</span>
          <progress className="XHRUpload__progress" min="0" max="100" value={progress}>{progress}%</progress>
        </div>
      );
    }
    return <p>Click to select or Drag the file here</p>;
  }

  render() {
    const displayButton = !this.props.auto || (this.state.progress < 100);
    return (
      <div className="XHRUpload">
        <div className="XHRUpload__drop-target"
          onClick={e => this.onClick(e)}
          onDragEnter={e => this.onDragEnter(e)}
          onDragOver={e => this.onDragOver(e)}
          onDragLeave={e => this.onDragLeave(e)}
          onDrop={e => this.onDrop(e)}
        >
          {this.renderFileDetails(this.state.file)}
        </div>
        <input className="XHRUpload__input" type="file" name="datasourcefile" ref="fileInput" onChange={() => this.onChange()}/>
        {displayButton ? <button className="XHRUpload__upload-button" onClick={() => this.upload(this.state.file)}>Upload</button> : null}
        <div className="logger">{this.state.log.map((item, i) => <pre key={i}>{item}</pre>)}</div>
      </div>
    );
  }
}
