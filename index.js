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

class Sprite {
  constructor(position) {
    this.position = position;
  }

  draw() {
    // color
    canvasContext.fillStyle = "red";
    // dimensions and coors
    canvasContext.fillRect(
      (x = this.position.x),
      (y = this.position.y),
      (w = 50),
      (h = 50)
    );
  }
}

const player = new Sprite({
  x: 0,
  y: 0,
});
player.draw();
console.log(player);
