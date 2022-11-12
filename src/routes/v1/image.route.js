const express = require('express');
const imageController = require('../../controllers/image.controller');

const router = express.Router();

router.route('/').get(imageController.getImages);

module.exports = router;
