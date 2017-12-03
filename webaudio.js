//create the context for the web audio
var matrixtofreqmap = new Map();
var oscillatorarray=[];
var gainarray=[];
var keyState = "major";
var keyMultipliers = {"major" : [1,
                                 Math.pow(2, 2/12),
                                 Math.pow(2, 4/12),
                                 Math.pow(2, 5/12),
                                 Math.pow(2, 7/12),
                                 Math.pow(2, 9/12),
                                 Math.pow(2, 11/12),
                                 2],
                      "nminor": [1,
                                 Math.pow(2, 2/12),
                                 Math.pow(2, 3/12),
                                 Math.pow(2, 5/12),
                                 Math.pow(2, 7/12),
                                 Math.pow(2, 8/12),
                                 Math.pow(2, 10/12),
                                 2],
                      "hminor": [1,
                                 Math.pow(2, 2/12),
                                 Math.pow(2, 3/12),
                                 Math.pow(2, 5/12),
                                 Math.pow(2, 7/12),
                                 Math.pow(2, 8/12),
                                 Math.pow(2, 11/12),
                                 2],
                      "mminor": [1,
                                 Math.pow(2, 2/12),
                                 Math.pow(2, 3/12),
                                 Math.pow(2, 5/12),
                                 Math.pow(2, 7/12),
                                 Math.pow(2, 9/12),
                                 Math.pow(2, 11/12),
                                 2]};
var aFreq = 440.0;
var noteDict = {"C" : aFreq * Math.pow(2, -9/12),
                "Db": aFreq * Math.pow(2, -8/12),
                "D" : aFreq * Math.pow(2, -7/12),
                "Eb": aFreq * Math.pow(2, -6/12),
                "E" : aFreq * Math.pow(2, -5/12),
                "F" : aFreq * Math.pow(2, -4/12),
                "Gb": aFreq * Math.pow(2, -3/12),
                "G" : aFreq * Math.pow(2, -2/12),
                "Ab": aFreq * Math.pow(2, -1/12),
                "A" : aFreq,
                "Bb": aFreq * Math.pow(2, 1/12),
                "B" : aFreq * Math.pow(2, 2/12)};



/*matrixtofreqmap.set(0,523.25);
matrixtofreqmap.set(1,493.88);
matrixtofreqmap.set(2,440.00);
matrixtofreqmap.set(3,392.00);
matrixtofreqmap.set(4,349.23);
matrixtofreqmap.set(5,329.63);
matrixtofreqmap.set(6,293.66);
matrixtofreqmap.set(7,261.63);*/

var notearray=[];
for(var i=0;i<8;i++){
  notearray[i]=[];
  for(var j=0;j<8;j++){
    notearray[i][j]=false;
  }
}

notearray[0][0]=true;
notearray[1][1]=true;
notearray[2][2]=true;
notearray[3][3]=true;
notearray[4][4]=true;
notearray[5][5]=true;
notearray[6][6]=true;
notearray[7][7]=true;

var tempo=120;
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var volume = audioCtx.createGain();
volume.connect(audioCtx.destination);
volume.gain.value=0.1;
//above line creates volume and starts it out at zero to correspond to where the volume bar starts

function initKey(key){
  //keyState=state;
  let keyFreq = noteDict[key];
  for(let i=0; i < 8; i++) {
    matrixtofreqmap.set(i,keyFreq * keyMultipliers[keyState][i]);
  }
}

function keyhelper(){
  changeKey("C");
}

function changeKey(key){
  //keyState=state;
  console.log(key);
  let keyFreq = noteDict[key];
  for(let i=0; i < 8; i++) {
    matrixtofreqmap.delete(i);
    matrixtofreqmap.set(i,keyFreq * keyMultipliers[keyState][i]);
    //console.log(matrixtofreqmap[i]);
    oscillatorarray[i].frequency.value=matrixtofreqmap.get(i);
  }
}
function webpageloaded(){
  initKey("G");
  var starttime = audioCtx.currentTime + 0.500;
  setUpOscillators(starttime);
  playpiece(starttime);
  loadSong();
}
window.onload=webpageloaded;

