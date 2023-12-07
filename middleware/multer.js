const multer = require('multer');

const storeImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const uploadImageMiddleware = multer({ storage: storeImage });

module.exports = uploadImageMiddleware;
