const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/uploads`)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);

    cb(null, file.fieldname + Date.now() + ext);
  }
})
 
const upload = multer({ storage: storage })

module.exports = upload;