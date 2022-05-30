const canvas = document.querySelector("canvas");
const canvasContext = canvas.getContext("2d");

// adjust size of canvas to fit standard computer screens
canvas.width = 1024;
canvas.height = 576;

// adjust canvas color, dimensions, and coordinates
canvasContext.fillRect(
  (x = 0),
  (y = 0),
  (w = canvas.width),
  (h = canvas.height)
);

const gravity = 0.7;

class Sprite {
  // take in all params as 1 obj
  // destructures
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.lastKeyPressed = "";
  }

  draw() {
    // color for rect to draw
    canvasContext.fillStyle = "red";

    // dimensions and coors
    canvasContext.fillRect(
      (x = this.position.x),
      (y = this.position.y),
      (w = 50),
      (h = this.height)
    );
  }

  update() {
    this.draw();

    // move left by adjusting position x by velocity x
    this.position.x += this.velocity.x;

    // make sprite fall by adding its velocity to its position
    // due to gravity, velocity increases exponentially
    this.position.y += this.velocity.y;

    // stops falling when sprite's feet are at bottom of canvas
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      // make sprite fall faster by adding gravity so long as
      // sprite is not at bottom of canvas
      this.velocity.y += gravity;
    }
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },

  // player not moving by default
  velocity: {
    x: 0,
    y: 0,
  },
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },

  velocity: {
    x: 0,
    y: 0,
  },
});

console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

// what to do in every frame of animation loop
function animate() {
  window.requestAnimationFrame(animate);

  // how large of rect to refill? Whole screen.
  // prevents "paint drip" effect of obj moving
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(
    (x = 0),
    (y = 0),
    (w = canvas.width),
    (h = canvas.height)
  );

  player.update();
  enemy.update();

  // setting velocity to 0 prevents sliding when key pressed
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKeyPressed === "a") {
    player.velocity.x = -4;
  } else if (keys.d.pressed && player.lastKeyPressed === "d") {
    player.velocity.x = 4;
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKeyPressed === "ArrowLeft") {
    enemy.velocity.x = -4;
  } else if (keys.ArrowRight.pressed && enemy.lastKeyPressed === "ArrowRight") {
    enemy.velocity.x = 4;
  }
}

animate();

// listen for key being pressed down
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    // player keys
    case "d":
      keys.d.pressed = true;
      player.lastKeyPressed = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKeyPressed = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;

    // enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKeyPressed = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKeyPressed = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
  }
});

// listen for key being lifted
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    // player keys
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;

    // enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});