/* https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment */

const path = require('path'),
      express = require('express'),
      app = express(),
      server = require('http').Server(app);
      socketio = require("socket.io"),
      fs = require('fs');

var dataFromFile;
var indexToSave;
app.use(express.static(path.join(__dirname, 'build')));

app.get('/:loopIndex', function (req, res) {
    console.log(req.params.loopIndex);
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
    var parsedquery = parseInt(req.params.loopIndex);
    if(isNaN(parsedquery)){
      dataFromFile=false;
      console.log("FILE INDEX IS NOT A NUMBER!");
    }
    else{
      var content;
      var filepath = '/home/losler/saved_loops/'+parsedquery+'.json';
      console.log("Reading data from path:" + filepath);
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
    if(!dataFromFile){
      socket.emit("load_file", false);
    }
    else{
      console.log("DATA FROM FILE: " + dataFromFile);
      console.log("data parsed:" + JSON.parse(dataFromFile));
      socket.emit("load_file", JSON.parse(dataFromFile));
    }


    socket.on('save_loop', function(data) {
  		// This callback runs when the server receives a new message from the client.
      var fileContent = data;

      var dir = '/home/losler/saved_loops/';
      fs.readdir(dir, (err, files) => {
        console.log(files);
        console.log(files.length);
        console.log(typeof files.length);
        if(err) throw err;
        indexToSave=parseInt(files.length,10);
        var filepath = dir+indexToSave+'.json';
        console.log("attempting to save to: " + filepath);
        fs.writeFile(filepath,fileContent,(err) => {
          if(err){
            socket.emit("save_msg",false);
          };
          console.log("the file was successfully saved!!");
          socket.emit("save_msg",indexToSave);
        });
      });

  	});
});
