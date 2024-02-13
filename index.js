// We take row and col 24 for making a grid of 24 X 24
var rows = 50;
var cols = 50;
var playing = false; // This flag keeps track of whether the game is playing or not.

var grid = new Array(rows); //Contains the current state of the cell
var nextGrid = new Array(rows); //generate /caculate  the new state

var timer;
var reproductionTime = 100;
function initializeGrids() {
  for (var i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
}

function resetGrids() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
}

function copyAndResetGrid() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}
// Initialize - will be used to initialize the game
function initialize() {
  createTable();
  initializeGrids();
  resetGrids();
  setupControlButton();
}

// Layout the board
function createTable() {
  var gridContainer = document.getElementById("gridContainer");
  if (!gridContainer) {
    // Throw error
    console.error("Problem: no div for the grid table!");
  }
  var table = document.createElement("table");
  for (var i = 0; i < rows; i++) {
    var tr = document.createElement("tr");
    for (var j = 0; j < cols; j++) {
      var cell = document.createElement("td");
      cell.setAttribute("id", i + "_" + j);
      cell.setAttribute("class", "dead");
      cell.onclick = cellClickHandler;
      tr.appendChild(cell);
    }
    table.appendChild(tr);
  }
  gridContainer.appendChild(table);
}

// Enabling the grids to be live or dead
function cellClickHandler() {
  var rowcol = this.id.split("_");
  var row = rowcol[0];
  var col = rowcol[1];
  var classes = this.getAttribute("class");
  if (classes.indexOf("live") > -1) {
    this.setAttribute("class", "dead");
    grid[row][col] = 0;
  } else {
    this.setAttribute("class", "live");
    grid[row][col] = 1;
  }
}
//Update view
function updateView() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var cell = document.getElementById(i + "_" + j);
      if (grid[i][j] == 0) {
        cell.setAttribute("class", "dead");
      } else {
        cell.setAttribute("class", "live");
      }
    }
  }
}
// Setup control button handlers
function setupControlButton() {
  // Set button to start
  var startButton = document.getElementById("start");
  startButton.onclick = startButtonHandler;

  // Set button to clear
  var clearButton = document.getElementById("clear");
  clearButton.onclick = clearButtonHandler;

  //set up the random button
  var randombutton =document.getElementById("random");
  randombutton.onclick=randomButtonHandler;
}

// Clear button handler
function clearButtonHandler() {
  console.log("Clear the game: stop playing, clear the grid");
  playing = false;
  var startButton = document.getElementById("start");
  startButton.innerHTML = "start";
  clearTimeout(timer); //this will stop the game to play
  //the below code is written to clear the grid once u click on clear button ;
  //the below cellslist contains list of live cell in the grid,
  var cellslist = document.getElementsByClassName("live");
  var cells =[];
  for (var i = 0; i < cellslist.length; i++) {
    cells.push(cellslist[i]);
    
}for(var i =0;i<cells.length;i++){
  cells[i].setAttribute("class","dead")
}
//this resetgrid is called here becoz we need to clear the previously  played games state of nextGrid & grid;& set them to 0 again ;
resetGrids();
}
// randomly generate the live cells 
function randomButtonHandler() {
  console.log("Randomize the grid");
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      // Set cell randomly to live (1) or dead (0)
      grid[i][j] = Math.round(Math.random());
    }
  }
  // Update the view to reflect the changes
  updateView();
}
// Start button handler
function startButtonHandler() {
  if (playing) {
    console.log("Pause the game");
    playing = false;
    this.innerHTML = "continue";
    clearTimeout(timer);
  } else {
    console.log("Continue the game");
    playing = true;
    this.innerHTML = "pause";
    play();
  }
}

function play() {
  console.log("Play the game");
  computeNextGen();
  if (playing) {
    timer = setTimeout(play, reproductionTime);
  }
}

//compute one generation
function computeNextGen() {
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      applyRules(i, j);
    }
  }
  //copy nextGrid to grid ,and reset nextGrid
  copyAndResetGrid();
  //copy all 1 values to "live" in the table
  updateView();
}
/* RULES
1.Any live cell with fewer than two live neighbours dies ,as if caused by under-population.
2.Any live cell with two or three live neighbours lives on to the next generation
3.Any live cell with more than three live neighbours dies,as if by overcrowding.
4.Any dead cell with exactly three live neighbours becomes a live cell,as if by reproduction. */
function applyRules(row, col) {
  var numNeighbors = countNeighbors(row, col);
  if (grid[row][col] == 1) {
    if (numNeighbors < 2) {
      nextGrid[row][col] = 0;
    } else if (numNeighbors == 2 || numNeighbors == 3) {
      nextGrid[row][col] = 1;
    } else if (numNeighbors > 3) {
      nextGrid[row][col] = 0;
    }
  } else if (grid[row][col] == 0) {
    if (numNeighbors == 3) {
      nextGrid[row][col] = 1;
    }
  }
}
//countNeighbours is used to count the live neighbours that a given cell has
function countNeighbors(row, col) {
  var count = 0; // this count flag keep track on the live neighbours each cell has
  //Testcase1:check the neighbour above the current cell;
  if (row - 1 >= 0) {
    if (grid[row - 1][col] == 1) count++;
  }
  //Testcase2:check  if the upper left neighbours  exists or not ;
  if (row - 1 >= 0 && col - 1 >= 0) {
    if (grid[row - 1][col - 1] == 1) count++;
  }
  //Testcase3:check if the upper right neighbours exists in the current cell
  if (row - 1 >= 0 && col + 1 < cols) {
    if (grid[row - 1][col + 1] == 1) count++;
  }
  //Testcase4:check the neighbours to the left
  if (col - 1 >= 0) {
    if (grid[row][col - 1] == 1) count++;
  }
  //Testcases5:check the neighbour to the right
  if (col + 1 < cols) {
    if (grid[row][col + 1] == 1) count++;
  }
  //Testcase6:check the neighbour below the current cell
  if (row + 1 < rows) {
    if (grid[row + 1][col] == 1) count++;
  }
  //Testcase7:check the neighbour lower left the current cell
  if (row + 1 < rows && col - 1 >= 0) {
    if (grid[row + 1][col - 1] == 1) count++;
  }
  // Testcase8:check the neighbour lower right the current cell
  if (row + 1 < rows && col + 1 >= 0) {
    if (grid[row + 1][col + 1] == 1) count++;
  }
  return count;
}

// Start everything
window.onload = initialize;
