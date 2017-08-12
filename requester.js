var http   = require("http");
//var server = require("../server.js");

var strPath = "http://localhost:8888/" + process.argv[2];
console.log("getting: "+strPath);

http.get("http://localhost:8888/"+process.argv[2]+"|"+process.argv[3], function (response) {
 // response.setEncoding('utf8')
 // response.on('data', console.log)
 // response.on('error', console.error)
});