const express = require('express');
const imageController = require('../../controllers/image.controller');

const router = express.Router();

router.route('/').get(imageController.getImages);
router.route('/').post(imageController.createMessage);

module.exports = router;
