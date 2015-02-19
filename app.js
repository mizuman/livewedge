
/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')
	, util = require('util')
	, twitter = require('ntwitter')
	, fs = require('fs');

var twit = new twitter({
	consumer_key: 'd3Fi2FY4Jeg5QXUvGggGOiUbP',
	consumer_secret: '0ArRq9cq1iRO6bBVAFOKvnfpI4U7LRY1z4tFEANPw8PrDIV4Iv',
	access_token_key: '45787653-D8ph5vBd33lOlDCprdd6SZKW8EDsdp5MlE5H4Euvy',
	access_token_secret: 'aiKm60FqiPXqjESHv2tKCZjpTvH0L0WsEvWz49ir3R31z'
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', function(req, res) {
	res.render('index', { locals: { port: app.get('port') } });
});
app.get('/stream', function(req, res) {
	res.render('stream', { locals: { port: app.get('port') } });
});
app.get('/bubble', function(req, res) {
	res.render('bubble', { locals: { port: app.get('port') } });
});
app.get('/users', user.list);


var server = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port" + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
	console.log('connect');

	socket.on('message', function(msg) {
		socket.emit('message', msg);
		socket.broadcast.emit('message', msg);
	});

	socket.on('twitter', function(data) {
			io.sockets.emit('msg', data);
	});

	socket.on('disconnect', function() {
		console.log('disconnect');
	});
});

var keyword = process.argv[2];
var option = {'track': keyword};
console.log(keyword+'を含むツイートを取得します。');

twit.stream('statuses/filter', option, function(stream) {
	stream.on('data', function (data) {
		io.sockets.emit('twitter', {text: data.text, img: data.user.profile_image_url, name: data.user.screen_name});
		console.log(data);
	});
});

console.log('Server running at http://localhost:' + app.get('port') + '/');