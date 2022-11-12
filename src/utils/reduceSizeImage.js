/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const path = require('path');
const folderPath = require('../config/folderPath');
const { reduceSizeImage } = require('./imageHelper');

async function handleResizeImage() {
  const listFile = fs.readdirSync(folderPath.imagesJpeg);
  for (const file of listFile) {
    await reduceSizeImage(path.join(folderPath.imagesJpeg, file), file);
  }
}
module.exports = {
  handleResizeImage,
};
