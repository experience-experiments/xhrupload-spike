var apis = {
  'file': false,
  'dnd': false,
  'history': false
};

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
  apis['file'] = true
}

// Check for drag and drop API support.
if ('draggable' in document.createElement('span')){
  apis['dnd'] = true
}

// Check history api
if(!!(window.history && window.history.pushState)){
  apis['history'] = true;
}
