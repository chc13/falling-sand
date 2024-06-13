let grid; //array of the play field

const xSize = 800;
const ySize = 800;
grid = [...Array(xSize)].map((e) => Array(ySize)); //create double array of canvas size

function setup() {
  // put setup code here
  frameRate(60);
  createCanvas(xSize, ySize);
  background(240);
}

function draw() {
  // put drawing code here
  /* clear();
  background(240); */
  /* ellipse(50, 50, 80, 80); */
  /* rect(50, 50, 20, 20); */
  /*   if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  } */
  /* stroke("black");
  ellipse(mouseX, mouseY, 80, 80); */
  /*  point(mouseX, mouseY);

  stroke("red");
  point(100, 100); */

  /* if (mouseIsPressed) {
    point(mouseX, mouseY);
  } */

  clear();
  background(240);

  if (mouseIsPressed) {
    spawnGrain(mouseX, mouseY, "red");
  }

  renderGrid(grid);
  dropGrain(grid);
}

/* function mousePressed() {
  point(mouseX, mouseY);
} */

//checks below coordinates to see if it's occupied
function checkBelow(x, y) {
  if (grid[x][y + 1]) {
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
          if (!checkBelow(x, y)) {
            grid[x][y + 1] = grid[x][y];
            grid[x][y] = undefined;
          }
        }
      }
    }
  }
}
