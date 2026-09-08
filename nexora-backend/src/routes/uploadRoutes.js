const express = require('express');
const upload = require('../middleware/upload');
const { uploadImages } = require('../controllers/uploadController');

const router = express.Router();

// می‌تونی تا ۵ عکس رو همزمان با فیلد "images" بفرستی
router.post('/', upload.array('images', 5), uploadImages);

module.exports = router;
