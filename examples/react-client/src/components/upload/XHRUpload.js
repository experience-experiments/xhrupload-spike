import React from 'react';

const defaultStyles = {
  root: {
    maxWidth: 900,
    width: '100%',
    border: '1px solid #CACACA',
    padding: 20
  },
  dropTargetStyle: {
    border: '3px dashed #4A90E2',
    padding: 10,
    backgroundColor: '#ffffff',
    cursor: 'pointer'
  },
  dropTargetActiveStyle: {
    backgroundColor: '#ccffcc'
  },
  placeHolderStyle: {
    paddingLeft: '20%',
    paddingRight: '20%',
    textAlign: 'center'
  },
  uploadButtonStyle: {
    width: '100%',
    marginTop: 10,
    height: 32,
    alignSelf: 'center',
    cursor: 'pointer',
    backgroundColor: '#D9EBFF',
    border: '1px solid #5094E3',
    fontSize: 14
  },
  fileset: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderTop: '1px solid #CACACA'
  },
  fileDetails: {

  },
  progress: {
    marginTop: 10,
    width: '100%',
    height: 16,
    '-webkit-appearance': 'none'
  }
};

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
      styles: React.PropTypes.object,
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
      styles: defaultStyles,
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

  renderFileSet(file) {
    if(file) {
      const {styles} = this.props;
      const progress = this.state.progress;
      const sizeInMB = (file.size / (1024 * 1024)).toPrecision(2);
      return (
        <div style={styles.fileset}>
          <div style={styles.fileDetails}>
          <div>
            <span className="icon-file">&nbsp;</span>
            <span style={null}>{`${file.name}, ${file.type}`}</span>
            <span style={null}>{`${sizeInMB} Mb`}</span>
            <span style={null}></span>
          </div>
          <div>
            {
              this.state.progress > 0 ? <progress style={styles.progress} min="0" max="100" value={progress}>{progress}%</progress> : null
            }
          </div>
          </div>
        </div>
      );
    }
    return null;
  }

  renderButton() {
    const {styles} = this.props;
    const displayButton = !this.props.auto && this.state.progress < 100;
    if(displayButton) {
      return <button style={styles.uploadButtonStyle} onClick={() => this.upload(this.state.file)}>{this.props.buttonLabel}</button>;
    }
    return null;
  }

  renderLog() {
    if(this.props.debug) {
      return <div>{this.state.log.map((item, i) => <pre key={i}>{item}</pre>)}</div>;
    }
    return null;
  }

  render() {
    const {styles} = this.props;
    let dropTargetStyle = styles.dropTargetStyle;
    if(this.state.isActive) {
      dropTargetStyle = Object.assign({}, dropTargetStyle, styles.dropTargetActiveStyle);
    }

    return (
      <div style={styles.root}>
        <div style={dropTargetStyle}
          onClick={e => this.onClick(e)}
          onDragEnter={e => this.onDragEnter(e)}
          onDragOver={e => this.onDragOver(e)}
          onDragLeave={e => this.onDragLeave(e)}
          onDrop={e => this.onDrop(e)}
        >
          <div style={styles.placeHolderStyle}>
            <p>{this.props.dropzoneLabel}</p>
            <center className="icon-upload"/>
          </div>
        </div>
        {this.renderFileSet(this.state.file)}
        {this.renderButton()}
        <input style={{display: 'none'}} type="file" ref="fileInput" onChange={() => this.onChange()}/>
        {this.renderLog()}
      </div>
    );
  }
}
