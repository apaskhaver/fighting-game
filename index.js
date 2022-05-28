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

const gravity = 0.2;

class Sprite {
  // take in all params as 1 obj
  // destructures
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
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
}

animate();

// listen for key being pressed
window.addEventListener("keydown", (event) => {
  console.log(event);
});
