
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path')

const { fork } = require('child_process');

async function handleUpload(req, res) {
  const { originalname, filename, path: filePath } = req.file;

  const currentFilePath = filePath;
  const newFilePath = path.resolve(__dirname, 'files', filename.split('.')[0]);

  handleDirectories(newFilePath)

  /* const processPromises = [
    process360(currentFilePath, newFilePath),
    process480(currentFilePath, newFilePath),
    process720(currentFilePath, newFilePath)
  ] */

  process360(currentFilePath, newFilePath)
    .then(() => {
      return process480(currentFilePath, newFilePath)
    })
    .then(() => {
      return process720(currentFilePath, newFilePath)
    })
    .then(() => {


  /* Promise.all(processPromises)
    .then(() => { */
      return res.json({
        msg: 'OK Boss',
        currentFilePath,
        originalname,
        filename
      })

    })
    .catch(() => {

      return res.status(500).json({
        msg: 'Falha ao processar vídeo'
      })
    })

}


function handleDirectories(fileDirectory) {
  fs.mkdirSync(fileDirectory)
  fs.mkdirSync(`${fileDirectory}/360`)
  fs.mkdirSync(`${fileDirectory}/480`)
  fs.mkdirSync(`${fileDirectory}/720`)

  const m3u8Content =
    `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360/360p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480
480/480p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720/720p.m3u8`;

  fs.writeFileSync(`${fileDirectory}/playlist.m3u8`, m3u8Content);
}


function process360(currentFilePath, newFilePath) {

  return new Promise((resolve, reject) => {

    const process = fork('./process360.js');
    process.send(`${currentFilePath}:${newFilePath}`);

    process.on('message', message => {
      if (message === 'finish') {
        resolve()

      } else {
        reject()
      }
    })
  })

  /* ffmpeg(currentFilePath, {
    timeout: 432000
  })
    .outputOptions([
      '-vf scale=w=640:h=360:force_original_aspect_ratio=decrease',
      '-c:a aac',
      '-ar 48000',
      '-c:v h264',
      '-profile:v main',
      '-crf 20',
      '-sc_threshold 0',
      '-g 48',
      '-keyint_min 48',
      '-hls_time 4',
      '-hls_playlist_type vod',
      '-b:v 800k',
      '-maxrate 856k',
      '-bufsize 1200k',
      '-b:a 96k',
      `-hls_segment_filename ${newFilePath}/360/360p_%03d.ts`
    ])
    .output(`${newFilePath}/360/360p.m3u8`)
    .on('progress', function (progress) {
      console.log('Processing: 360 -- ' + progress.percent + '% done')
    })
    .on('end', function () {
      console.log('360 file has been converted succesfully')
    })
    .on('error', function (err, stdout, stderr) {
      console.log('an error happened: ' + err.message)
      console.log('==================================\n', stderr)
    })
    .run(); */
}



function process480(currentFilePath, newFilePath) {

  return new Promise((resolve, reject) => {

    const process = fork('./process480.js');
    process.send(`${currentFilePath}:${newFilePath}`);

    process.on('message', message => {
      if (message === 'finish') {
        resolve()

      } else {
        reject()
      }
    })
  })

  /* ffmpeg(currentFilePath, {
    timeout: 432000
  })
    .outputOptions([
      '-vf scale=w=842:h=480:force_original_aspect_ratio=decrease',
      '-c:a aac',
      '-ar 48000',
      '-c:v h264',
      '-profile:v main',
      '-crf 20',
      '-sc_threshold 0',
      '-g 48',
      '-keyint_min 48',
      '-hls_time 4',
      '-hls_playlist_type vod',
      '-b:v 1400k',
      '-maxrate 1498k',
      '-bufsize 2100k',
      '-b:a 128k',
      `-hls_segment_filename ${newFilePath}/480/480p_%03d.ts`
    ])
    .output(`${newFilePath}/480/480p.m3u8`)
    .on('progress', function (progress) {
      console.log('Processing: 480 -- ' + progress.percent + '% done')
    })
    .on('end', function () {
      console.log('480 file has been converted succesfully')
    })
    .on('error', function (err, stdout, stderr) {
      console.log('an error happened: ' + err.message)
      console.log('==================================\n', stderr)
    })
    .run(); */
}


function process720(currentFilePath, newFilePath) {
  return new Promise((resolve, reject) => {

    const process = fork('./process720.js');
    process.send(`${currentFilePath}:${newFilePath}`);

    process.on('message', message => {
      if (message === 'finish') {
        resolve()

      } else {
        reject()
      }
    })
  })
  /* ffmpeg(currentFilePath, {
    timeout: 432000
  })
    .outputOptions([
      '-vf scale=w=1280:h=720:force_original_aspect_ratio=decrease',
      '-c:a aac',
      '-ar 48000',
      '-c:v h264',
      '-profile:v main',
      '-crf 20',
      '-sc_threshold 0',
      '-g 48',
      '-keyint_min 48',
      '-hls_time 4',
      '-hls_playlist_type vod',
      '-b:v 2800k',
      '-maxrate 2996k',
      '-bufsize 4200k',
      '-b:a 128k',
      `-hls_segment_filename ${newFilePath}/720/720p_%03d.ts`
    ])
    .output(`${newFilePath}/720/720p.m3u8`)
    .on('progress', function (progress) {
      console.log('Processing: 720 -- ' + progress.percent + '% done')
    })
    .on('end', function () {
      console.log('720 file has been converted succesfully')
    })
    .on('error', function (err, stdout, stderr) {
      console.log('an error happened: ' + err.message)
      console.log('==================================\n', stderr)
    })
    .run(); */
}

module.exports = {
  handleUpload
}