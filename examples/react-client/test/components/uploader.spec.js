/* eslint-env node, mocha, jasmine */

import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';

import Uploader from '../../src/components/upload/Uploader.js';


describe('Uploader component', () => {
  it('should be defined', () => {
    expect(Uploader).to.be.a('function');
  });

  describe('when rendered into the document', () => {
    var instance;

    beforeEach(() => {
      instance = TestUtils.renderIntoDocument(<Uploader />);
    });

    it('should render', () => {
      expect(instance).to.be.an('object');
    });
  });
});
