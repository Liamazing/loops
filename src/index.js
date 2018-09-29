import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// One note
class Note extends React.Component {
    constructor(props) {
        super(props);
        this.idtxt = "" + this.props.beatNum + this.props.noteNum;
    }

    render() {
        return (
            <span>
                <input type="checkbox"
                       id={this.idtxt}
                       defaultChecked={this.props.initialState}
                       onClick={()=>noteChange(this.props.beatNum, this.props.noteNum)}/>
                <label htmlFor={this.idtxt}></label>
            </span>
        );
    }
}

// One beat
class Beat extends React.Component {

    constructor(props) {
        super(props);
        /*https://stackoverflow.com/questions/22876978/loop-inside-react-jsx how to use loops to generate elements*/
		this.notes = [];
    	for(let i = 0; i < 8; i++) {
        	this.notes.unshift(
            	<Note beatNum={this.props.beatNum}
                      noteNum={i}
                      initialState={this.props.initialStates[i]}
					  clickEvent={()=>this.props.clickEvent(i)}
                      key={this.props.beatNum+""+i} />);
		}
    }

    render() {
        return(
            <div className="beat" id={this.props.beatNum}>
                {this.notes}
            </div>
        );
    }
}

// The entire grid
class NoteGrid extends React.Component {

    constructor(props) {
        super(props);
        this.beats = [];
        for(let i = 0; i < 8; i++) {
            this.beats.push(
                <Beat beatNum={i}
                      initialStates={this.props.states[i]}
                      key={i} />);
        }
    }

    render() {
        return(
            <div className="grid">
                {this.beats}
            </div>
        );
    }
}

// The tempo setting
class Tempo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {tempo: (this.props.tempo === null) ? 120 : parseInt(this.props.tempo, 10)};
    }

    change(newTempo) {
        if(newTempo <= 280 && newTempo >= 20) {
            this.setState({tempo: newTempo});
            tempoChange(newTempo);
        }
        else if(newTempo <20) {
            this.setState({tempo: 20});
            tempoChange(20);
        }
        else if(newTempo > 280) {
            this.setState({tempo: 280});
            tempoChange(280);
        }
    }

    render() {
        return(
            <div className="setting">
                <div className="title">tempo</div>
                <button className="dec" onClick={()=>this.change(parseInt(this.state.tempo, 10) - 1)}> </button>
                <div className="tempoText">{this.state.tempo}</div>
                <button className="inc" onClick={()=>this.change(parseInt(this.state.tempo, 10) + 1)}> </button>

                <input type="range"
                       min="20"
                       max="280"
                       step="1"
                       value={this.state.tempo}
                       onChange={e=>this.change(e.target.value)} />
            </div>
        );
    }

}

// The volume setting
class Volume extends React.Component {
    render() {
        return(
            <div className="setting">
                <div className="title">volume</div>
                <input type="range"
                   min="0"
                   max="100"
                   step="10"
                   defaultValue="50"
                   onChange={e=>volumeChange(e.target.value)} />
            </div>
        );
    }
}

// A generic dropdown menu
class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.options = [];
        for(let i = 0; i < this.props.options.length; i ++) {
            this.options.push(
                <button className="droption"
                        onClick={()=>this.changeState(this.props.options[i])}
                        key={this.props.options[i]}>{this.props.options[i]}</button>);
        }
        this.state = {value: this.props.initialState};
    }

    changeState(e) {
        this.setState({value: e});
        this.props.clickEvent(e);
    }

    render() {
        return(
            /* https://www.w3schools.com/css/css_dropdowns.asp */
            <div className="dropdown">
                <button className="dropbtn">{this.state.value}</button>
                <div className="dropdown-content">
                    {this.options}
                </div>
            </div>
        );
    }
}

// The Key setting
class Key extends React.Component {
    constructor(props) {
        super(props);
        this.keys = ["A", "B\u266D", "B", "C", "D\u266D", "D", "E\u266D", "E", "F", "G\u266D", "G"];
        this.keyTypes = ["Major", "Natural Minor", "Harmonic Minor", "Melodic Minor"];
    }
    render() {
        return(
            <div className="setting">
                <div className="title">key</div>
                <Dropdown initialState={this.props.keys} options={this.keys} clickEvent={a=>keyChange(a)} />
                <Dropdown initialState={this.props.keyType} options={this.keyTypes} clickEvent={a=>keyTypeChange(a)} />
            </div>
        );
    }
}

