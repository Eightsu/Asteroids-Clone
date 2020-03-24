import "./styles.css";

// Initial
let canvas = document.getElementById("app");
let ctx = canvas.getContext("2d");

const SHIP_SIZE = 30; /* in pixels*/
const FPS = 30;

let ship = {
  Xpos: canvas.width / 2,
  Ypos: canvas.height / 2,
  radius: SHIP_SIZE / 2,
  direction: (90 / 180) * Math.PI /* deg to rad */
};

let update = () => {
  // Draw BG

  ctx.filStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Triangular Ship
  ctx.strokeStyle = "white";
  ctx.lineWidth = SHIP_SIZE / 20;
  ctx.beginPath();
  ctx.moveTo(
    // Nose of the Ship
    ship.Xpos + ship.radius * Math.cos(ship.direction),
    ship.Ypos - ship.radius * Math.sin(ship.direction)
  );
  ctx.lineTo(
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
  ctx.stroke();
  // Move Ship

  // Rotate Ship


  // center dot
};

const gameloop = () => {
  setInterval(update, 1000 / FPS);
};

gameloop();
