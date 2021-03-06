import "./styles.css";
import { SHIP, newShip, BULLETS } from "./ship";
import { ASTEROIDS } from "./asteroid";
import { ctx, canvas, UI, info, infoContext, HIGH_SCORE_KEY } from "./global";
import { checkCollision } from "./utils";

const FPS = 30;
const PLAYER_LIVES = 3;
// TEST CONSTANTS
const BOUNDING_BOX = false;

//  GLOBALS
let asteroids = [];
let ship;
let level;
let text; // info for player
let textAlpha; // fade out
let lives;
let score;
let highScore;

// Asteroids

// UI
// infoContext.fillStyle = "blue";
// infoContext.fillRect(0, 0, info.width, info.height);

const generateAsteroidBelt = () => {
  asteroids = [];

  let x, y;
  for (let i = 0; i < ASTEROIDS.AST_NUM - 2 + level; i++) {
    do {
      x = Math.floor(Math.random() * canvas.width);
      y = Math.floor(Math.random() * canvas.height);
    } while (
      checkCollision(ship.Xpos, ship.Ypos, x, y) <
      ASTEROIDS.AST_SIZE * 2
    );
    asteroids.push(newAsteroid(x, y, Math.ceil(ASTEROIDS.AST_SIZE / 2)));
    // (;
  }
};

const destroyAsteroid = index => {
  //  three stages, destroy asteroid on last stage
  let x = asteroids[index].x;
  let y = asteroids[index].y;
  let radius = asteroids[index].radius;

  if (radius === Math.ceil(ASTEROIDS.AST_SIZE / 2)) {
    //  make two new asteroids from original asteroid
    asteroids.push(newAsteroid(x, y, ASTEROIDS.AST_SIZE / 4));
    asteroids.push(newAsteroid(x, y, ASTEROIDS.AST_SIZE / 4));
    score += ASTEROIDS.AST_POINTS.LARGE;
  } else if (radius === Math.ceil(ASTEROIDS.AST_SIZE / 4)) {
    asteroids.push(newAsteroid(x, y, ASTEROIDS.AST_SIZE / 8));
    asteroids.push(newAsteroid(x, y, ASTEROIDS.AST_SIZE / 8));
    score += ASTEROIDS.AST_POINTS.MEDIUM;
  } else {
    score += ASTEROIDS.AST_POINTS.SMALL;
  }

  if (score > highScore) {
    highScore = score;
    localStorage.setItem(HIGH_SCORE_KEY, highScore);
  }

  asteroids.splice(index, 1);
  if (!ship.finished && asteroids.length === 0) {
    level++;
    newLevel();
  }
};

const shootBullet = () => {
  if (ship.enableShooting && ship.bullets.length < BULLETS.BULLET_MAX_NUMBER) {
    ship.bullets.push({
      x: ship.Xpos + ship.radius * Math.cos(ship.direction),
      y: ship.Ypos - ship.radius * Math.sin(ship.direction),
      xBulletVelocity: (BULLETS.BULLET_SPEED * Math.cos(ship.direction)) / FPS,
      yBulletVelocity:
        (BULLETS.BULLET_SPEED * -1 * Math.sin(ship.direction)) / FPS,
      distance: 0,
      explodeTime: 0
    });
  }

  ship.enableShooting = false;
};

const newAsteroid = (x, y, radius) => {
  let lvlMultiplier = 1 + 0.15 * level;
  let asteroid = {
    x: x,
    asteroidXVelocity:
      ((Math.random() * ASTEROIDS.AST_SPEED * lvlMultiplier) / FPS) *
      (Math.random() < 0.6 ? 1 : -1),
    y: y,
    asteroidYVelocity:
      ((Math.random() * ASTEROIDS.AST_SPEED * lvlMultiplier) / FPS) *
      (Math.random() < 0.6 ? 1 : -1),
    radius: radius,
    direction: Math.random() * Math.PI * 2,
    verticies: Math.floor(
      Math.random() * (ASTEROIDS.AST_VERTICIES + 2) +
        ASTEROIDS.AST_VERTICIES / 2
    ),
    offset: []
  };

  for (let i = 0; i < asteroid.verticies; i++) {
    asteroid.offset.push(
      Math.random() * ASTEROIDS.AST_DECIMATION * 4 +
        1 -
        ASTEROIDS.AST_DECIMATION
    );
  }
  return asteroid;
};

