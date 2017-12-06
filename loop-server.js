/* https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment */
//First, we make sure that we have all required packages
const path = require('path'),
      express = require('express'),
      app = express(),
      server = require('http').Server(app);
      socketio = require("socket.io"),
      fs = require('fs');

var dataFromFile;
var indexToSave;

app.use(express.static(path.join(__dirname, 'build')));

//extracts the requested loop's index from the URL, ensures that it's a number, and reads and stores the data from the corresponding .json file
app.get('/:loopIndex', function (req, res) {
    console.log("request for " + req.params.loopIndex);
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
    var parsedquery = parseInt(req.params.loopIndex);
    if(isNaN(parsedquery)){
      dataFromFile=false;
    }
    else{
      var filepath = '/home/losler/saved_loops/'+parsedquery+'.json';
      fs.readFile(filepath, function (err, data) {
        if (err) data = false;
        dataFromFile=data;
        if(data==false) console.log("File: " + parsedquery + " does not exist!");
        else console.log("Sending file of index: " + parsedquery);
      });
    }
});

server.listen(3456);

var io = socketio.listen(server);
io.sockets.on("connection", function(socket){
	// Checks whether the client tried to access a file, and sends a socket.emit message with the file data to the client side of javascript
    if(!dataFromFile){
      socket.emit("load_file", false);
    }
    else{
      socket.emit("load_file", JSON.parse(dataFromFile));
      dataFromFile = false;
    }
    //Recieves the 'save_loop' event message from the client, and saves the unparsed json data to a new .json file
    socket.on('save_loop', function(data) {
      var fileContent = data;
      var dir = '/home/losler/saved_loops/';
      fs.readdir(dir, (err, files) => {
        if(err) throw err;
        indexToSave=parseInt(files.length,10);
        var filepath = dir+indexToSave+'.json';
        //attempts to write, returning false if unsuccessful or with the index of the file if successful
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
