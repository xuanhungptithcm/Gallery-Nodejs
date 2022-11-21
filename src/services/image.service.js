const mongoose = require('mongoose');
const ImageModel = require('../models/image.model');
const MessageModel = require('../models/message.model');

const getImages = async (filter, options) => {
  const images = await ImageModel.paginate(filter, options);
  return images;
};
const createMessage = async (content) => {
  const message = new MessageModel({
    _id: mongoose.Types.ObjectId(),
    content,
    owner: '636dc1f5d8d8942c3749e4ae',
  });
  await MessageModel.insertMany([message]);
};

module.exports = {
  getImages,
  createMessage,
};
