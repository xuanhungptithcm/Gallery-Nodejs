/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable security/detect-non-literal-fs-filename */
const { encode } = require('blurhash');

const sharp = require('sharp');
const path = require('path');
const convert = require('heic-convert');
const { promisify } = require('util');
const fs = require('fs');
const fse = require('fs-extra');

const folderPath = require('../config/folderPath');
const { S3 } = require('../libs/AWS');

async function getMetadata(imagePath) {
  try {
    return await sharp(imagePath).metadata();
  } catch (error) {
    return null;
  }
}

async function convertHeicToJPG(imagePath, outputPath, originName = Date.now()) {
  try {
    const inputBuffer = await promisify(fs.readFile)(imagePath);
    const fullPath = path.join(outputPath, `${originName}.jpeg`);
    const outputBuffer = await convert({
      buffer: inputBuffer, // the HEIC file buffer
      format: 'JPEG', // output format
      quality: 1, // the jpeg compression quality, between 0 and 1
    });
    await promisify(fs.writeFile)(fullPath, outputBuffer);
    return fullPath;
  } catch (error) {
    return false;
  }
}

async function reduceSizeImage(imagePath, originName, type = 'jpeg') {
  await sharp(imagePath)
    .resize({
      fit: sharp.fit.contain,
      height: 350,
    })
    .withMetadata()
    .toFormat(type)
    .toFile(path.join(folderPath.imagesResize, `${originName}`));
  return true;
}
async function reduceKeepImage(imagePath, originName, type = 'jpeg') {
  const metadata = await getMetadata(imagePath);
  await sharp(imagePath)
    .resize({
      fit: sharp.fit.contain,
      height: metadata.height,
      width: metadata.width,
    })
    .rotate()
    .toFormat(type)
    .withMetadata()
    .toFile(path.join(folderPath.imagesOriginResize, `${originName}`));
  return true;
}

async function encodeImageToBlurhash(imagePath) {
  return new Promise((resolve) => {
    sharp(imagePath)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: 'inside' })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return resolve('');
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });
}

async function handleConvertImage(imagePath, originName) {
  const metadata = await getMetadata(imagePath);
  const outPath = folderPath.imagesJpeg;
  if (!metadata) return false;

  if (metadata.format === 'heif') {
    const fileNameWithoutExt = originName.split('.').slice(0, -1).join('');
    await convertHeicToJPG(imagePath, outPath, fileNameWithoutExt);
  } else {
    await fse.move(imagePath, path.join(outPath, originName));
  }
}

async function uploadImageS3(inputSource, fileName, bucket) {
  return S3.putObject({
    Body: fs.readFileSync(inputSource),
    Key: fileName,
    Bucket: bucket,
  }).promise();
}

async function checkListImageOrigin() {
  const listPath = fs.readdirSync(folderPath.imagesRaw);

  for (const fileName of listPath) {
    const filePath = path.join(folderPath.imagesRaw, fileName);
    await handleConvertImage(filePath, fileName);
    await fse.remove(filePath);
  }
}

module.exports = {
  getMetadata,
  convertHeicToJPG,
  reduceSizeImage,
  reduceKeepImage,
  uploadImageS3,
  checkListImageOrigin,
  encodeImageToBlurhash,
};
