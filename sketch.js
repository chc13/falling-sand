/* import SandGrain from "./sandgrain.js"; */

let grid; //array of the play field
const xSize = 800;
const ySize = 800;

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

  if (mouseIsPressed) {
    point(mouseX, mouseY);
  }
}

/* function mousePressed() {
  point(mouseX, mouseY);
} */

//checks below coordinates to see if it's occupied
function checkBelow(x, y) {}

//renders the playfield grid
function renderGrid() {}

//simulates falling of grain of sand by one tick
function dropGrain() {}