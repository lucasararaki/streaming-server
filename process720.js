const ffmpeg = require('fluent-ffmpeg');


function process360(currentFilePath, newFilePath) {
  ffmpeg(currentFilePath, {
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

      process.send('finish');
    })
    .on('error', function (err, stdout, stderr) {
      console.log('an error happened: ' + err.message);
      console.log('==================================\n', stderr);

      process.send('error');
    })
    .run();
}

process.on('message', message => {
  console.log(`
---------------
Process360 Message: ${message}
---------------
`)

  const paths = message.split(':');

  process360(paths[0], paths[1]);

});