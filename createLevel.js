
var nrBricksInRow = 7;
var nrBrickColums = 6;
var divCanvas = document.getElementById("divCanvas");

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

createGrid();
createMockBricks()



function createGrid(){
  // <div id="div1" class="divCell divFirstRow divFirstInRow" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
  for(let i=1;i<=nrBrickColums;i++){
    let divOuter = document.createElement("DIV");
    divCanvas.appendChild(divOuter);
    for(let j=1;j<=nrBricksInRow;j++){
      let div = document.createElement("DIV");
      div.setAttribute("ondrop","drop(event)");
      div.setAttribute("ondragover","allowDrop(event)");
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
      divOuter.appendChild(div);
    }
  }
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
    divOuter.appendChild(div);
  }
}
