/* https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment */
//First, we make sure that we have all required packages
const path = require('path'),
      express = require('express'),
      app = express(),
      server = require('http').Server(app);
//      socketio = require("socket.io"),
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
