var fps = 60;
var gameStarted = false;
var score = 0;
var pause = false;
var startingBricksPositionX = 20;
var startingBricksPositionY = 40;
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
];
var brick = {
  width : 60,
  height : 20,
};


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
};

var paddle = new function(){
  this.width = 60,
  this.height = 20,
  this.posX = canvas.width/2,//center
  this.posY = canvas.height - 40 //upper coordinate(yMin)
};

Object.defineProperty(paddle, "boundingBox", {
    get: function() {
        return new BoundingBox(this.posX-this.width/2,this.posY,this.posX+this.width/2,this.posY+this.height);
    }
});

var ball = new function(){
    this.diameter = 20,
    this.posX = paddle.posX,
    this.posY = paddle.posY-11,
    this.direction = 135,
    this.speed = 5
}

Object.defineProperty(ball, "boundingBox", {
    get: function() {
        return new BoundingBox(this.posX-this.diameter/2,this.posY-this.diameter/2,this.posX+this.diameter/2,this.posY+this.diameter/2);
    }
});

function BoundingBox(xMin,yMin, xMax, yMax){
  this.xMin=xMin;
  this.yMin=yMin;
  this.xMax=xMax;
  this.yMax=yMax;
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
    if(gameStarted === false){
        gameStarted=true;
        updateGameplay();
    }
}
window.onkeyup = function(e){
    if(e.key === "p")
        pause = !pause;
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



function clearBall(){
    context.clearRect(ball.posX-ball.diameter/2-1, ball.posY-ball.diameter/2-1, ball.diameter+2, ball.diameter+2);
}

function clearSceneBricks(){
    context.clearRect(0, 0, canvas.width, canvas.height/2);
}
function drawSceneBricks(){
  var arr=level1;
  var startingPositionX = startingBricksPositionX;
  var startingPositionY = startingBricksPositionY;
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
  ball.speed = ball.speed * (60/fps);
  var refresh=1000/fps;
  setInterval(function(){
      if(!pause) {
          clearBall();
          moveBall();
          drawBall();
      }
      }, refresh);
}


function movePaddle(x){
    if(!pause){
        context.clearRect(paddle.posX-paddle.width/2, paddle.posY, paddle.width, paddle.height);
        paddle.posX = x;
        drawPaddle();
    }
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

  //check if ball is outside canvas
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

  //check if ball collides with paddle
  if(onCollide(ball.boundingBox, paddle.boundingBox) === true){
      if(direction === 225) direction = 135;
      else if(direction === 315) direction = 45;
      //move ball outside of the paddle
      y = paddle.posY - 11;
      //redraw paddle
      movePaddle(paddle.posX);
  }
  //check if ball collides with a brick
  //first calculate the position of the ball corresponding to the 2d array where the
  //bricks are stored
  var positionArrayX = Math.floor((x - startingBricksPositionX)/brick.width);
  var positionArrayY = Math.floor((y - startingBricksPositionY)/brick.height);
  if(positionArrayX >=0 && positionArrayX < level1[1].length)
      if(positionArrayY >=0 && positionArrayY < level1.length)
          if(level1[positionArrayY][positionArrayX]>0){
              //collision
              level1[positionArrayY][positionArrayX] = 0;
              console.log("collision with "+positionArrayY+" "+positionArrayX);
              clearSceneBricks();
              drawSceneBricks();
              //calculate new position for the ball

          }


  ball.posX = x;
  ball.posY = y;
  ball.direction = direction;
}

function onCollide(bbox1, bbox2){
    if(pointInBoundingBox(bbox1.xMin,bbox1.yMin,bbox2)===true)
        return true;
    if(pointInBoundingBox(bbox1.xMin,bbox1.yMax,bbox2)===true)
        return true;
    if(pointInBoundingBox(bbox1.xMax,bbox1.yMin,bbox2)===true)
        return true;
    if(pointInBoundingBox(bbox1.xMax,bbox1.yMax,bbox2)===true)
        return true;
    return false;
}

function pointInBoundingBox(x,y,bbox){
    if(x>bbox.xMin && x<bbox.xMax && y>bbox.yMin && y < bbox.yMax)
        return true;
    return false;
}