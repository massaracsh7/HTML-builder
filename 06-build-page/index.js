const fs = require('fs');
const path = require('path');
const fsPromises = require("fs/promises");
const {
  copyFile
} = require("fs/promises");

const projectDist = __dirname + path.sep + 'project-dist';
const assetsDist = __dirname + path.sep + 'project-dist' + path.sep + 'assets';
const pageDist = __dirname + path.sep + 'project-dist' + path.sep + 'index.html';
const assetsSource = __dirname + path.sep + 'assets';
const templateSource = __dirname + path.sep + 'template.html';
const componentsSource = __dirname + path.sep + 'components';
const stylesSource = __dirname + path.sep + 'styles';

function buildPage() {
  fsPromises.rm(projectDist, {
      recursive: true,
      force: true
    })
    .then(() => fsPromises.mkdir(projectDist, {
      recursive: true
    }))
    .then(() => copyDirectory(assetsSource, assetsDist))
    .then(() => mergeStyles())
    .then(() => makeTemplate(templateSource, componentsSource, pageDist))
}

function mergeStyles() {
  const arr = [];
  let writeableStream = fs.createWriteStream(path.join(projectDist + path.sep + 'style.css'), 'utf-8');

  fsPromises.readdir(stylesSource, {
      withFileTypes: true
    })
    .then((files) => {
      files.forEach((file) => {
        let ext = path.extname(file.name);
        if (file.isDirectory() || ext !== '.css') {
          return;
        }
        fs.readFile(stylesSource + path.sep + file.name, 'utf8', (err, style) => {
          arr.push(style);
          arr.forEach((item) => {
            writeableStream.write(item)
          })
        })
      })
    })
}

function copyDirectory(source, dest) {
  fsPromises.rm(dest, {
      recursive: true,
      force: true
    })
    .then(() => fsPromises.mkdir(dest, {
      recursive: true
    }))
    .then(() => fsPromises.readdir(source, {
      withFileTypes: true
    }))
    .then((filenames) => {
      for (let filename of filenames) {
        if (filename.isDirectory()) {
          copyDirectory(source + path.sep + filename.name, dest + path.sep + filename.name)
        } else {
          copyFile(source + path.sep + filename.name, dest + path.sep + filename.name)
        }
      }
    })
}

function makeTemplate(template, components, dest) {
  let writeablePage = fs.createWriteStream(path.join(dest), 'utf-8');
  let arr = [];
  fs.readFile(template, 'utf8', (err, page) => {
    let pageStr = page.toString();
    fsPromises.readdir(components, {
        withFileTypes: true
      })
      .then((filenames) => {
        for (let filename of filenames) {
          let temp = '{{' + filename.name.toString().replace(/.html/, '') + '}}';
          fs.readFile(__dirname + path.sep + 'components' + path.sep + filename.name, 'utf-8', (err, text) => {
            pageStr = pageStr.replace(temp, text.toString());
            arr.push(pageStr);
            arr.forEach((item) => fsPromises.writeFile(dest, item));
          })
        }
      })
  })
}



buildPage();
