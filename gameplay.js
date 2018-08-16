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

var ball = {
  diameter : 20,
  posX : paddle.posX,
  posY : paddle.posY-11,
  direction : 135,
  speed : 15
}



window.addEventListener("load", startGame);
window.onload = function() {
  document.body.insertBefore(canvas, document.body.childNodes[0]);
  canvas.onmousemove=function(evt){
    var mousePos = getMousePos(evt);
    movePaddle(mousePos.x);
  };
};

canvas.onmousedown = function(e){
    updateGameplay();
}

function startGame() {
  writeMessage("Score: "+score);
  drawPaddle();
  drawBall();
  drawSceneBricks();
}

function initialiseCanvas(){
  canvas.width = 480;
  canvas.height = 600;
}

function initialiseCanvasContext(){
  context.fillStyle="#FFFFFF";
}


function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function writeMessage(message) {
        context.clearRect(0, 0, 10, 25);
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        context.fillText(message, 10, 25);
}

function drawBall(){
  context.fillStyle = "rgb(51,51,0)";
  context.beginPath();
  context.arc(ball.posX,ball.posY,ball.diameter/2,0,2*Math.PI);
  context.fill();
}

function drawPaddle(){
  context.fillStyle = "rgb(0,51,0)";
  context.fillRect(paddle.posX-paddle.width/2, paddle.posY, paddle.width, paddle.height);
}

function movePaddle(x){
  context.clearRect(paddle.posX-paddle.width/2, paddle.posY, paddle.width, paddle.height);
  paddle.posX = x;
  drawPaddle();
}


function clearBall(){
    context.clearRect(ball.posX-ball.diameter/2-1, ball.posY-ball.diameter/2-1, ball.diameter+2, ball.diameter+2);
    /*context.fillStyle = "#FFFFFF";
    context.beginPath();
    context.arc(ball.posX,ball.posY,ball.diameter/2,0,2*Math.PI);
    context.fill();*/
}


function drawSceneBricks(){
  var arr=level1;
  var startingPositionX = 20;
  var startingPositionY = 40;
  for (var i=0, len=arr.length; i<len; i++) {
    for (var j=0, len2=arr[i].length; j<len2; j++) {
        if(arr[i][j]!==0){
          context.fillStyle = colorsBrick[arr[i][j]];
          context.fillRect(startingPositionX+j*brick.width,startingPositionY+i*brick.height , brick.width, brick.height);
          context.rect(startingPositionX+j*brick.width,startingPositionY+i*brick.height , brick.width, brick.height);
          context.stroke();
        }
      }
    }
}

function updateGameplay(){
  var fps=10;
  var refresh=1000/fps;
  setInterval(function(){ clearBall();moveBall();drawBall(); }, refresh);
}


function moveBall(){
  var x = ball.posX, y = ball.posY;
  var speed = ball.speed;
  var direction = ball.direction;
  console.log(direction);
  switch(direction){
    case 0:x+=speed; break;
    case 45:x+=speed;y-=speed; break;
    case 90:y-=speed; break;
    case 135:x-=speed;y-=speed; break;
    case 180:x-=speed; break;
    case 225:x-=speed;y+=speed; break;
    case 270:y+=speed; break;
    case 315:x+=speed;y+=speed; break;
  }

  if(x>canvas.width){
    x = canvas.width;
    if(direction === 315) direction = 225;
    else if(direction === 45) direction = 135;
  }

  if(x<0){
    x = 0;
    if(direction === 225) direction = 315;
    else if(direction === 135) direction = 45;
  }

  if(y>canvas.height){
    y = canvas.height;
    if(direction === 315) direction = 45;
    else if(direction === 225) direction = 135;
  }

  if(y<0){
    if(direction === 135) direction = 225;
    else if(direction === 45) direction = 315;
    y=0;
  }

  ball.posX = x;
  ball.posY = y;
  ball.direction = direction;
}
