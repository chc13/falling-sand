class SandGrain {
  constructor() {
    this._color = null;
  }

  getColor() {
    return this._color;
  }

  setColor(color) {
    this._color = color;
  }
}

function setup() {
  // put setup code here
  frameRate(60);
  createCanvas(800, 800);
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

  point(mouseX, mouseY);

  stroke("red");
  point(100, 100);
}
