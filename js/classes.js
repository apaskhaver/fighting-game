class Sprite {
  constructor({
    position,
    imageSource,
    scale = 1,
    maxFramesInImage = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    // creates a new HTML image inside the JS property this.image
    this.image = new Image();
    this.image.src = imageSource;
    this.scale = scale;
    this.maxFramesInImage = maxFramesInImage;
    this.framesElapsed = 0;
    this.framesHold = 10;
    this.currentFrame = 0;
    this.offset = offset;
  }

  draw() {
    canvasContext.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.maxFramesInImage), // crop location
      0, // crop location
      this.image.width / this.maxFramesInImage, // crop location, width / number of frames
      this.image.height, // crop location
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.maxFramesInImage) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrame() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.maxFramesInImage - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrame();
  }
}

class Fighter extends Sprite {
  // take in all params as 1 obj and destructures
  constructor({
    position,
    velocity,
    color = "red",
    imageSource,
    scale = 1,
    maxFramesInImage = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({ position, imageSource, scale, maxFramesInImage, offset });
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
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
    this.framesElapsed = 0;
    this.framesHold = 7;
    this.currentFrame = 0;
    this.isDead = false;
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      // dynamically add new property
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSource;
    }
  }

  update() {
    this.draw();

    if (!this.isDead) {
      this.animateFrame();
    }

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // draw attack box
    // canvasContext.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    // move left by adjusting position x by velocity x
    this.position.x += this.velocity.x;

    // make sprite fall by adding its velocity to its position
    // due to gravity, velocity increases exponentially
    this.position.y += this.velocity.y;

    // stops falling when sprite's feet are above bottom of canvas
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      // make sprite fall faster by adding gravity so long as
      // sprite is not at bottom of canvas
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;

    // attack cooldown of 100 ms
    // setTimeout(() => {
    //   this.isAttacking = false;
    // }, 100);
  }

  takeHit() {
    this.health -= 20;

    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  switchSprite(sprite) {
    // attack overrides all other animations
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.sprites.death.maxFramesInImage - 1) {
        this.isDead = true;
      }
      return;
    }

    // attack overrides all other animations
    if (
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.maxFramesInImage - 1
    ) {
      return;
    }

    // taking hit overrides all other animations
    if (
      this.image === this.sprites.takeHit.image &&
      this.currentFrame < this.sprites.takeHit.maxFramesInImage - 1
    ) {
      return;
    }

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.maxFramesInImage = this.sprites.idle.maxFramesInImage;
          this.currentFrame = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.maxFramesInImage = this.sprites.run.maxFramesInImage;
          this.currentFrame = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.maxFramesInImage = this.sprites.jump.maxFramesInImage;
          this.currentFrame = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.maxFramesInImage = this.sprites.fall.maxFramesInImage;
          this.currentFrame = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.maxFramesInImage = this.sprites.attack1.maxFramesInImage;
          this.currentFrame = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.maxFramesInImage = this.sprites.takeHit.maxFramesInImage;
          this.currentFrame = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.maxFramesInImage = this.sprites.death.maxFramesInImage;
          this.currentFrame = 0;
        }
        break;
    }
  }
}
