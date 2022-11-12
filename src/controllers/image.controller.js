const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { imageService } = require('../services');

const getImages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await imageService.getImages(filter, options);
  res.send(result);
});

module.exports = {
  getImages,
};