const drawShip = (XPos, YPos, direction, color = "rgba(255,255,255,0.2)") => {
  ctx.strokeStyle = color;
  ctx.lineWidth = SHIP.SHIP_SIZE / 20;
  ctx.beginPath();
  ctx.moveTo(
    // Nose of the Ship
    XPos + ship.radius * Math.cos(direction),
    YPos - ship.radius * Math.sin(direction)
  );
  ctx.lineTo(
    // Bottom Left
    XPos - ship.radius * (Math.cos(direction) + Math.sin(direction)),
    YPos + ship.radius * (Math.sin(direction) - Math.cos(direction))
  );

  ctx.lineTo(
    // Bottom Right
    XPos - ship.radius * (Math.cos(direction) - Math.sin(direction)),
    YPos + ship.radius * (Math.sin(direction) + Math.cos(direction))
  );
  ctx.closePath();
  ctx.stroke();
};

const destroyShip = () => {
  ship.explodeTime = Math.ceil(SHIP.SHIP_EXPLODE_DURATION * FPS);
  // ship = newShip()
};

const newLevel = () => {
  text = `LEVEL ${level + 1}`;
  textAlpha = 1.0;
  generateAsteroidBelt();

  if (lives < 3 && score / 5000 === 2) {
    lives++;
  }
};

const gameOver = () => {
  ship.finished = true;

  text = "GAME OVER";
  textAlpha = 1.0;
  setTimeout(function() {
    newGame();
  }, 5000);
};
const newGame = () => {
  score = 0;
  level = 0;
  lives = PLAYER_LIVES;
  ship = newShip();

  let highScoreKey = localStorage.getItem(HIGH_SCORE_KEY);
  if (highScoreKey === null) {
    highScore = 0;
  } else {
    highScore = parseInt(highScoreKey, 10);
  }
  newLevel();
};

newGame();

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// CONTROLS
function keyDown(e) {
  if (ship.finished || ship.explodeTime > 0) {
    return null;
  }
  switch (e.keyCode) {
    case 37: // left arrow (rotate ship left)
      ship.rotation = ((SHIP.SHIP_TURN_SPEED / 180) * Math.PI) / FPS;
      break;
    case 38: // up arrow (thrust the ship forward)
      ship.thrusting = true;
      // console.log('thrust')
      break;
    case 39: // right arrow (rotate ship right)
      ship.rotation = (((SHIP.SHIP_TURN_SPEED * -1) / 180) * Math.PI) / FPS;
      break;
    case 32: // spacebar
      shootBullet();
      break;
    case 82:
      // press r to reset
      newGame();
      break;

    default:
      return null;
  }
}

function keyUp(e) {
  if (ship.finished) {
    return null;
  }
  switch (e.keyCode) {
    case 37: // left arrow (stop rotating left)
      ship.rotation = 0;
      break;
    case 38: // up arrow (stop thrusting)
      ship.thrusting = false;
      // console.log('stop')
      break;
    case 39: // right arrow (stop rotating right)
      ship.rotation = 0;
      break;
    case 32: // allow new press
      ship.enableShooting = true;
      break;
    default:
      return null;
  }
}

