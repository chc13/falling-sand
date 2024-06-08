function setup() {
  // put setup code here
  createCanvas(400, 400);
  background(220);
}

function draw() {
  // put drawing code here
  /* background(220); */
  /* ellipse(50, 50, 80, 80); */
  /* rect(50, 50, 20, 20); */

  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);
}
