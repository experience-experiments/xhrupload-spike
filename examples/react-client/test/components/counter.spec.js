/* eslint-env node, mocha */

import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';

import Counter from '../../client/components/counter/Counter.js';
import expect from 'expect';

describe('Counter component', () => {
  describe('rendered into document', () => {
    var instance;

    beforeEach(() => {
      instance = TestUtils.renderIntoDocument(<Counter step={1} />);
    });

    it('should render a heading 2 with the given text', () => {
      var heading = TestUtils.findRenderedDOMComponentWithTag(instance, 'h2');
      expect(heading.textContent.indexOf('counter')).toBeTruthy();
    });
  });
});
