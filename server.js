'use strict';

const express = require('express');
const app = express();
var busboy = require('connect-busboy');
const port = 3000;
const fs = require('fs');

app.use(busboy({ immediate: true }));

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8001");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.get('/', (req, res) => {
  res.send('Hello Uploader');
});

app.post('/api/uploadfile', (req, res) => {
	let saveTo = '';
	req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		saveTo = __dirname + '/uploads/' + fieldname + '-' + filename + Date.now();
    console.log('Will stream into ' + saveTo);
		file.pipe(fs.createWriteStream(saveTo));
		console.log('Started receiving:  [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
		file.on('data', function(data) {
      process.stdout.write('.');
		});
		file.on('end', function() {
			console.log('File [' + fieldname + '] Finished');
		});
	});
	req.busboy.on('finish', function() {
		res.end('done');
	});
	req.pipe(req.busboy);
});

app.listen(port, function () {
  console.log(`Uploader server listening on port ${port}!`);
});
