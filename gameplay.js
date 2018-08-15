var myGamePiece;
var myObstacles = [];
var myScore;
var canvas = document.createElement("canvas");
canvas.width = 480;
canvas.height = 600;
var context=canvas.getContext("2d");;
context.fillStyle="#FF00FF";
var paddleWitdh=60, paddleHeight=20;
var paddleX = canvas.width/2, paddleY=canvas.height - 40;

window.addEventListener("load", startGame);
window.onload = function() {
  document.body.insertBefore(canvas, document.body.childNodes[0]);
  canvas.onmousemove=function(evt){
  var mousePos = getMousePos(canvas, evt);
  paddleX = mousePos.x;
  };
};

function initialiseCanvas(){

}

function writeMessage(canvas, message) {
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, 10, 25);
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 10, 25);
  }

function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

function startGame() {
    updateGameArea();
}



function drawScene(){
  context.fillRect(paddleX-paddleWitdh/2, paddleY, paddleWitdh, paddleHeight);
}

function updateGameArea() {
    drawScene();
    setInterval(function(){ clearScreen();drawScene(); }, 50);
}


function clearScreen(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}
