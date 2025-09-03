const multer = require('multer');
const storage = multer.memoryStorage(); // store in memory -> we upload to ImageKit
const upload = multer({ storage });
module.exports = upload;