// The play/pause button
class PlayPause extends React.Component {
    render() {
        /* https://css-tricks.com/making-pure-css-playpause-button/ really cool play/pause button */
        return(
            <div className="setting">
                <div className="playpause">
                    <input type="checkbox" id="playpause" onClick={()=>togglePlayPause()}/>
                    <label htmlFor="playpause" tabindex="1"></label>
                </div>
            </div>
        );
    }
}

// The clear grid button
class ClearNotes extends React.Component {
    render() {
        return (
            <div className="setting">
                <button className="clearAll" onClick={()=>clearAll()}>clear grid</button>
            </div>
        );
    }
}
// The entire screen
class LoopScreen extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="left">
                </div>
                <div className="center">
                    <NoteGrid states={this.props.states}/>
                </div>
                <div className="right">
                    <PlayPause />
                    <Key keys={this.props.keys} keyType={this.props.keyType} />
                    <Tempo tempo={this.props.tempo}/>
                    <Volume />
                    <ClearNotes />
                    <p className="signature">a project by <strong>liam osler</strong> and <strong>matt gleeson</strong></p>
                </div>
            </div>
        );
    }

}

//====================================

// Variables to contain the global state of the loop
let notes = [[false, false, false, false, false, false, false, false],
             [false, false, false, false, false, false, false, false],
             [false, false, false, false, false, false, false, false],
             [false, false, false, false, false, false, false, false],
             [false, false, false, false, false, false, false, false],
             [false, false, false, false, false, false, false, false],
             [false, false, false, false, false, false, false, false],
             [false, false, false, false, false, false, false, false]];
let tempo = 120;
let beatInterval = 60/tempo;
let volumeNum = 50;
let key = "C";
let keyType = "Major";

//create the context for the web audio
var matrixtofreqmap = new Map();
var oscillatorarray=[];
var gainarray=[];
var keyMultipliers = {"Major" : [1,
                                 Math.pow(2, 2/12),
                                 Math.pow(2, 4/12),
                                 Math.pow(2, 5/12),
                                 Math.pow(2, 7/12),
                                 Math.pow(2, 9/12),
                                 Math.pow(2, 11/12),
                                 2],
                      "Natural Minor": [1,
                                 Math.pow(2, 2/12),
                                 Math.pow(2, 3/12),
                                 Math.pow(2, 5/12),
                                 Math.pow(2, 7/12),
                                 Math.pow(2, 8/12),
                                 Math.pow(2, 10/12),
                                 2],
                      "Harmonic Minor": [1,
                                 Math.pow(2, 2/12),
                                 Math.pow(2, 3/12),
                                 Math.pow(2, 5/12),
                                 Math.pow(2, 7/12),
                                 Math.pow(2, 8/12),
                                 Math.pow(2, 11/12),
                                 2],
                      "Melodic Minor": [1,
                                 Math.pow(2, 2/12),
                                 Math.pow(2, 3/12),
                                 Math.pow(2, 5/12),
                                 Math.pow(2, 7/12),
                                 Math.pow(2, 9/12),
                                 Math.pow(2, 11/12),
                                 2]};
var aFreq = 440.0;
var noteDict = {"C" : aFreq * Math.pow(2, -9/12),
                "D\u266D": aFreq * Math.pow(2, -8/12),
                "D" : aFreq * Math.pow(2, -7/12),
                "E\u266D": aFreq * Math.pow(2, -6/12),
                "E" : aFreq * Math.pow(2, -5/12),
                "F" : aFreq * Math.pow(2, -4/12),
                "G\u266D": aFreq * Math.pow(2, -3/12),
                "G" : aFreq * Math.pow(2, -2/12),
                "A\u266D": aFreq * Math.pow(2, -1/12),
                "A" : aFreq,
                "B\u266D": aFreq * Math.pow(2, 1/12),
                "B" : aFreq * Math.pow(2, 2/12)};
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var volume = audioCtx.createGain();
volume.connect(audioCtx.destination);
volume.gain.value=volumeNum/100;
//above line creates volume and starts it out at zero to correspond to where the volume bar starts

