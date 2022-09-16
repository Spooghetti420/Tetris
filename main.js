class KeyState {
    constructor(state, should_reset) {
      this.state = state;
      this.should_reset = should_reset;
    }
}
  
// game is designed for a square window

// runtime variables
const resolution = [500,500]
let screen;

const flags = {
    "gameOver": false,
    "lineClear": false,
    "tetris": false,
    "wallHit": false,
    "hardDrop": false
}

let time_elapsed = 0;
let running = false; // Start as false  to prevent mouse callback from glitching
let endTime;

// Visuals
let Tetris_image;

// Music and sfx
let Menu_music, Gameplay_music, Game_over, Wall_hit, Line_cleared, hard_drop;

function preload() {
  Menu_music = loadSound("Assets/Music/Menu_music.wav");
  Gameplay_music = loadSound("Assets/Music/Gameplay_music.wav");
  Game_over = loadSound("Assets/Music/Game_over.wav");
  Wall_hit = loadSound("Assets/Music/Wall_hit.wav");
  Line_cleared = loadSound("Assets/Music/Line_cleared.mp3");
  hard_drop = loadSound("Assets/Music/Hard_drop.wav");
  
  Tetris_image = loadImage('Assets/Images/Tetris_image.png');

}

function setup() {
  screen = createCanvas(...resolution);
  frameRate(15);
  game = new GameWindow(resolution, flags);
  menu = new Menu();
  // Menu_music.play();
  running = true;

}

// UI elements
let game;
let menu;

// // inputs Format .active, .should_reset
const keys = {
    [37]: new KeyState(false, false), // left
    [39]: new KeyState(false, false), // right
    [40]: new KeyState(false, false), // down
    [32]: new KeyState(false, true), // space
    [68]: new KeyState(false, true), // d
    [65]: new KeyState(false, true) // a
}

// mainloop
function draw() {
  if (!running) {
    if (Date.now() - endTime > 2000) {
      background(0)
      noLoop();
      return;
    } else {
      background(0, 50);
      return;
    }
    
  }
    const time_start = Date.now();

    // rendering
    menu.render(screen);
    game.render(screen);

    // events and flags
    game.update(time_elapsed);
    game.userInput(keys);

    if (flags["gameOver"]) {
        flags["gameOver"] = false;
        game.render(screen);
        Gameplay_music.stop();
        Game_over.play();
        game.active = false;
        running = false;
    }
    
    if (flags["wallHit"]) {
        flags["wallHit"] = false;
        Wall_hit.play();
    }

    if (flags["lineClear"]) {
        flags["lineClear"] = false;
        Line_cleared.play();
    }

    if (flags["hardDrop"]) {
        flags["hardDrop"] = false;
        hard_drop.play();
    }

    time_end = Date.now();
    time_elapsed = time_end-time_start;
}

function keyPressed() {
  if (!keys.hasOwnProperty(keyCode)) {
    return;
  }
  keys[keyCode].state = true;
}

function keyReleased() {
  if (!keys.hasOwnProperty(keyCode)) {
    return;
  }
  keys[keyCode].state = false;
}

function mousePressed() {
    if (!running) {
      return
    }
    const buttons = menu.checkButtons([mouseX, mouseY]);
    if (buttons["play"]) {
        menu.close();
        Menu_music.stop();
        Gameplay_music.play();
        game.start();
    }
   if (buttons["exit"]) {
     running = false;
     endTime = Date.now();
     Game_over.play();
   }
}