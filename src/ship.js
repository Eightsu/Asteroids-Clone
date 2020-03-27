import { ctx, canvas } from "./global";
const FPS = 30;

export const SHIP = {
  SHIP_TURN_SPEED: 360,
  SHIP_THRUST: 5,
  SHIP_DRAG: 0.7,
  SHIP_EXPLODE_DURATION: 0.8,
  SHIP_I_DURATION: 1,
  SHIP_BLINK_DURATION: 0.2,
  SHIP_SIZE: 40
};

export const BULLETS = {
  BULLET_MAX_NUMBER: 10,
  BULLET_SPEED: 700,
  BULLET_MAX_DISTANCE: 0.5
};

export const newShip = () => {
  return {
    Xpos: canvas.width / 2,
    Ypos: canvas.height / 2,
    radius: SHIP.SHIP_SIZE / 2,
    direction: (90 / 180) * Math.PI /* deg to rad */,
    blinkNum: Math.ceil(SHIP.SHIP_I_DURATION / SHIP.SHIP_BLINK_DURATION),
    blinkTime: Math.ceil(SHIP.SHIP_BLINK_DURATION * FPS),
    rotation: 0,
    finished: false,
    explodeTime: 0,
    thrusting: false,
    enableShooting: true,
    bullets: [],
    thrust: {
      x: 0,
      y: 0
    }
  };
};
