
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

var io = require('socket.io').listen(server)
io.sockets.on('connection', function(socket){
    socket.emit('message', {message : 'welcome to the chat'});
    socket.on('send', function(data) {
        io.sockets.emit('message'. data);
    })
    socket.on('message', function(data){
        socket.broadcast.emit('message', {name : data.name, message : data.message});
    });

    var count = 0
    socket.on('draw', function(data){

        console.log(count++);
        socket.broadcast.emit('draw', {
            width : data.width,
            color : data.color,
            x1 : data.x1,
            y1 : data.y1,
            x2 : data.x2,
            y2 : data.y2
        });
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
            sendQ : data.sendQ
        });
    });
});