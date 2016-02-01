# Take aways from the spike

- [XHR2](https://www.w3.org/TR/2012/WD-XMLHttpRequest-20120117/) supports file uploads and progress events.
- [XHR.abort()](https://www.w3.org/TR/2012/WD-XMLHttpRequest-20120117/#the-abort-method) doesn't seem to close the connection. It seems the agents are setting the connection keep-alive, which is preventing from the socket closing. As a result of this, the uploads cannot be cancelled once they are started. Also the nodejs server keeps receiving the file as the connection is still alive and stream is still coming.
- Closing the browser window cancels the request properly and nodejs server is able to receive the close event.
- [busboy](https://github.com/mscdex/busboy) is a reliable http multipart and blob streaming library. other libraries are either built on top of busboy or they rely on temporary storage. Busboy however only parses multipart/form-data as Content-Type. It doesn't support parsing blob requests such as Content-Type: application/octet-stream.
- Client side (in-browser) encryption is only useful when
  - Site and javascript is delivered to the browser through HTTPS (the javascript that will perform the encryption is trusted)
  - The payload should be encrypted in server-side storage or further transfers after the HTTPS transfer.
  - The encryption key shall doesn't need to be transferred to the server-side.
- Encryption of data requires all data to be loaded in memory (it is a memory intense exercise)
- There is a chromium issue for working with blobs that are greater than 512Mb in size. Here is the [link](https://code.google.com/p/chromium/issues/detail?id=375297) to the issue.
- Encryption for blobs is not just a simple function call to sjcl.encrypt. Following preparations need to be made to encrypt blobs, however these may need to be treated as base64 strings after encryption.

```
var cs = {
  v: 1,
  iter: 1000,
  ks: 256,
  ts: 128,
  mode: "ocb2",
  cipher: "aes"
};

cs.salt = sjcl.random.randomWords(2, 2);
cs.iv = sjcl.random.randomWords(4, 2);

var pwd = sjcl.misc.pbkdf2(pass, cs.salt, cs.iter);
var prp = new sjcl.cipher[cs.cipher](pwd);
//cs.adata = "hint";
//var adata = sjcl.codec.utf8String.toBits(cs.adata);

var blob = item.file.slice(start, end);
var bitsSlice = sjcl.codec.bytes.toBits(new Uint8Array(blob));
var encryptedSlice = sjcl.mode[cs.mode].encrypt(prp, bitsSlice, cs.iv, adata, cs.ts);
var encryptedBase64Slice = sjcl.codec.base64.fromBits(encryptedSlice);


```
