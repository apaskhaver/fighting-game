class Sprite {
  constructor({
    position,
    imageSource,
    scale = 1,
    maxFramesInImage = 1,
    currentFrame = 0,
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    // creates a new HTML image inside the JS property this.image
    this.image = new Image();
    this.image.src = imageSource;
    this.scale = scale;
    this.maxFramesInImage = maxFramesInImage;
    this.currentFrame = currentFrame;
  }

  draw() {
    canvasContext.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.maxFramesInImage), // crop location
      0, // crop location
      this.image.width / this.maxFramesInImage, // crop location, width / number of frames
      this.image.height, // crop location
      this.position.x,
      this.position.y,
      (this.image.width / this.maxFramesInImage) * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
    if (this.currentFrame < this.maxFramesInImage) {
      this.currentFrame++;
    } else {
      this.currentFrame = 0;
    }
  }
}

class Fighter {
  // take in all params as 1 obj and destructures
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKeyPressed = "";
    this.attackBox = {
      // attack box position doesn't follow player, values left as assigned initially
      // must update in update()
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset, // shorthand syntax for offset: offset, setting our offset to param offset
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
  }

  draw() {
    // color for rect to draw
    canvasContext.fillStyle = this.color;

    // dimensions and coors
    canvasContext.fillRect(
      (x = this.position.x),
      (y = this.position.y),
      (w = this.width),
      (h = this.height)
    );

    if (this.isAttacking) {
      // attack box
      canvasContext.fillStyle = "green";
      canvasContext.fillRect(
        (x = this.attackBox.position.x),
        (y = this.attackBox.position.y),
        (w = this.attackBox.width),
        (h = this.attackBox.height)
      );
    }
  }

  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    // move left by adjusting position x by velocity x
    this.position.x += this.velocity.x;

    // make sprite fall by adding its velocity to its position
    // due to gravity, velocity increases exponentially
    this.position.y += this.velocity.y;

    // stops falling when sprite's feet are above bottom of canvas
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
    } else {
      // make sprite fall faster by adding gravity so long as
      // sprite is not at bottom of canvas
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;

    // attack cooldown of 100 ms
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}
