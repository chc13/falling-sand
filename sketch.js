let grid; //array of the play field
let canvas;

//canvas sizes
const xSize = 800;
const ySize = 600;

//rgb values for the random color options
let r = 255;
let g = 255;
let b = 255;

var sandColor = "#FFA500";

let mouseOverCanvas = false;

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

var sandCount;
var sandCountMulti;
const localSandCount = JSON.parse(localStorage.getItem("sandCount"));

if (localSandCount) {
  sandCount = localSandCount;
} else {
  sandCount = 0;
}

//p5 party shared objects
//let shared; //shared object to be synced across players
//shared = { x: 0, y: 0, color: "#FFA500" };
let me, guests;
let isMultiplayer;

const names = [
  "Cookie",
  "Potato",
  "Lemon",
  "Plant",
  "Candy",
  "Cow",
  "Capitalist",
  "Hero",
  "Paperclip",
  "Forage",
  "Trimp",
  "Room",
];

//p5 party preload step
function preload() {
  //using a class in the html to detect whether to start this in multiplayer or single player mode
  let multiID = select(".multi-id");

  if (multiID != null) {
    console.log("multiplayer mode detected");
    isMultiplayer = true;
  } else {
    console.log("single player mode detected");
    isMultiplayer = false;
  }

  if (isMultiplayer) {
    partyConnect("wss://demoserver.p5party.org", "chc13_falling-sand"); //connect to p5 party example server

    //shared = partyLoadShared("globals", shared);

    guests = partyLoadGuestShareds();
    me = partyLoadMyShared({
      x: 0,
      y: 0,
      color: "#FFA500",
      mouseIsPressed: false,
      sandCount: 0,
      name: pick(names),
      mouseOverCanvas: false,
    });

    //always create an empty canvas if it's in multiplayer
    if (localSandState) {
      grid = [...Array(xSize)].map((e) => Array(ySize)); //create double array of canvas size
    }
    sandCount = 0;
    sandCountMulti = 0;
  }
}

function setup() {
  // put setup code here
  frameRate(60);
  //noStroke();
  /* xSize = windowWidth;
  ySize = windowHeight; */
  canvas = createCanvas(xSize, ySize);

  background(240);

  //gui stuff
  gui = createGui("falling sand gui").setPosition(width + 20, 20);

  if (!isMultiplayer) {
    gui.addGlobals("sandColor", "saveState", "randomSandColor");
  } else {
    gui.addGlobals("sandColor", "randomSandColor");
  }

  // Set a random seed for consistency.
  randomSeed(99);

  if (isMultiplayer) {
    if (partyIsHost()) {
      console.log("This client is the host.");
    }

    me.name = "Player " + guests.length;

    console.log("Your name is " + me.name);
  }
}

function draw() {
  // put drawing code here
  let c = sandColor;

  clear();
  background(240);

  //checks to see if mouse is on the canvas
  canvas.mouseOver(function () {
    mouseOverCanvas = true;
  });
  canvas.mouseOut(function () {
    mouseOverCanvas = false;
  });

  if (mouseIsPressed && mouseOverCanvas) {
    if (randomSandColor) {
      c = rgbToHex(r, g, b);
    }
    if (!isMultiplayer) {
      spawnGrain(mouseX, mouseY, c);
      //sandCount++;
    }
  }

  renderGrid(grid);
  dropGrain(grid);

  //only save the state when it's single player
  if (!isMultiplayer) {
    if (saveState) {
      localStorage.setItem("sandState", JSON.stringify(grid));
      localStorage.setItem("sandCount", JSON.stringify(sandCount));
    } else {
      localStorage.setItem("sandState", JSON.stringify(null));
      localStorage.setItem("sandCount", JSON.stringify(null));
    }

    localStorage.setItem("saveBool", JSON.stringify(saveState));
    /* localStorage.setItem("sandCount", JSON.stringify(sandCount)); */
  }
  localStorage.setItem("randomBool", JSON.stringify(randomSandColor));

  /*  if (partyIsHost()) {
    shared.x = mouseX;
    shared.y = mouseY;
  } */

  if (isMultiplayer) {
    sandCountMulti = 0;
    for (let i = 0; i < guests.length; i++) {
      //spawn grain for players if their mouse is pressed
      fill(guests[i].color);
      strokeWeight(1);
      circle(guests[i].x, guests[i].y, 10);

      if (guests[i].mouseIsPressed && guests[i].mouseOverCanvas) {
        spawnGrainMulti(
          guests[i].x,
          guests[i].y,
          guests[i].color,
          guests[i].name
        );
      }

      textSize(18);
      fill("black");
      text(guests[i].name + ": " + guests[i].sandCount, 10, i * 20 + 48);

      //total up sand count for all players
      sandCountMulti += guests[i].sandCount;
    }

    //draw total sand count for multi
    textSize(18);
    fill("black");
    text("Total Sand: " + sandCountMulti, 10, 20);

    //updated personal shared data
    me.x = mouseX;
    me.y = mouseY;

    me.color = c;
    me.mouseIsPressed = mouseIsPressed;

    me.sandCount = sandCount;

    me.mouseOverCanvas = mouseOverCanvas;
  } else {
    //create circle cursor for single player
    fill(c);
    strokeWeight(1);
    circle(mouseX, mouseY, 10);

    //draw total sand count for single player
    textSize(18);
    fill("black");
    text("Total Sand: " + sandCount, 10, 20);
  }

  //draw total sand count text
  /* textSize(18);
  fill("black");
  if (!isMultiplayer) {
    text("Total Sand: " + sandCount, 10, 20);
  } else {
    text("Total Sand: " + sandCountMulti, 10, 20);
  } */
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
    let temp = { _color: color }; //using this instead of SandGrain since OOP objects arent allowed to be shared through p5 party
    grid[x][y] = temp;
    /* grid[x][y] = new SandGrain(color); */

    //if (!isMultiplayer) {
    sandCount++;
    //}
  }
}

//spawn grain function but for multiplayer, uses name to make sure that only their sandcount is added
function spawnGrainMulti(x, y, color, name) {
  if (x < xSize && y < ySize && !grid[x][y]) {
    let temp = { _color: color }; //using this instead of SandGrain since OOP objects arent allowed to be shared through p5 party
    grid[x][y] = temp;
    /* grid[x][y] = new SandGrain(color); */

    //if (!isMultiplayer) {
    //sandCount++;
    //}

    if (me.name == name) {
      sandCount++;
    }
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

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}
