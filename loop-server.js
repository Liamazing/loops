/* https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment */

const path = require('path'),
      express = require('express'),
      app = express(),
      server = require('http').Server(app);
      socketio = require("socket.io"),
      fs = require('fs');

var dataFromFile = false;
app.use(express.static(path.join(__dirname, 'build')));

app.get('/:loopIndex', function (req, res) {
    console.log(req.params.loopIndex);
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
    var parsedquery = parseInt(req.params.loopIndex);
    if(isNaN(parsedquery)){
      console.log("FILE INDEX IS NOT A NUMBER!");
    }
    else{
      var content;
      var filepath = '~/saved_loops/'+parsedquery+'.json';
      fs.readFile(filepath, function (err, data) {
        if (err) data = false;
        console.log(data);
        dataFromFile=data;
      });


    }
});

server.listen(3456);

var io = socketio.listen(server);
io.sockets.on("connection", function(socket){
	// This callback runs when a new Socket.IO connection is established.
    socket.emit("load_file", dataFromFile);

	socket.on('message_to_server', function(data) {
		// This callback runs when the server receives a new message from the client.
		console.log("message: "+data["message"]); // log it to the Node.JS output
		io.sockets.emit("message_to_client",{message:data["message"] }) // broadcast the message to other users
	});
});
