import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';

import { App } from './components/App';
import Counter from './components/counter/Counter';

import './index.scss';

render(<Router>
  <Route path="/" component={App}>
    <Route path="counter" component={Counter}/>
  </Route>
</Router>, document.getElementById('app'));
