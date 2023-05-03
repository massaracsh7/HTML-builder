const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, path.sep, 'secret-folder'), {
    withFileTypes: true
  },
  (err, files) => {
    try {
      files.forEach((file) => {
        if (!file.isDirectory()) {
          let ext = path.extname(file.name);
          let name = path.basename(file.name, ext);
          fs.stat(__dirname + path.sep + 'secret-folder' + path.sep + file.name, (err, stats) => {
            console.log(`${name} - ${ext.slice(1)} - ${(stats.size)}b`);
          })
        }
      })
    } catch (err) {
      console.error(err);
    }
  });
