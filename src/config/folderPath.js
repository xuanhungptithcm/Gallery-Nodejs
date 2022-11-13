const path = require('path');

const folderPath = {
  images: path.join(__dirname, '..', 'images'),
  imagesRaw: path.join(__dirname, '..', 'images', 'raw'),
  imagesJpeg: path.join(__dirname, '..', 'images', 'jpeg'),
  imagesResize: path.join(__dirname, '..', 'images', 'resize'),
  imagesOriginResize: path.join(__dirname, '..', 'images', 'origin'),
};
module.exports = folderPath;
