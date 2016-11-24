var unzip = require('unzip');
var fs = require('fs');
var http = require('http');
var childProcess = require('child_process');
var path = require('path');

var folderName;
if (process.platform === "darwin") {
  folderName = "osx";
} else if (process.platform === "win32") {
  console.error("Windows not supported yet");
  return;
} else {
  folderName = "linux64";
  pathToFile = path.join("linux64", "rebel-linux64.zip");
}

  fs.mkdir('tmp', function() {
    var tmpFolder = path.join(__dirname, 'tmp');
    var unzipExtractor = unzip.Extract({ path: tmpFolder});
    unzipExtractor.on('error', function(err) {
      throw err;
    });
    unzipExtractor.on('close', function(){
      var target = path.resolve(__dirname, "tmp", "src", "rebel");      
      fs.chmod(target, '777', function(err, stdout, stderr){
        if (err) {
          console.log("Error changing permissions on configure file:", err);
          return;
        }
        console.log(stdout);
        var destination = path.resolve(__dirname, "..", ".bin", "rebel");
        // ../.bin/rebel -> tmp/src/rebel
        fs.symlink(target, destination, function(){ console.log("Done installing rebel."); });
      });
    });   
    var readStream = fs.createReadStream(path.join(folderName, "rebel-" + folderName + ".zip"));
    readStream.pipe(unzipExtractor);
  });
