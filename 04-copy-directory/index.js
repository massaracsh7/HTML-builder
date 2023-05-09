const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

fsPromises.rm(__dirname + path.sep + 'files-copy', {recursive: true, force: true})
  .then(() => {
    fsPromises.mkdir(__dirname + path.sep + 'files-copy', {
      recursive: true
    })
  }).then(() => {
    fsPromises.readdir(__dirname + path.sep + 'files')
      .then((filenames) => {
        for (let filename of filenames) {
          fsPromises.copyFile(__dirname + path.sep + 'files' + path.sep + filename, __dirname + path.sep + 'files-copy' + path.sep + filename)
        }
      })
  }).catch(() => {
    console.log('failed to create directory');
  });
