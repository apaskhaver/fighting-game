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

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSource: "./img/background.png",
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },

  // player not moving by default
  velocity: {
    x: 0,
    y: 0,
  },

  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },

  velocity: {
    x: 0,
    y: 0,
  },

  offset: {
    x: -50,
    y: 0,
  },

  color: "blue",
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

function rectangularCollision({ attacker, beingHit }) {
  return (
    attacker.attackBox.position.x + attacker.attackBox.width >=
      beingHit.position.x &&
    attacker.attackBox.position.x <= beingHit.position.x + beingHit.width &&
    attacker.attackBox.position.y + attacker.attackBox.height >=
      beingHit.position.y &&
    attacker.attackBox.position.y <= beingHit.position.y + beingHit.height
  );
}

function displayGameOverText({ player, enemy, timerID }) {
  // stop timer
  clearTimeout(timerID);

  // need to change display from none to flex for the div to render in index.html
  document.querySelector("#displayGameOverText").style.display = "flex";

  if (player.health === enemy.health) {
    document.querySelector("#displayGameOverText").innerHTML = "Tie!";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayGameOverText").innerHTML = "Player 1 Wins!";
  } else if (enemy.health > player.health) {
    document.querySelector("#displayGameOverText").innerHTML = "Player 2 Wins!";
  }
}
let timer = 60;
let timerID = 0;

function decreaseTimer() {
  // setTimeOut keeps calling the function w/ a second pause
  if (timer > 0) {
    timerID = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  // game over
  if (timer === 0) {
    displayGameOverText({ player: player, enemy: enemy, timerID: timerID });
  }
}

decreaseTimer();

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

  // want background to render first so it doesn't cover players
  background.update();
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

  // detect for collisions and attack state
  if (
    rectangularCollision({
      attacker: player,
      beingHit: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    // health rendered as 80%, 60%, 40% ... of whole bar
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    console.log("Boom!");
  }

  if (
    rectangularCollision({
      attacker: enemy,
      beingHit: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
    console.log("Blast!");
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    displayGameOverText({ player: player, enemy: enemy, timerID: timerID });
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
    case " ":
      player.attack();
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
    case "ArrowDown":
      enemy.attack();
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
