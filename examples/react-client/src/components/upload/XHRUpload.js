import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

const defaultStyles = {
  root: {
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
    paddingTop: 10,
    display: 'flex',
    alignItems: 'flex-start'
  },
  fileName: {
    flexGrow: '8'
  },
  fileSize: {
    'float': 'right',
    flexGrow: '2',
    alignSelf: 'flex-end'
  },
  removeButton: {
    alignSelf: 'flex-end',
  },
  progress: {
    marginTop: 10,
    width: '100%',
    height: 16,
    WebkitAppearance: 'none'
  }
};

export default class XHRUpload extends React.Component {

  static get propTypes() {
    return {
      url: React.PropTypes.string.isRequired,
      auto: React.PropTypes.bool,
      fieldName: React.PropTypes.string,
      buttonLabel: React.PropTypes.string,
      dropzoneLabel: React.PropTypes.string,
      maxSize: React.PropTypes.number,
      chunks: React.PropTypes.bool,
      chunkSize: React.PropTypes.number,
      localStore: React.PropTypes.bool,
      maxFiles: React.PropTypes.number,
      encrypt: React.PropTypes.bool,
      clearTimeOut: React.PropTypes.number,
      filesetTransitionName: React.PropTypes.string,
      styles: React.PropTypes.object,
      debug: React.PropTypes.bool,
    };
  }

  static get defaultProps() {
    return {
      auto: false,
      fieldName: 'datafile',
      buttonLabel: 'Upload',
      dropzoneLabel: 'Drag and drop your files here or pick them from your computer',
      maxSize: 25 * 1024 * 1024,
      chunks: false,
      chunkSize: 512 * 1024,
      localStore: false,
      maxFiles: 1,
      encrypt: false,
      clearTimeOut: 3000,
      filesetTransitionName: 'fileset',
      styles: defaultStyles,
      debug: false
    };
  }

  constructor(props) {
    super(props);
    this.state = {items: []};
    this.activeDrag = 0;
    this.xhrs = [];
  }

  onClick() {
    this.refs.fileInput.click();
  }

  onUploadButtonClick() {
    this.upload();
  }

  onFileSelect() {
    const items = this.filesToItems(this.refs.fileInput.files);
    this.setState({items: items}, () => {
      if(this.props.auto) {
        this.upload();
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
    const items = this.filesToItems(droppedFiles);

    this.setState({items: items}, () => {
      if(this.props.auto) {
        this.upload();
      }
    });
  }

  updateFileProgress(index, progress) {
    const newItems = [...this.state.items];
    newItems[index] = Object.assign({}, this.state.items[index], {progress: progress});
    this.setState({items: newItems});
    if(this.props.clearTimeOut > 0) {
      const completed = newItems.filter(item => item.progress === 100).length;
      if(completed === newItems.length) {
        setTimeout(() => {
          this.setState({items: []});
        }, this.props.clearTimeOut);
      }
    }
  }

  cancelFile(index) {
    const newItems = [...this.state.items];
    newItems[index] = Object.assign({}, this.state.items[index], {cancelled: true});
    if(this.xhrs[index]) {
      this.xhrs[index].upload.removeEventListener('progress');
      this.xhrs[index].removeEventListener('load');
      this.xhrs[index].abort();
    }
    this.setState({items: newItems});
  }

  upload() {
    const items = this.state.items;
    if(items) {
      items.filter(item => !item.cancelled).forEach((item) => {
        this.uploadFile(item.file, progress => {
          this.updateFileProgress(item.index, progress);
        });
      });
    }
  }

  uploadFile(file, progressCalback) {
    if(file) {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append(this.props.fieldName, file, file.name);

      xhr.onload = () => {
        progressCalback(100);
      };

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progressCalback((e.loaded / e.total) * 100);
        }
      };

      xhr.open('POST', this.props.url, true);
      xhr.send(formData);
      this.xhrs[file.index] = xhr;
    }
  }

  filesToItems(files) {
    const fileItems = Array.prototype.slice.call(files).slice(0, this.props.maxFiles);
    const items = fileItems.map((f, i) => {
      return {file: f, index: i, progress: 0, cancelled: false};
    });
    return items;
  }

  renderDropTarget() {
    const styles = this.props.styles;
    let dropTargetStyle = styles.dropTargetStyle;
    if(this.state.isActive) {
      dropTargetStyle = Object.assign({}, dropTargetStyle, styles.dropTargetActiveStyle);
    }

    return (
      <div ref="dropTarget" style={dropTargetStyle}
        onClick={e => this.onClick(e)}
        onDragEnter={e => this.onDragEnter(e)}
        onDragOver={e => this.onDragOver(e)}
        onDragLeave={e => this.onDragLeave(e)}
        onDrop={e => this.onDrop(e)}
      >
        <div style={styles.placeHolderStyle}>
          <p>{this.props.dropzoneLabel}</p>
          <center className="icon-upload icon-large"/>
        </div>
      </div>
    );
  }

  renderFileSet() {
    const items = this.state.items;
    const transitionName = this.props.filesetTransitionName;
    if(items.length > 0) {
      const {styles} = this.props;
      const progress = this.state.progress;

      return (
        <ReactCSSTransitionGroup component="div" transitionName={transitionName} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
        <div style={styles.fileset}>
        {
          items.filter(item => !item.cancelled).map((item) => {
            const file = item.file;
            const sizeInMB = (file.size / (1024 * 1024)).toPrecision(2);
            const actionButtonClass = item.progress < 100 ? 'icon-cancel-circle icon-button icon-red' : 'icon-checkmark icon-button icon-green';
            return (
              <div key={item.index}>
                <div style={styles.fileDetails}>
                  <span className="icon-file icon-large">&nbsp;</span>
                  <span style={styles.fileName}>{`${file.name}, ${file.type}`}</span>
                  <span style={styles.fileSize}>{`${sizeInMB} Mb`}</span>
                  <span style={styles.removeButton} className={actionButtonClass} onClick={() => this.cancelFile(item.index)}></span>
                </div>
                <div>
                  <progress style={styles.progress} min="0" max="100" value={item.progress}>{item.progress}%</progress>
                </div>
              </div>
            );
          })
        }
        </div>
        </ReactCSSTransitionGroup>
      );
    }
    return <ReactCSSTransitionGroup component="div" transitionName={transitionName} transitionEnterTimeout={0} transitionLeaveTimeout={0}/>;
  }

  renderButton() {
    const {styles} = this.props;
    const displayButton = !this.props.auto;
    if(displayButton) {
      return <button style={styles.uploadButtonStyle} onClick={() => this.upload()}>{this.props.buttonLabel}</button>;
    }
    return null;
  }

  renderInput() {
    const maxFiles = this.props.maxFiles;
    return <input style={{display: 'none'}} multiple={maxFiles > 1} type="file" ref="fileInput" onChange={() => this.onFileSelect()}/>;
  }

  render() {
    const {styles} = this.props;

    return (
      <div style={styles.root}>
        {this.renderDropTarget()}
        {this.renderFileSet()}
        {this.renderButton()}
        {this.renderInput()}
      </div>
    );
  }
}
