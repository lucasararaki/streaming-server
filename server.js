const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const path = require('path');

const multer = require('multer');
const multerConfig = require('./multerConfig');
const upload = multer(multerConfig);

const fileController = require('./fileController');

app.use(cors());
app.use(morgan('dev'));

app.use('/files', express.static(path.resolve(__dirname, 'files')));
app.post('/', upload.single('file'), fileController.handleUpload);

app.listen(3000, () => {
  console.log(`
--------------------------
Server is running in :3000
--------------------------
  `)
})