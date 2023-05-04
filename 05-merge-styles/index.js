const fs = require('fs');
const path = require('path');
const arr = [];
let writeableStream = fs.createWriteStream(path.join(__dirname + path.sep + 'project-dist' + path.sep + 'bundle.css'), 'utf-8');

fs.promises.readdir(__dirname + path.sep + 'styles', {
    withFileTypes: true
  })
  .then((files) => {
    files.forEach((file) => {
      let ext = path.extname(file.name)
      if (file.isDirectory() || ext !== '.css') {
        return;
      }
      fs.readFile(__dirname + path.sep + 'styles' + path.sep + file.name, 'utf8', (err, style) => {
        arr.push(style);
        arr.forEach((item) => {
          writeableStream.write(item)
        })
      });
    })
  })
