let grid; //array of the play field

//canvas sizes
const xSize = 800;
const ySize = 600;

//rgb values for the random color options
let r = 255;
let g = 255;
let b = 255;

var sandColor = "#FFA500";

var saveState;
const localSaveBool = JSON.parse(localStorage.getItem("saveBool"));

if (localSaveBool != null) {
  saveState = localSaveBool;
} else {
  saveState = true;
}

var randomSandColor;
const localRandomBool = JSON.parse(localStorage.getItem("randomBool"));

if (localRandomBool != null) {
  randomSandColor = localRandomBool;
} else {
  randomSandColor = false;
}

var gui;

const localSandState = JSON.parse(localStorage.getItem("sandState"));

if (localSandState) {
  grid = localSandState;
} else {
  grid = [...Array(xSize)].map((e) => Array(ySize)); //create double array of canvas size
}

function setup() {
  // put setup code here
  frameRate(60);
  /* xSize = windowWidth;
  ySize = windowHeight; */
  createCanvas(xSize, ySize);

  background(240);

  //gui stuff
  gui = createGui("falling sand gui").setPosition(width + 20, 20);

  gui.addGlobals("sandColor", "saveState", "randomSandColor");

  // Set a random seed for consistency.
  randomSeed(99);
}

function draw() {
  // put drawing code here
  let c = sandColor;

  clear();
  background(240);

  if (mouseIsPressed) {
    if (randomSandColor) {
      c = rgbToHex(r, g, b);
    }
    spawnGrain(mouseX, mouseY, c);
  }

  renderGrid(grid);
  dropGrain(grid);

  if (saveState) {
    localStorage.setItem("sandState", JSON.stringify(grid));
  } else {
    localStorage.setItem("sandState", JSON.stringify(null));
  }

  localStorage.setItem("saveBool", JSON.stringify(saveState));
  localStorage.setItem("randomBool", JSON.stringify(randomSandColor));
}

function mousePressed() {
  //rgb values for sand color is randomly chosen for every mouse press if the random bool is checked

  if (randomSandColor) {
    r = Math.round(random(0, 255));
    g = Math.round(random(0, 255));
    b = Math.round(random(0, 255));
  }
}

//checks below coordinates to see if it's occupied
function checkBelow(x, y) {
  if (y + 1 >= ySize) {
    return true;
  }

  if (grid[x][y + 1]) {
    return true;
  }

  return false;
}

function checkBelowLeft(x, y) {
  if (y + 1 >= ySize || x - 1 <= 0) {
    return true;
  }

  if (grid[x - 1][y + 1]) {
    return true;
  }

  return false;
}

function checkBelowRight(x, y) {
  if (y + 1 >= ySize || x + 1 >= xSize) {
    return true;
  }

  if (grid[x + 1][y + 1]) {
    return true;
  }

  return false;
}

//renders the playfield grid
function renderGrid(grid) {
  for (let x = 0; x < xSize; x++) {
    for (let y = 0; y < ySize; y++) {
      if (grid[x][y]) {
        stroke(grid[x][y]._color); //TODO:BRING BACK THE getColor() function, will have to find a way to parse the local storage as SandGrain object before saving it to grid
        strokeWeight(2);
        point(x, y);
        noStroke();
      }
    }
  }
}

//spawns the grain of sand at specific coordinates with a chosen color
function spawnGrain(x, y, color) {
  if (x < xSize && y < ySize && !grid[x][y]) {
    grid[x][y] = new SandGrain(color);
  }
}

//simulates falling of grain of sand by one tick
function dropGrain(grid) {
  for (let x = 0; x < xSize; x++) {
    //loop through y axis inverted to check from bottom to up
    for (let y = ySize - 1; y >= 0; y--) {
      //check if the floor is beneath
      if (y + 1 >= ySize) {
      } else {
        if (grid[x][y]) {
          //check if there is room to fall directly under
          if (!checkBelow(x, y)) {
            grid[x][y + 1] = grid[x][y];
            grid[x][y] = undefined;
          } else {
            //check if grain can fall to the right or left
            if (!checkBelowLeft(x, y) && !checkBelowRight(x, y)) {
              let ran = random([0, 1]);

              if (ran) {
                grid[x + 1][y + 1] = grid[x][y];
                grid[x][y] = undefined;
              } else {
                grid[x - 1][y + 1] = grid[x][y];
                grid[x][y] = undefined;
              }
            } else if (!checkBelowLeft(x, y)) {
              grid[x - 1][y + 1] = grid[x][y];
              grid[x][y] = undefined;
            } else if (!checkBelowRight(x, y)) {
              grid[x + 1][y + 1] = grid[x][y];
              grid[x][y] = undefined;
            }
          }
        }
      }
    }
  }
}

//for use to convert individual r,g,b components to hex
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

//for converting rgb values to hex
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