// Clears the entire grid
function clearAll() {
    for(let b = 0; b < 8; b++) {
        for(let n = 0; n < 8; n++) {
            notes[b][n] = false;
            document.getElementById(b + "" + n).checked = false;;
        }
    }
}

// Updates our global notes when a box is clicked
function noteChange(beatNum, noteNum) {
    notes[beatNum][noteNum] = !notes[beatNum][noteNum];
}

// Updates our global volume linked to the volume slider
function volumeChange(newVolume) {
    volumeNum = newVolume;
    volume.gain.value = Math.pow(volumeNum / 100, 2);
}

// Updates the tempo linked to the tempo setting
function tempoChange(newTempo) {
    tempo = parseInt(newTempo);
    beatInterval = 60/tempo;
}

// Changes the key linked to the key setting
function keyChange(newKey) {
    key = newKey;
    changeKey();
}

// Changes the key linked to the key setting
function keyTypeChange(newKeyType) {
    keyType = newKeyType;
    changeKey();
}

// Initializes key frequencies at the beginning of the app
function initKey(newKey){
  let keyFreq = noteDict[newKey];
  for(let i=0; i < 8; i++) {
    matrixtofreqmap.set(i,keyFreq * keyMultipliers[keyType][i]);
  }
}

// Changes the key when the user selects a new key
function changeKey(){
  console.log(key);
  let keyFreq = noteDict[key];
  for(let i=0; i < 8; i++) {
    matrixtofreqmap.delete(i);
    matrixtofreqmap.set(i,keyFreq * keyMultipliers[keyType][i]);
    oscillatorarray[i].frequency.value=matrixtofreqmap.get(i);
  }
}

// A callback to run once we receive confirmation from the server
function webpageloaded() {
  ReactDOM.render(<LoopScreen states={notes}
                              tempo={tempo}
                              keys={key}
                              keyType={keyType} />,
                   document.getElementById("root"));
  initKey(key);
  var starttime = audioCtx.currentTime + 0.500;
  setUpOscillators(starttime);
  playpiece(starttime);
}

// Our main runloop
function playpiece(starttime) {
  var nextbeat = starttime;
  var beatcount = 0;
  var myticker = tick;
  var myInterval = setInterval(myticker,0);

  function tick(){
    if(nextbeat<=audioCtx.currentTime){
      nextbeat=Math.round((audioCtx.currentTime+beatInterval)*100) / 100;
      console.log(nextbeat);
      highlight(beatcount);
      playColumn(beatcount,nextbeat);

      //alert("playing column:" + beatcount%8);
      beatcount = (beatcount+1)%8;
    }
  }
}

// Handles highlighting the column that is being played
function highlight(beatNum) {
    let prevBeat = (beatNum - 1) < 0 ? 7 : (beatNum - 1);
    // Clear previous beat
    document.getElementById(prevBeat + "").style.background = "#2c3e50";
    // Light current beat
    document.getElementById(beatNum + "").style.background = "#d15d36";
}

// Plays a specific column
function playColumn(i,nextbeattime){
  for(var j=0;j<8;j++){
    if(notes[i][j]===true){
      gainarray[j].gain.exponentialRampToValueAtTime(1, audioCtx.currentTime + .03);
      gainarray[j].gain.exponentialRampToValueAtTime(0.0001, nextbeattime + .03);
    }
  }
}

// Handles the play and pause function
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
  srcgain.gain.value=0.0001;
  srcgain.connect(volume);
  src.frequency.value=freq;
  src.connect(srcgain);
  src.start();
  oscillatorarray.push(src);
  gainarray.push(srcgain);
}

//////////////////////////////////////////////////////////

// Space activates play/pause globally
document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        document.getElementById("playpause").checked = !document.getElementById("playpause").checked;
        togglePlayPause();
    }
}

webpageloaded();
