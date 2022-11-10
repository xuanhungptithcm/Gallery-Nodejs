const sharp = require('sharp');
const path = require('path');
const fse = require('fs-extra');
const convert = require('heic-convert');
const { promisify } = require('util');
const fs = require('fs');

const imagePath = path.join(__dirname + '/../images/IMG_4941.HEIC');

async function getMetadata() {
  try {

    const inputBuffer = await promisify(fs.readFile)(imagePath);
    const outputBuffer = await convert({
      buffer: inputBuffer, // the HEIC file buffer
      format: 'JPEG',      // output format
      quality: 1           // the jpeg compression quality, between 0 and 1
    });
    await promisify(fs.writeFile)(path.join(__dirname, 'output.jpg'), outputBuffer);


    const metadata = await sharp(path.join(__dirname, 'output.jpg')).metadata();

    console.log(metadata);

    sharp(path.join(__dirname, 'output.jpg'))
      .resize({ 
        fit: sharp.fit.inside,
        width: metadata.width * 1/3,
        height: metadata.height * 1/3,
       })
      .toFile(path.join(__dirname, 'output2.jpg'))
      .then((data) => {
        // 100 pixels high, auto-scaled width
      });
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
}

getMetadata();
