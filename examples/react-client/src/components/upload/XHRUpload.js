import React from 'react';

import './XHRUpload.scss';

export default class XHRUpload extends React.Component {

  static get propTypes() {
    return {
      url: React.PropTypes.string.isRequired,
      auto: React.PropTypes.bool,
      dragPreview: React.PropTypes.bool,
      fieldName: React.PropTypes.string,
      buttonLabel: React.PropTypes.string,
      dropzoneLabel: React.PropTypes.string,
      maxSize: React.PropTypes.number,
      chunks: React.PropTypes.bool,
      chunkSize: React.PropTypes.number,
      localStore: React.PropTypes.bool,
      maxFiles: React.PropTypes.number,
      encrypt: React.PropTypes.bool,
      debug: React.PropTypes.bool,
    };
  }

  static get defaultProps() {
    return {
      auto: false,
      dragPreview: false,
      fieldName: 'datafile',
      buttonLabel: 'Upload',
      dropzoneLabel: 'Drag and drop your files here or pick them from your computer',
      maxSize: 25 * 1024 * 1024,
      chunks: false,
      chunkSize: 512 * 1024,
      localStore: false,
      maxFiles: 1,
      encrypt: false,
      debug: true
    };
  }

  constructor(props) {
    super(props);
    this.state = {file: null, progress: 0, log: []};
    this.activeDrag = 0;
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
    if (this.props.dragPreview) {
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
    this.activeDrag += 1;
    this.setState({isActive: this.activeDrag > 0});
  }

  onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  onDragLeave(e) {
    e.preventDefault();
    this.activeDrag -= 1;
    if(this.activeDrag === 0) {
      this.setState({isActive: false});
    }
  }

  onDrop(e) {
    e.preventDefault();
    this.activeDrag = 0;
    this.setState({isActive: false});

    const droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    const file = droppedFiles[0];
    if (this.props.dragPreview) {
      file.preview = window.URL.createObjectURL(file);
    }
    this.setState({file: file}, () => {
      if(this.props.auto) {
        this.upload(file);
      }
    });
  }

  getDropTargetClass() {
    if(this.state.isActive) {
      return 'XHRUpload__drop-target--active';
    }
    return 'XHRUpload__drop-target';
  }

  upload(file) {
    this.log(`Uploding ${file.name}`);
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
    if(this.props.debug) {
      this.setState({log: [...this.state.log, message]});
    }
  }

  renderFileDetails(file) {
    if(file) {
      const progress = this.state.progress;
      const sizeInMB = (file.size / (1024 * 1024)).toPrecision(2);
      return (
        <div className="XHRUpload__file-details">
          <span className="icon-file">&nbsp;</span><span>{`${file.name}, ${file.type}, ${sizeInMB}MB`}</span>
          {
            this.state.progress > 0 ? <progress className="XHRUpload__progress" min="0" max="100" value={progress}>{progress}%</progress> : null
          }
        </div>
      );
    }
    return <div className="XHRUpload__placeholder"><p>{this.props.dropzoneLabel}</p><center className="icon-upload"/></div>;
  }

  renderButton() {
    const displayButton = !this.props.auto && this.state.progress < 100;
    if(displayButton) {
      return <button className="XHRUpload__upload-button" onClick={() => this.upload(this.state.file)}>{this.props.buttonLabel}</button>;
    }
    return null;
  }

  renderLog() {
    if(this.props.debug) {
      return <div className="logger">{this.state.log.map((item, i) => <pre key={i}>{item}</pre>)}</div>;
    }
    return null;
  }

  render() {
    const dropTargetClass = this.getDropTargetClass();
    return (
      <div className="XHRUpload">
        <div className={dropTargetClass}
          onClick={e => this.onClick(e)}
          onDragEnter={e => this.onDragEnter(e)}
          onDragOver={e => this.onDragOver(e)}
          onDragLeave={e => this.onDragLeave(e)}
          onDrop={e => this.onDrop(e)}
        >
          {this.renderFileDetails(this.state.file)}
        </div>
        {this.renderButton()}
        <input className="XHRUpload__input" type="file" ref="fileInput" onChange={() => this.onChange()}/>
        {this.renderLog()}
      </div>
    );
  }
}
