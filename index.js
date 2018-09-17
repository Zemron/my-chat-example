var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  //console.log(socket);
  socket.emit('chat message', "<Guy Fieri> Type in your username to join this flavor-busting chatroom!");
  socket.on('chat message', function(msg){
  //io.emit('chat message', "<O/");
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
/*app.listen(port, function() {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});*/
