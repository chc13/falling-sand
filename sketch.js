let grid; //array of the play field

//canvas sizes
const xSize = 800;
const ySize = 600;
grid = [...Array(xSize)].map((e) => Array(ySize)); //create double array of canvas size

let r = 255;
let g = 255;
let b = 255;

function setup() {
  // put setup code here
  frameRate(60);
  createCanvas(xSize, ySize);
  background(240);

  // Set a random seed for consistency.
  randomSeed(99);
}

function draw() {
  // put drawing code here
  let c = color(r, g, b);

  clear();
  background(240);

  if (mouseIsPressed) {
    spawnGrain(mouseX, mouseY, c);
  }

  renderGrid(grid);
  dropGrain(grid);
}

function mousePressed() {
  //rgb values for sand color is randomly chosen for every mouse press
  r = random(0, 255);
  g = random(0, 255);
  b = random(0, 255);
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
        stroke(grid[x][y].getColor());
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
