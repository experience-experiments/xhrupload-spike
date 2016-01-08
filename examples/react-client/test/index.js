/* eslint-env node */
const testsContext = require.context('.', true, /.*spec\.js$/);
testsContext.keys().forEach(testsContext);
