/* eslint-env node */
const port = 8001;
const open = require('open');

setTimeout(() => {
  open(`http://localhost:${port}/webpack-dev-server/`);
}, 1000);
