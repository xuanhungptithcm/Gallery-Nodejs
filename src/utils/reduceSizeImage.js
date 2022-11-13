/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const path = require('path');
const folderPath = require('../config/folderPath');
const { reduceSizeImage, reduceKeepImage } = require('./imageHelper');

async function handleResizeImage() {
  const listFile = fs.readdirSync(folderPath.imagesJpeg);
  for (const file of listFile) {
    const fileName = file.split('.').slice(0, -1).join('');
    await reduceSizeImage(path.join(folderPath.imagesJpeg, file), `${fileName}.jpeg`, 'jpeg');
    await reduceKeepImage(path.join(folderPath.imagesJpeg, file), `${fileName}.webp`, 'webp');
  }
}
module.exports = {
  handleResizeImage,
};
