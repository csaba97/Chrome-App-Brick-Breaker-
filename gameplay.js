var fps = 60;
var gameStarted = false;
var score = 0;
var pause = false;
var gameOver = false;
var thisLevelWasChosen = false;
var currentLevelNumber = 0;
var currentLevelObject ;
var startingBricksPositionX = 20;
var startingBricksPositionY = 40;
var canvas = document.createElement("canvas");
initialiseCanvas();
var context=canvas.getContext("2d");
initialiseCanvasContext();


var levels =[
    {
        arr : [
            [0,2,2,2,2,2,0],
            [0,2,0,0,0,2,0],
            [0,2,0,7,0,2,0],
            [0,2,0,0,0,2,0],
            [7,2,2,2,2,2,7],
        ],
        nrBricks : 0
    },
    {
        arr : [
            [0,0,0,0,0,0,0],
            [9,9,9,9,9,9,0],
            [0,0,0,0,0,0,0],
            [0,9,9,9,9,9,9],
            [0,0,0,0,0,0,0],
            [9,9,9,9,9,9,0],
        ],
        nrBricks : 0
    }
];

var brick = {
  width : 60,
  height : 20,
};

var bricks =[];

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
    this.fired = false;
}

Object.defineProperty(ball, "boundingBox", {
    get: function() {
        return new BoundingBox(this.posX-this.diameter/2-1,this.posY-this.diameter/2-1,this.posX+this.diameter/2+2,this.posY+this.diameter/2+2);
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
    if(ball.fired === false) {
        clearBall();
        ball.posX = mousePos.x;
        drawBall();
    }
    movePaddle(mousePos.x);
  };
};

canvas.onmousedown = function(e){
    if (gameOver === true){
     location.href = window.location.href;
    }

    if(gameStarted === false){
        gameStarted= true;
        ball.fired = true;
        updateGameplay();
    }
}
window.onkeyup = function(e){
    if(e.key === "p") {
        pause = !pause;
        if(pause)
            writeMessage(canvas.width/2-60, canvas.height/2, "GAME PAUSED");
        else  writeMessage(canvas.width/2-60, canvas.height/2, "");
    }
}

function startGame() {
    //parse URL if user chose a certain level to play
    var url_string = window.location.href;
    var url = new URL(url_string);
    var urlLevel = url.searchParams.get("level");
    if(urlLevel){
        thisLevelWasChosen = true;
        currentLevelNumber = Number(urlLevel);
    }
    else {
        if(!localStorage.lastLevel){
            localStorage.lastLevel = 0;
        }
        currentLevelNumber = Number (localStorage.lastLevel);
    }
    chooseLevel();
    updateBricksFromArray();
    writeMessage(20,20,"Score: "+score);
    writeMessage(canvas.width-100,20,"Level: "+currentLevelNumber);
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


function chooseLevel(){
    currentLevelObject = levels[currentLevelNumber];
    //count number of bricks
    var arr = currentLevelObject.arr;
    var nrBricks = currentLevelObject.nrBricks;

    for (var i=0, len=arr.length; i<len; i++)
        for (var j=0, len2=arr[i].length; j<len2; j++)
            if(arr[i][j]>0)
                nrBricks ++;

    currentLevelObject.nrBricks = nrBricks;
}

function updateBricksFromArray() {
    var arr = currentLevelObject.arr;

    for (var i = 0, len = arr.length; i < len; i++) {
        for (var j = 0, len2 = arr[i].length; j < len2; j++) {
            if(arr[i][j]>0){
                let newBrick = {
                    posX : (startingBricksPositionX + brick.width*j),
                    posY : (startingBricksPositionY + brick.height*i),
                    posArrayX : j,
                    posArrayY : i,
                    type : arr[i][j]
                }
                Object.defineProperty(newBrick, "boundingBox", {
                    get: function() {
                        return new BoundingBox(newBrick.posX,newBrick.posY,newBrick.posX+brick.width,newBrick.posY+brick.height);
                    }
                });
                bricks.push(newBrick);
            }
        }
    }
}


function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function writeMessage(x,y,message) {
    context.clearRect(x, y-25, 200, 25);
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, x, y,200);
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
    context.clearRect(0, startingBricksPositionY-2, canvas.width, canvas.height/2);
}

function drawSceneBricks(){
    for (var i = 0; i < bricks.length; i++)
        drawSingleBrick(bricks[i]);
}


function drawSingleBrick(currBrick){
    context.beginPath();
    context.fillStyle = colorsBrick[currBrick.type];
    context.fillRect(startingBricksPositionX + currBrick.posArrayX * brick.width,
        startingBricksPositionY + currBrick.posArrayY * brick.height, brick.width, brick.height);
    context.rect(startingBricksPositionX + currBrick.posArrayX * brick.width,
        startingBricksPositionY + currBrick.posArrayY * brick.height, brick.width, brick.height);
    context.stroke();
    context.closePath();
}

function updateGameplay(){
  ball.speed = ball.speed * (60/fps);
  var refresh=1000/fps;
  setInterval(function(){
      if(!pause) {
          writeMessage(20,20,"Score: "+score);
          writeMessage(canvas.width-100,20,"Level: "+currentLevelNumber);
          clearBall();
          moveBall();
          redrawBricksAroundBall();
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
  ball.posX = x;
  ball.posY = y;

  //check if ball is outside canvas
  calcDirOnWallCollision();

  //check if ball collides with paddle
  calcDirOnPaddleCollision();

  checkIfCollisionWithBrick();
}

function redrawBricksAroundBall(){
    //only draw back brick - no need to clear it
    if(ball.posY < canvas.height/2) {
        var maxDistance = 80;
        for (var i = 0; i < bricks.length; i++) {
            var currBrick = bricks[i];
            if (Math.abs(currBrick.posX - ball.posX) < maxDistance && Math.abs(currBrick.posY - ball.posY) < maxDistance)
                //redraw this brick
                drawSingleBrick(currBrick);
        }
    }
}

function checkIfCollisionWithBrick(){
    //check if ball collides with a brick
    //first calculate the position of the ball corresponding to the 2d array where the
    //bricks are stored
        for(var i=0 ;i<bricks.length;i++) {
            var currBrick = bricks[i];
            if (onCollide(ball.boundingBox, currBrick.boundingBox) === true) {
                if (currBrick.type !== 9) {//brick with nr 9 in unbreakable
                    destroyBrick(currBrick);
                    //collision
                    if (currentLevelObject.nrBricks === 0) {
                        pause = true;
                        writeMessage(canvas.width / 2 - 60, canvas.height / 2, "Level Cleared");
                        if (!thisLevelWasChosen) {
                            //reload the HTML file and the new level will be loaded because it is saved
                            //in the localstorage
                            localStorage.lastLevel = currentLevelNumber + 1;
                            location.href = 'level.html';
                        }
                        else {
                            location.href = 'level.html?level=' + (currentLevelNumber + 1);
                        }

                    }

                }
                //calculate new position for the ball
                calcDirOnBrickCollision(currBrick.posX);
            }
        }
}

function destroyBrick(brickToDestroy){
    var arr = currentLevelObject.arr;
    //decrement brick number
    currentLevelObject.nrBricks--;

    score += brickToDestroy.type;
    arr[brickToDestroy.posArrayY][brickToDestroy.posArrayX] = 0;
    //remove brick from 'bricks' array
    var index = bricks.indexOf(brickToDestroy);
    if (index > -1) {
        bricks.splice(index, 1);
    }
    clearSceneBricks();
    drawSceneBricks();
}

function calcDirOnWallCollision() {
    var x = ball.posX, y = ball.posY;
    var direction = ball.direction;

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
        //game over
        score = 0;
        pause = true;
        writeMessage(canvas.width/2-60, canvas.height/2, "Game Over, Click to restart level");
        gameOver = true;
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


function calcDirOnPaddleCollision(){
    var x = ball.posX, y = ball.posY;
    var direction = ball.direction;
    if(onCollide(ball.boundingBox, paddle.boundingBox) === true){
        if(direction === 225) direction = 135;
        else if(direction === 315) direction = 45;
        //move ball outside of the paddle
        y = paddle.posY - 11;
        //redraw paddle
        movePaddle(paddle.posX);
    }
    ball.posX = x;
    ball.posY = y;
    ball.direction = direction;
}

function calcDirOnBrickCollision(brickPosX, brickPosY) {
    var direction = ball.direction;
    var x = ball.x;
    if((direction === 45 || direction === 315) && x < brickPosX)
        calcDirLeftSideBrick();
    else if((direction === 135 || direction === 225) && x > brickPosX)
        calcDirRightSideBrick();
    else if(direction === 225 || direction === 315)
        calcDirUpperSideBrick();
    else if(direction === 135 || direction === 45)
        calcDirLowerSideBrick();
}


function calcDirLeftSideBrick(){
    // 45 -> 135
    // 315 -> 225
    if(ball.direction === 45) ball.direction = 135;
    else if(ball.direction === 315) ball.direction = 225;
}

function calcDirRightSideBrick(){
    // 135 -> 45
    // 225 -> 315
    if(ball.direction === 135) ball.direction = 45;
    else if(ball.direction === 225) ball.direction = 315;
}

function calcDirUpperSideBrick(){
    // 225 -> 135
    // 315 -> 45
    if(ball.direction === 225) ball.direction = 135;
    else if(ball.direction === 315) ball.direction = 45;
}

function calcDirLowerSideBrick(){
    // 135 -> 225
    // 45 -> 315
    if(ball.direction === 135) ball.direction = 225;
    else if(ball.direction === 45) ball.direction = 315;
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
    if(x>=bbox.xMin && x<=bbox.xMax && y>=bbox.yMin && y <= bbox.yMax)
        return true;
    return false;
}