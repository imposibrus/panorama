
var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    srcPath = path.resolve(__dirname, '../src'),
    sortedDir = path.resolve(__dirname, '../sorted');

fs.readdir(srcPath, function(err, files) {
  if(err) {
    throw err;
  }

  files.forEach(function(name, index, all) {
    var filePath = path.resolve(srcPath, name),
        ext = name.split('.').pop();

    exec('erect2cubic --erect=' + filePath + ' --ptofile=cube'+ index +'.pto', function(err, stdout, stderr) {
      if(err || stderr) {
        throw err || stderr;
      }

      var destPath = path.resolve(__dirname, '../dest/temp' + index),
          destName = path.join(destPath, 'cube_prefix');

      if(!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath);
      }
      exec('nona -o '+ destName +' cube'+ index +'.pto', function(err2, stdout2, stderr2) {
        if(err2) {
          throw err2;
        }
        fs.readdir(destPath, function(err, destFiles) {
          if(err) {
            throw err;
          }
          destFiles.forEach(function(name, i) {
            var currFile = path.resolve(destPath, name),
                currDest = path.join(sortedDir, i.toString(), index.toString() + '.tif');

            fs.createReadStream(currFile).pipe(fs.createWriteStream(currDest));
          });
        });
      });
    });
  });
});
