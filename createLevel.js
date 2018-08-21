
var nrBricksInRow = 7;
var nrBrickColums = 6;
var divCanvas = document.getElementById("divCanvas");
var globalBrick;

var colorsBrick = {
  1 : "blue",
  2 : "purple",
  3 : "green",
  4 : "red",
  5 : "green",
  6 : "orange",
  7 : "violet",
  8 : "rgb(135,206,235)",
  9 : "gray",
};


var level = {
    arr : [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
    ],
    nrBricks : 0
};

createGrid();
createMockBricks()



function createGrid(){
  // <div id="div1" class="divCell divFirstRow divFirstInRow" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
  for(let i=1;i<=nrBrickColums;i++){
    let divOuter = document.createElement("DIV");
    divCanvas.appendChild(divOuter);
    for(let j=1;j<=nrBricksInRow;j++){
      let div = document.createElement("DIV");

      if(i === 1){
        if(j==1)
          div.setAttribute("class","divCell divFirstRow divFirstInRow");
        else div.setAttribute("class","divCell divFirstRow");
      }
      else{
        if(j==1)
          div.setAttribute("class","divCell divFirstInRow");
        else   div.setAttribute("class","divCell");
      }
      div.id = "gridDiv"+i+j;
      div.setAttribute("onclick","setBrickFromClick('" + div.id + "')");
      div.setAttribute("data-posX",j);
      div.setAttribute("data-posY",i);
      div.setAttribute("ondrop","drop(event)");
      div.setAttribute("ondragover","allowDrop(event)");
      divOuter.appendChild(div);
    }
  }
}


function setBrickFromClick(targetElId){
  var nodeCopy = document.getElementById(globalBrick).cloneNode(true);
  var targetEl = document.getElementById(targetElId);
  setChildBrick(targetEl,nodeCopy);
}

function createMockBricks(){
  let divOuter = document.createElement("DIV");
  divCanvas.appendChild(divOuter);
  divOuter.setAttribute("style","margin-top:300px");
  for(let i=1;i<=9;i++){
    let div = document.createElement("DIV");
    div.setAttribute("style","background-color:"+colorsBrick[i]);
    div.setAttribute("class","brickDiv");
    div.setAttribute("draggable","true");
    div.setAttribute("ondragstart","drag(event)");
    div.id = "mockBrick"+i;
    var func = "setGlobalBrick('"+div.id+"')";
    div.setAttribute("onclick",func);
    divOuter.appendChild(div);
  }
}


function setGlobalBrick(i){
  globalBrick = i;
}

function saveLevel(){
  if(!localStorage.createdlevelTotal){
    localStorage.createdlevelTotal = 1;
  }
  else localStorage.createdlevelTotal ++;

  localStorage["levelCreated"+localStorage.createdlevelTotal] = JSON.stringify(level);
  location.href = "window.html";
}


function resetLevel(){
  location.href = "levelEditor.html";
}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    globalBrick = ev.target.id;
}

function setChildBrick(targetEl, nodeCopy){
  nodeCopy.removeAttribute("draggable");
  nodeCopy.removeAttribute("ondragstart");

  var posX = Number(targetEl.getAttribute("data-posX"));
  var posY = Number(targetEl.getAttribute("data-posY"));
  var color = nodeCopy.style.backgroundColor;
  var colorNunmber = 1;
  switch(color){
    case "blue" :colorNunmber = 1; break;
    case "purple" :colorNunmber = 2; break;
    case "green" :colorNunmber = 3; break;
    case "red" :colorNunmber = 4; break;
    case "green" :colorNunmber = 5; break;
    case "orange" :colorNunmber = 6; break;
    case "violet" : colorNunmber = 7;break;
    case "rgb(135,206,235)" :colorNunmber = 8; break;
    case "gray" :colorNunmber = 9; break;
  }
  //save new brick into level array
  level.arr[posY-1][posX-1] = colorNunmber;
  targetEl.appendChild(nodeCopy);
}

function drop(ev) {
  ev.preventDefault();
  var data=ev.dataTransfer.getData("text");
  var nodeCopy = document.getElementById(data).cloneNode(true);
  var targetEl = ev.target;
  setChildBrick(targetEl,nodeCopy);
}
