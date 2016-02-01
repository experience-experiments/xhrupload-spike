# Take aways from the spike

- [XHR2](https://www.w3.org/TR/2012/WD-XMLHttpRequest-20120117/) supports file uploads and progress events.
- [XHR.abort()](https://www.w3.org/TR/2012/WD-XMLHttpRequest-20120117/#the-abort-method) doesn't seem to close the connection. It seems the agents are setting the connection keep-alive, which is preventing from the socket closing. As a result of this, the uploads cannot be cancelled once they are started. Also the nodejs server keeps receiving the file as the connection is still alive and stream is still coming.
- Closing the browser window cancels the request properly and nodejs server is able to receive the close event.
- [busboy](https://github.com/mscdex/busboy) is a reliable http multipart and blob streaming library. other libraries are either built on top of busboy or they rely on temporary storage.
- Client side (in-browser) encryption is only useful when
  - Site and javascript is delivered to the browser through HTTPS (the javascript that will perform the encryption is trusted)
  - The payload should be encrypted in server-side storage or further transfers after the HTTPS transfer.
  - The encryption key shall doesn't need to be transferred to the server-side.
- Encryption of data requires all data to be loaded in memory (it is a memory intense exercise)
