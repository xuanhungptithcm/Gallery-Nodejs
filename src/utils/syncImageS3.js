/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const fse = require('fs-extra');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const folderPath = require('../config/folderPath');
const ImageModel = require('../models/image.model');
const { getMetadata, uploadImageS3, encodeImageToBlurhash } = require('./imageHelper');

dotenv.config({ path: path.join(__dirname, '../../.env') });
async function syncImageS3() {
  const listFile = fs.readdirSync(folderPath.imagesResize);
  for (const file of listFile) {
    const inPath = path.join(folderPath.imagesResize, file);
    const bucket = process.env.BUCKET;
    const s3Url = process.env.S3_URL;
    const s3UrlImage = `${s3Url}/${bucket}/${file}`;
    const originWebpName = `${file.split('.').slice(0, -1).join('')}.webp`;
    const s3OriginUrlImage = `${s3Url}/${bucket}/origin/${originWebpName}`;
    await uploadImageS3(inPath, file, bucket);
    await uploadImageS3(path.join(folderPath.imagesOriginResize, originWebpName), `origin/${originWebpName}`, bucket);
    const metadata = await getMetadata(inPath);
    const blurhash = await encodeImageToBlurhash(inPath);
    const image = new ImageModel({
      _id: mongoose.Types.ObjectId(),
      name: file,
      title: '',
      thumbnail: s3UrlImage,
      fileLocation: s3OriginUrlImage,
      width: metadata.width,
      height: metadata.height,
      owner: '636dc1f5d8d8942c3749e4ae',
      blurhash,
    });
    await ImageModel.insertMany([image]);
    fse.remove(inPath);
    await fse.remove(path.join(folderPath.imagesOriginResize, originWebpName));
    await fse.remove(path.join(folderPath.imagesJpeg, file));
  }
}

module.exports = {
  syncImageS3,
};
