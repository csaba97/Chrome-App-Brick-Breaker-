var myGamePiece;
var myObstacles = [];
var score = 0;
var canvas = document.createElement("canvas");
initialiseCanvas();
var context=canvas.getContext("2d");
initialiseCanvasContext();

var paddle = {
  paddleWitdh : 60,
  paddleHeight : 20,
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

function movePaddle(x){
  paddle.posX = x;
}

function initialiseCanvas(){
  canvas.width = 480;
  canvas.height = 600;
}

function initialiseCanvasContext(){
  context.fillStyle="#FF00FF";
}

function writeMessage(canvas, message) {
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, 10, 25);
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 10, 25);
  }

function getMousePos(evt) {
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
  context.fillRect(paddle.posX-paddle.paddleWitdh/2, paddle.posY, paddle.paddleWitdh, paddle.paddleHeight);
}

function updateGameArea() {
    drawScene();
    var fps=60;
    var refresh=1000/fps;
    setInterval(function(){ clearScreen();drawScene(); }, refresh);
}


function clearScreen(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}
