// require express
var express = require('express');
var app = express();
console.log("Express Running");

// require http (so we will have a server) 
var http = require('http');
var server = http.createServer(app);
console.log("Server Created");
//server.listen(3000, function() {
server.listen(80, function() {
    console.log('Streaming on port %d', server.address().port);
});

// require socket IO
var socketio = require('socket.io');
//socketio.configure(function() {
//	socket.set('transports', ['websocket']);
//});
var io = socketio.listen(server);

// require twitter
var twitter = require('ntwitter'); 
var twit = new twitter({ consumer_key: 'yo84dsy2XXIJgbMjZ6eSUbi2O', 
						consumer_secret: '55hYEdiDJLi4KnrWEN77u7aQVxoiN7qSlzOosFCE3ZeFLVlHf2', 
						access_token_key: '14302035-ddlm1rCQZhkYqzSwiSxoAYm5GDbd7F2AqvtfMM6fA', 
						access_token_secret: '8GqYNTO1AhgGWCHQ3zklGjOVDTeqRDjLSBEI0WGK9te9Y' 
});

// This requests data from the 'statuses/filter' endpoint that allows developers to track tweets by keyword, location, or specific users
twit.stream('statuses/filter', 
	{ track: ['#craftbeer', '#beer'] }, 
	function(stream) { 
		stream.on('data', 
		function (data) { 
			console.log(data.user.screen_name + ': ' + data.text); 
			io.sockets.emit('tweet', {
 				user: data.user.screen_name,
 				image: data.user.profile_image_url,
 				location: data.user.location,
 				text: data.text
 			});
		}); 
	});
