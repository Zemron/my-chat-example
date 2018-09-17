var express = require('express'),
  io = require('socket.io').listen(app),
  app = express.createServer(express.logger()),
  routes = require('./routes');
var http = require('http').Server(app);

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
var name = "";

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Heroku won't actually allow us to use WebSockets
// so we have to setup polling instead.
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  //console.log(socket);
  socket.emit('chat message', "<Guy Fieri> Type in your username to join this flavor-busting chatroom!");
  socket.on('chat message', function(msg){
  io.sockets.emit('chat message', "<O/");
  if(socket.username == undefined){
      socket.username = msg;
      socket.broadcast.emit('chat message', socket.username + ' has joined the game');
      socket.emit('chat message', "<Guy Fieri> Mmmmmm! That cheese-frying name is gangsta!");
  }
  else{
      io.emit('chat message', "<" + socket.username + "> " + msg);
  }
    //console.log(socket.username);
    //socket.username = msg;
  });
  socket.on('disconnect', function(){
    socket.broadcast.emit('chat message', socket.username + ' has left the game');
  });
});


http.listen(port, function(){
  console.log('listening on *:' + port);
});
