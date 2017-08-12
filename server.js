var fs = require('fs');
var path = require('path');
var http = require('http');
var request = require('request');
var bl = require('bl');
var url = require('url');
var archiver = require('archiver');
var port = 8888;


var walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function (file) {
            //file = dir + '/' + file;
            file = path.join(dir,file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};




var compressFiles = function (filesPaths, response) {
   // var output = fs.createWriteStream(path.join(saveDirectory, 'compressed.zip'));
    var zipArchive = archiver('zip');

    zipArchive.pipe(response);
    //zipArchive.bulk([{ src: filesPaths, destinations }]);

    zipArchive.bulk([{ src: filesPaths }]);
    // { src: [ '**/*' ], cwd: srcDirectory, expand: true
    zipArchive.finalize(function (err, bytes) {
        if (err)
            throw err;

        console.log('done:', base, bytes);

        response.writeHead(200, {
            'Content-Type': 'application/zip',
            'Content-disposition': 'attachment; filename=compressed.zip'
        });

        response.end();
    });
}


var compressFiles2 = function (directory, response) {
    // var output = fs.createWriteStream(path.join(saveDirectory, 'compressed.zip'));
    var zipArchive = archiver('zip');

    zipArchive.pipe(response);
    //zipArchive.bulk([{ src: filesPaths, destinations }]);

    zipArchive.bulk([{ src: [ '**/*' ], cwd: directory, expand: true}]);
    // 




    zipArchive.finalize(function (err, bytes) {
        if (err)
            throw err;

        console.log('done:', base, bytes);

        response.writeHead(200, {
            'Content-Type': 'application/zip',
            'Content-disposition': 'attachment; filename=compressed.zip'
        });

        response.end();
    });
}



var compressFiles3 = function (filesPaths, response) {
    // var output = fs.createWriteStream(path.join(saveDirectory, 'compressed.zip'));
    var zipArchive = archiver('zip');

    zipArchive.pipe(response);
    //zipArchive.bulk([{ src: filesPaths, destinations }]);

    //zipArchive.bulk([{ src: ['**/*'], cwd: directory, expand: true }]);
    // 


    filesPaths.forEach(function(element) {
        zipArchive.append(fs.createReadStream(element), { name: path.basename(element) });
    });


    zipArchive.finalize(function (err, bytes) {
        if (err)
            throw err;

        console.log('done:', base, bytes);

        response.writeHead(200, {
            'Content-Type': 'application/zip',
            'Content-disposition': 'attachment; filename=compressed.zip'
        });

        response.end();
    });
}

http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true).pathname;

        var directory = parsedUrl.substr(1);


        path.exists(directory, function(exists) {
            if (!exists) {
                //            response.writeHead(404, { "Content-Type": "text/plain" });
                //          response.write("404 Not Found\n");
                //        response.end();
                console.log("Error, direcotry"+ directory+"does not exists");
                return;
            }

            if (!fs.statSync(directory).isDirectory()) {
                console.log("Error, this isnt a directory");
                return;
            }

            walk(directory, function (err, results) {

                if (err != null) {
                    console.log("Error: " + err);
                    return;
                }

                compressFiles3(results, response);
            });

            //compressFiles2(directory, response);
            //var zip = Archiver('zip');

            // Send the file to the page output.
          //  zip.pipe(response);

            // Create zip with some files. Two dynamic, one static. Put #2 in a sub folder.
          //  zip.append('Some text to go in file 1.', { name: '1.txt' })
             //   .append('Some text to go in file 2. I go in a folder!', { name: 'somefolder/2.txt' })
                 //   .file('staticFiles/3.txt', { name: '3.txt' }).finalize();

           // console.log("readdir ended");
            //response.end();

        });


}).listen(port);

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");


//server.request(process.argv[3]);