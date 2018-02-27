var express = require('express')
// var path = require('path')
var http = express()
var port = 8888

var fs = require('fs')

http.use(express.static('src'))

http.get('/', function(req, res) {
	res.type('html')
 	res.send(fs.readFileSync(__dirname + '/index.html'))
})

http.listen(port, function() {
	var ip = require('os').networkInterfaces()['以太网'][1]['address']
	console.log('  ' + ip +':'+ port)
})