let update = () => {
  // console.log(textAlpha);
  let onBlink = ship.blinkNum % 2 === 0;
  let isExploding = ship.explodeTime > 0;
  // Draw BG

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Thrust
  if (ship.thrusting && !ship.finished) {
    ship.thrust.x += (SHIP.SHIP_THRUST * Math.cos(ship.direction)) / FPS;
    ship.thrust.y -= (SHIP.SHIP_THRUST * Math.sin(ship.direction)) / FPS;

    // Draw Thrust
    if (!isExploding && onBlink) {
      ctx.fillStyle = "black";
      ctx.strokeStyle = "blue";
      ctx.lineWidth = SHIP.SHIP_SIZE / 10;
      // ctx.globalAlpha = 0.2
      ctx.beginPath();
      ctx.moveTo(
        // Bottom Left
        ship.Xpos -
          ship.radius * (Math.cos(ship.direction) + Math.sin(ship.direction)),
        ship.Ypos +
          ship.radius * (Math.sin(ship.direction) - Math.cos(ship.direction))
      );
      ctx.lineTo(
        // Bottom Right
        ship.Xpos -
          ship.radius * (Math.cos(ship.direction) - Math.sin(ship.direction)),
        ship.Ypos +
          ship.radius * (Math.sin(ship.direction) + Math.cos(ship.direction))
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else {
    ship.thrust.x -= (SHIP.SHIP_DRAG * ship.thrust.x) / FPS;
    ship.thrust.y -= (SHIP.SHIP_DRAG * ship.thrust.y) / FPS;
  }

  // Draw Triangular Ship
  // ctx.fillStyle= 'green'

  if (!isExploding) {
    if (onBlink && !ship.finished) {
      drawShip(ship.Xpos, ship.Ypos, ship.direction, "white");
    }

    if (ship.blinkNum > 0) {
      ship.blinkTime--;
      if (ship.blinkTime === 0) {
        ship.blinkTime = Math.ceil(SHIP.SHIP_BLINK_DURATION * FPS);
        ship.blinkNum--;
      }
    }
  } else {
    ctx.fillStyle = "lightgrey";
    ctx.strokeStyle = "slategrey";
    ctx.beginPath();
    ctx.arc(ship.Xpos, ship.Ypos, ship.radius * 1.3, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.fill();
    ctx.strokeStyle = "lightgrey";
    ctx.beginPath();
    ctx.arc(ship.Xpos, ship.Ypos, ship.radius * 1.5, 0, Math.PI * 2, false);
    ctx.stroke();
    ctx.fill();
    ctx.strokeStyle = "slategrey";
    ctx.beginPath();
    ctx.arc(ship.Xpos, ship.Ypos, ship.radius * 1.9, 0, Math.PI * 2, false);
    ctx.stroke();
  }

  if (BOUNDING_BOX) {
    ctx.strokeStyle = "lime";
    ctx.beginPath();
    ctx.arc(ship.Xpos, ship.Ypos, ship.radius, 0, Math.PI * 2, false);
    ctx.stroke();
  }

  // Draw Bullets
  for (let i = 0; i < ship.bullets.length; i++) {
    if (ship.bullets[i].explodeTime === 0) {
      ctx.fillStyle = "red";
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(
        ship.bullets[i].x,
        ship.bullets[i].y,
        SHIP.SHIP_SIZE / 15,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.stroke();
    }
  }

  // detect bullet collision with asteroids.
  // b = bullet, a = asteroid

  let bx, by, ax, ay, ar;
  for (let i = asteroids.length - 1; i >= 0; i--) {
    ax = asteroids[i].x;
    ay = asteroids[i].y;
    ar = asteroids[i].radius;

    for (let j = ship.bullets.length - 1; j >= 0; j--) {
      bx = ship.bullets[j].x;
      by = ship.bullets[j].y;

      if (checkCollision(ax, ay, bx, by) < ar) {
        // for now remove asteroid
        ship.bullets.splice(j, 1);
        destroyAsteroid(i);
        break;
      }
    }
  }

  // draw Asteroids

  let x, y, radius, direction, verticies, offset;
  for (let i = 0; i < asteroids.length; i++) {
    ctx.strokeStyle = "linen";
    ctx.lineWidth = SHIP.SHIP_SIZE / 30;
    x = asteroids[i].x;
    y = asteroids[i].y;
    radius = asteroids[i].radius;
    direction = asteroids[i].direction;
    verticies = asteroids[i].verticies;
    offset = asteroids[i].offset;

    ctx.beginPath();
    ctx.moveTo(
      x + radius * offset[0] * Math.cos(direction),
      y + radius * offset[0] * Math.sin(direction)
    );

    // graph polygon
    for (let j = 2; j < verticies; j++) {
      ctx.lineTo(
        x +
          radius *
            offset[j] *
            Math.cos(direction + (j * Math.PI * 2) / verticies),
        y +
          radius *
            offset[j] *
            Math.sin(direction + (j * Math.PI * 2) / verticies)
      );
    }
    ctx.closePath();
    ctx.stroke();

    if (BOUNDING_BOX) {
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      ctx.stroke();
    }

    // Move Asteroid
  }

  // GAME TEXT
  if (textAlpha >= 0) {
    ctx.textAlign = "center";
    ctx.fillStyle = `rgba(255,255,255,${textAlpha})`;
    ctx.font = ` ${UI.FONT_SIZE}px verdana`;
    ctx.fillText(text, canvas.width / 2, canvas.height / 1.2);
    textAlpha -= textAlpha / UI.TEXT_FADE_DURATION / FPS;
  }

  ctx.textAlign = "right";
  // ctx.textBasline = "middle";
  ctx.fillStyle = "green";
  ctx.font = ` ${UI.FONT_SIZE * 0.75}px verdana`;
  ctx.fillText(score, canvas.width - SHIP.SHIP_SIZE / 2, SHIP.SHIP_SIZE * 1.4);

  ctx.textAlign = "center";
  // ctx.textBasline = "middle";
  ctx.fillStyle = "white";
  ctx.font = ` ${UI.FONT_SIZE * 0.5}px verdana`;
  ctx.fillText(`Top ${highScore}`, canvas.width / 2, SHIP.SHIP_SIZE * 1.4);

  // console.log(textAlpha);

  //  SHOW PLAYER LIFE COUNT

  for (let i = 0; i < lives; i++) {
    let lifeIndicator;
    lifeIndicator =
      isExploding && i === lives - 1 ? "red" : "rgba(255,255,255,0.3)";
    drawShip(
      SHIP.SHIP_SIZE + i * SHIP.SHIP_SIZE * 1.1,
      SHIP.SHIP_SIZE,
      0.5 * Math.PI,
      lifeIndicator
    );
  }

  if (!isExploding) {
    if (ship.blinkNum === 0 && !ship.finished) {
      for (let i = 0; i < asteroids.length; i++) {
        if (
          checkCollision(ship.Xpos, ship.Ypos, asteroids[i].x, asteroids[i].y) <
          ship.radius + asteroids[i].radius
        ) {
          destroyShip();
          destroyAsteroid(i);
          break;
        }
      }
      // Move Ship
      ship.Xpos += ship.thrust.x;
      ship.Ypos += ship.thrust.y;

      ship.direction += ship.rotation;
    }
  } else {
    ship.explodeTime--;

    if (ship.explodeTime === 0) {
      lives--;
      if (lives === 0) {
        gameOver();
      } else {
        ship = newShip();
      }
    }
  }
  // }

  // Rotate Ship

  // Screen Wrap FOR THE SHIP
  if (ship.Xpos <= 0) {
    ship.Xpos = canvas.width - ship.radius;
  } else if (ship.Xpos > canvas.width) {
    // console.log("BOUNDARY")
    ship.Xpos = 0 + ship.radius;
  }

  if (ship.Ypos <= 0) {
    ship.Ypos = canvas.height - ship.radius;
  } else if (ship.Ypos > canvas.height) {
    ship.Ypos = 0 + ship.radius;
  }

  // ASTEROID LOGIC
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].x += asteroids[i].asteroidXVelocity;
    asteroids[i].y += asteroids[i].asteroidYVelocity;

    if (asteroids[i].y < 0 - asteroids[i].radius) {
      asteroids[i].y = canvas.height + asteroids[i].radius;
    } else if (asteroids[i].y > canvas.height + asteroids[i].radius) {
      asteroids[i].y = 0 - asteroids[i].radius;
    }

    if (asteroids[i].x < 0 - asteroids[i].radius) {
      asteroids[i].x = canvas.width + asteroids[i].radius;
    } else if (asteroids[i].x > canvas.width + asteroids[i].radius) {
      // console.log("BOUNDARY")
      asteroids[i].x = 0 - asteroids[i].radius;
    }
  }

  // BULLET LOGIC
  for (let i = ship.bullets.length - 1; i >= 0; i--) {
    if (ship.bullets[i].distance > BULLETS.BULLET_MAX_DISTANCE * canvas.width) {
      ship.bullets.splice(i, 1);
      continue;
      // skip to next iteration, otherwise crash
    }

    // move bullets
    ship.bullets[i].x += ship.bullets[i].xBulletVelocity;
    ship.bullets[i].y += ship.bullets[i].yBulletVelocity;

    // calculate bullet distance
    ship.bullets[i].distance += Math.sqrt(
      Math.pow(ship.bullets[i].xBulletVelocity, 2) +
        Math.pow(ship.bullets[i].yBulletVelocity, 2)
    );

    //  screen wrap X
    if (ship.bullets[i].x < 0) {
      ship.bullets[i].x = canvas.width;
    } else if (ship.bullets[i].x > canvas.width) {
      ship.bullets[i].x = 0;
    }
    //  screen wrap Y
    if (ship.bullets[i].y < 0) {
      ship.bullets[i].y = canvas.height;
    } else if (ship.bullets[i].y > canvas.height) {
      ship.bullets[i].y = 0;
    }
  }
};
const gameloop = () => {
  setInterval(update, 1000 / FPS);
};

gameloop();
