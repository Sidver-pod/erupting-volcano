const express = require('express');

const router = express.Router();

const youtubeDataController = require('../controllers/youtubeDataController');

router.get('/video-data', youtubeDataController.getVideoData);
router.get('/search', youtubeDataController.getSearch);

module.exports = router;