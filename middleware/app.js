const http = require('http');
const fs = require('fs');
const url = require('url');


let app = http.createServer(function(req,res){
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    console.log(queryData.id);
    if(_url == '/'){
      _url = '/index.html';
    }
    if(_url == '/favicon.ico'){
      return res.writeHead(404);
    }
    res.writeHead(200);
    res.end(queryData.id);
});