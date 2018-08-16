var myGamePiece;
var myObstacles = [];
var score = 0;
var canvas = document.createElement("canvas");
initialiseCanvas();
var context=canvas.getContext("2d");
initialiseCanvasContext();


var level1 = [
  [1,0,4,4,0,1,1],
  [5,4,1,2,2,1,1],
  [6,0,1,0,0,1,1],
  [7,0,1,3,3,1,1],
  [8,8,9,0,2,1,1],
]
var brick = {
  width : 60,
  height : 20,
}

var colorsBrick = {
  1 : "blue",
  2 : "purple",
  3 : "green",
  4 : "red",
  5 : "green",
  6 : "orange",
  7 : "violet",
  8 : "StateBlue",
  9 : "gray",
}

var paddle = {
  width : 60,
  height : 20,
  posX : canvas.width/2,
  posY : canvas.height - 40,
}

window.addEventListener("load", startGame);
window.onload = function() {
  document.body.insertBefore(canvas, document.body.childNodes[0]);
  canvas.onmousemove=function(evt){
    var mousePos = getMousePos(evt);
    movePaddle(mousePos.x);
  };
};

function startGame() {
  writeMessage("Score: "+score);
  drawSceneBricks();
}

function initialiseCanvas(){
  canvas.width = 480;
  canvas.height = 600;
}

function initialiseCanvasContext(){
  context.fillStyle="#FFFFFF";
}

function writeMessage(message) {
        context.clearRect(0, 0, 10, 25);
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 10, 25);
}

function movePaddle(x){
  context.clearRect(paddle.posX-paddle.width/2, paddle.posY, paddle.width, paddle.height);
  paddle.posX = x;
  context.fillStyle = "rgb(0,51,0)";
  context.fillRect(paddle.posX-paddle.width/2, paddle.posY, paddle.width, paddle.height);
}

function getMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

function drawSceneBricks(){
  var arr=level1;
  var startingPositionX = 20;
  var startingPositionY = 40;
  for (var i=0, len=arr.length; i<len; i++) {
    for (var j=0, len2=arr[i].length; j<len2; j++) {
        if(arr[i][j]!=0){
          context.fillStyle = colorsBrick[arr[i][j]];
          context.fillRect(startingPositionX+j*brick.width,startingPositionY+i*brick.height , brick.width, brick.height);
          context.rect(startingPositionX+j*brick.width,startingPositionY+i*brick.height , brick.width, brick.height);
          context.stroke();
        }
      }
    }
}
