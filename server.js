'use strict';

const express = require('express');
const Busboy = require('busboy');
const fs = require('fs');

const port = 3000;
const app = express();

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.get('/', (req, res) => {
  res.send('Hello Uploader');
});

app.post('/api/uploadfile', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  let saveTo = __dirname + '/uploads/.tmp-' +  + Date.now();
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
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
	busboy.on('finish', function() {
		res.end('done');
    // Delete the file after the upload is finished for storage space reasons
    if(fs.accessSync(saveTo)){
      fs.unlink(saveTo);
    }
	});
	req.pipe(busboy);
});

app.listen(port, '0.0.0.0', function () {
  console.log(`Uploader server listening on port ${port}!`);
});
