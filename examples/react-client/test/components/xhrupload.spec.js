import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';

import sinon from 'sinon';
import XHRUpload from '../../src/components/upload/XHRUpload.js';

describe('Uploader component', () => {
  it('should be defined', () => {
    expect(XHRUpload).to.exist;
  });

  let instance;
  beforeEach(() => {
    instance = TestUtils.renderIntoDocument(<XHRUpload url="/test"/>);
  });

  afterEach(() => {

  });

  describe('when rendered into the document', () => {
    it('should render', () => {
      expect(TestUtils.isCompositeComponent(instance)).to.be.true;
    });

    it('should error in console when URL prop is not provided', () => {
      try {
        const consoleSpy = sinon.spy(console, 'error');
        TestUtils.renderIntoDocument(<XHRUpload />);
        expect(consoleSpy.calledOnce).to.be.true;
        expect(consoleSpy.calledWithExactly('Warning: Failed propType: Required prop `url` was not specified in `XHRUpload`.'));
      } finally {
        console.error.restore();
      }
    });

    it('should have correct defaults', () => {
      expect(instance.props.auto).to.be.false;
      expect(instance.props.maxFiles).to.equal(1);
      expect(instance.props.maxSize).to.equal(25 * 1024 * 1024);
      expect(instance.props.chunks).to.be.false;
      expect(instance.props.encrypt).to.be.false;
      expect(instance.props.debug).to.be.false;
    });

    it('should have no items in state initially', () => {
      expect(instance.state.items).to.be.empty;
    });

    it('should set items to state when files are selected', () => {
      // Using spies since HTML FileList and File objects cannot be instantiated with tests.
      const setStateSpy = sinon.spy(instance, 'setState');
      TestUtils.Simulate.change(instance.refs.fileInput);
      expect(setStateSpy.calledOnce).to.be.true;
      instance.setState.restore();
    });

    it('should have active state when there is an active drag event', () => {
      TestUtils.Simulate.dragEnter(instance.refs.dropTarget);
      expect(instance.state.isActive).to.be.true;
      TestUtils.Simulate.dragOver(instance.refs.dropTarget);
      expect(instance.state.isActive).to.be.true;
      TestUtils.Simulate.dragLeave(instance.refs.dropTarget);
      expect(instance.state.isActive).to.be.false;
      TestUtils.Simulate.dragEnter(instance.refs.dropTarget);
      expect(instance.state.isActive).to.be.true;
      TestUtils.Simulate.drop(instance.refs.dropTarget);
      expect(instance.state.isActive).to.be.false;
    });

    it('should create XMLHttpRequest instances for files to be uploaded', () => {
      const fakeXHR = sinon.useFakeXMLHttpRequest();
      const requests = [];
      const progressEvents = [];
      fakeXHR.onCreate = (xhr) => {
        requests.push(xhr);
        xhr.upload.onProgress = (e) => {
          progressEvents.push(e);
        };
      };
      const file = {name: 'somefilename', type: 'application/json', size: 123123};
      const itemsToUpload = [
        {file: file, index: 0, progress: 0, cancelled: false},
        {file: file, index: 1, progress: 0, cancelled: false}
      ];

      instance.setState({items: itemsToUpload});
      instance.upload();
      expect(requests).to.have.length.of(2);
      expect(requests).to.have.length.of.at.least(2);
      fakeXHR.restore();
    });
  });
});
