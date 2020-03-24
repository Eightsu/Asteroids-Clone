import "./styles.css";

// Initial
let canvas = document.getElementById("app");
let ctx = canvas.getContext("2d");

const FPS = 30;

const update = () => {
  // Draw BG

  ctx.filStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Draw Ship

  // Move Ship

  // Rotate Ship
};

const gameloop = FPS => {
  setInterval(update, 1000 / FPS);
};