function playpiece(starttime){
  var nextbeat = starttime;
  var beatcount = 0;
  var myticker = tick;
  var myInterval = setInterval(myticker,0);

  function tick(){
    if(nextbeat<=audioCtx.currentTime){
      var quarterNote = 60/tempo;
      nextbeat=Math.round((audioCtx.currentTime+quarterNote)*100) / 100;
      //nextbeat+=quarterNote;
      console.log(nextbeat);
      playColumn(beatcount%8,nextbeat);
      //alert("playing column:" + beatcount%8);
      beatcount++;
    }
  }
}


function playColumn(i,nextbeattime){
  for(var j=0;j<8;j++){
    if(notearray[i][j]===true){
      //  alert("playing note!");
      gainarray[j].gain.value=1;
      //gainarray[j].gain.setValueAtTime(0,nextbeattime);
      gainarray[j].gain.exponentialRampToValueAtTime(0.0001, nextbeattime + .3);
    }
  }

}

function changenote(x,y){
  //webpageloaded();
  notearray[x][y]= !notearray[x][y];
}

function loadSong(){
  if(parseURLParams(window.location.href)!=false){
    console.log(parseURLParams(window.location.href));
    songGetAsync();

  }
}

function songGetAsync(){
  //needs to submit a get request to the php on the html page that will get respond with the json data
}
function parseURLParams(url){
  var queryStart = url.indexOf("index=") + 6;
  var queryEnd = url.length + 1;
  var query=url.slice(queryStart, queryEnd - 1);
  var parsedquery = parseInt(query);
  if(isNaN(parsedquery)){
    return false;
  }
  else{
    return parsedquery;
  }
}

function savefile(){
  var index=3;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "hello.txt", true);
  xmlHttp.addEventListener("load", ajaxCallback, false);
  xmlHttp.send(null);
  function ajaxCallback(event){
    console.log( "Your file contains the text: " + event.target.responseText);
  }
  index= event.target.responseText;
  var myURL = 'http://ec2-18-221-49-149.us-east-2.compute.amazonaws.com/~losler/cp/webaudiopractice.html?index=' + index;
  document.getElementById('url').value = myURL;
}

//NEED TO IMPLEMENT THE RESPONSE TO THIS GET REQUEST IN PHP!!!!!!!!
//string mytxt = json.encode({tempo: tempo, key: key, name: name, notes: note});

function togglePlayPause(){
  if(audioCtx.state === 'running') {
    audioCtx.suspend().then(function() {
      console.log("suspended");
    });
  } else if(audioCtx.state === 'suspended') {
    audioCtx.resume().then(function() {
      console.log("running");
    });
  }
}
//calls helper function initOscillatorandGain to set up all the oscillators to start playing at the startTime
function setUpOscillators(startTime){
  for (var i = 0; i < 8; ++i) {
    initOscillatorandGain(matrixtofreqmap.get(i), startTime);
  }
}
//sets all oscillators and gains for them, which are connected to the master volume
function initOscillatorandGain(freq,timetostart){
  var src = audioCtx.createOscillator();
  var srcgain = audioCtx.createGain();
  srcgain.gain.value=0;
  srcgain.connect(volume);
  src.frequency.value=freq;
  src.connect(srcgain);
  src.start();
  oscillatorarray.push(src);
  gainarray.push(srcgain);
}



function changeVolume(volumelevel){
  var tempvolume=volumelevel.value;
  var fraction = parseInt(volumelevel.value) / parseInt(volumelevel.max);
  volume.gain.value=fraction*fraction;
}

//changing tempo doesn't work bc it calculates all the times at the beginning of the script, needs to be dynamic
function changeTempo(tempolevel){
  var temptempo=tempolevel.value;
  var fraction = parseInt(tempolevel.value) / parseInt(tempolevel.max);
  tempo=fraction*240;
}
