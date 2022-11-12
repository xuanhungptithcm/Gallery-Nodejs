const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });
const AWS = require('aws-sdk');

const { REGION } = process.env;
const { BUCKET } = process.env;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const SECRET_KEY = process.env.AWS_SECRET_KEY;

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION,
  budgets: BUCKET,
});

const S3 = new AWS.S3();

module.exports = {
  AWS,
  S3,
};
