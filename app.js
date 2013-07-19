/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/canvas',routes.canvas);

var server = http.createServer(app)
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// redis example
//var redis = require("redis");
//var client = redis.createClient();
//
//client.on("error", function(err) {
//    console.log("Error " + err)
//});
//client.set('HELLO', [1, 2, 3], redis.print);
//client.set('HELLO', "WORLD23", redis.print);
//client.get('HELLO' ,function(err, reply){
//    console.log(reply[0]);
//});
// socket.io example
var io = require('socket.io').listen(server)
var chatArr = new Array();
var pointArr = new Array();

io.sockets.on('connection', function(socket){
    socket.emit('message', {message : 'welcome to the chat'});
    socket.emit('chatSync', {chatArr : chatArr});
    socket.emit('canvasSync', {pointArr : pointArr});

    socket.on('send', function(data) {
        io.sockets.emit('message'. data);
    })
    socket.on('message', function(data){
        socket.broadcast.emit('message', {name : data.name, message : data.message});
        chatArr.push(data);
    });

    socket.on('senddata', function(data){
        socket.broadcast.emit('senddata', {
            strokeWidth : data.strokeWidth,
            strokeColor : data.strokeColor,
            fillColor : data.fillColor,
            authorName : data.authorName,
            authorId : data.authorId,
            id : data.id,
            isFill : data.isFill,
            isErase : data.isErase,
            points : data.points
        });
        pointArr.push(data);
    });
});