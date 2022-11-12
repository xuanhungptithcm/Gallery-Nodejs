const ImageModel = require('../models/image.model');

const getImages = async (filter, options) => {
  const images = await ImageModel.paginate(filter, options);
  return images;
};
module.exports = {
  getImages,
};
