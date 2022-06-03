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
