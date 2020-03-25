import './styles.css'

// Initial
let canvas = document.getElementById('app')
let ctx = canvas.getContext('2d')

// SHIP CONSTANTS
const SHIP_SIZE = 40 /* in pixels*/
const FPS = 30
const TURN_SPEED = 360
const SHIP_THRUST = 15
const SHIP_DRAG = 1

// ASTEROID CONSTANTS
const AST_NUM = 6
const AST_SPEED = 100
const AST_SIZE = 100
const AST_VERTICIES = 10
const AST_DECIMATION = 0.3

// TEST CONSTANTS
const BOUNDING_BOX = false

// Ship
let ship = {
  Xpos: canvas.width / 2,
  Ypos: canvas.height / 2,
  radius: SHIP_SIZE / 2,
  direction: (90 / 180) * Math.PI /* deg to rad */,
  rotation: 0,
  thrusting: false,
  thrust: {
    x: 0,
    y: 0
  }
}

let asteroids = []

// Asteroids

const checkSpawnCollision = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

const generateAsteroidBelt = () => {
  asteroids = []

  let x, y
  for (let i = 0; i < AST_NUM - 1; i++) {
    do {
      x = Math.floor(Math.random() * canvas.width)
      y = Math.floor(Math.random() * canvas.height)
    } while (checkSpawnCollision(ship.Xpos, ship.Ypos, x, y) < AST_SIZE * 2)
    asteroids.push(newAsteroid(x, y))
    // (;
  }
}

const newAsteroid = (x, y) => {
  let asteroid = {
    x: x,
    xvelocity:
      ((Math.random() * AST_SPEED) / FPS) * (Math.random() < 0.6 ? 1 : -1),
    y: y,
    yvelocity:
      ((Math.random() * AST_SPEED) / FPS) * (Math.random() < 0.6 ? 1 : -1),
    radius: AST_SIZE / 2,
    direction: Math.random() * Math.PI * 2,
    verticies: Math.floor(
      Math.random() * (AST_VERTICIES + 2) + AST_VERTICIES / 2
    ),
    offset: []
  }

  for (let i = 0; i < asteroid.verticies; i++) {
    asteroid.offset.push(
      Math.random() * AST_DECIMATION * 4 + 1 - AST_DECIMATION
    )
  }
  return asteroid
}

generateAsteroidBelt()

document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)

function keyDown(e) {
  switch (e.keyCode) {
    case 37: // left arrow (rotate ship left)
      ship.rotation = ((TURN_SPEED / 180) * Math.PI) / FPS
      break
    case 38: // up arrow (thrust the ship forward)
      ship.thrusting = true
      // console.log('thrust')
      break
    case 39: // right arrow (rotate ship right)
      ship.rotation = ((-TURN_SPEED / 180) * Math.PI) / FPS
      break

    default:
      return null
  }
}

function keyUp(e) {
  switch (e.keyCode) {
    case 37: // left arrow (stop rotating left)
      ship.rotation = 0
      break
    case 38: // up arrow (stop thrusting)
      ship.thrusting = false
      // console.log('stop')
      break
    case 39: // right arrow (stop rotating right)
      ship.rotation = 0
      break
    default:
      return null
  }
}

let update = () => {
  // Draw BG

  ctx.filStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Thrust
  if (ship.thrusting) {
    ship.thrust.x += (SHIP_THRUST * Math.cos(ship.direction)) / FPS
    ship.thrust.y -= (SHIP_THRUST * Math.sin(ship.direction)) / FPS

    // Draw Thrust

    ctx.filStyle = 'black'
    ctx.strokeStyle = 'blue'
    ctx.lineWidth = SHIP_SIZE / 10
    // ctx.globalAlpha = 0.2
    ctx.beginPath()
    ctx.moveTo(
      // Bottom Left
      ship.Xpos -
        ship.radius * (Math.cos(ship.direction) + Math.sin(ship.direction)),
      ship.Ypos +
        ship.radius * (Math.sin(ship.direction) - Math.cos(ship.direction))
    )

    ctx.lineTo(
      // Bottom Right
      ship.Xpos -
        ship.radius * (Math.cos(ship.direction) - Math.sin(ship.direction)),
      ship.Ypos +
        ship.radius * (Math.sin(ship.direction) + Math.cos(ship.direction))
    )
    ctx.closePath()
    ctx.stroke()
  } else {
    ship.thrust.x -= (SHIP_DRAG * ship.thrust.x) / FPS
    ship.thrust.y -= (SHIP_DRAG * ship.thrust.y) / FPS
  }

  // Draw Triangular Ship
  // ctx.fillStyle= 'green'
  ctx.strokeStyle = 'white'
  ctx.lineWidth = SHIP_SIZE / 20
  ctx.beginPath()
  ctx.moveTo(
    // Nose of the Ship
    ship.Xpos + ship.radius * Math.cos(ship.direction),
    ship.Ypos - ship.radius * Math.sin(ship.direction)
  )
  ctx.lineTo(
    // Bottom Left
    ship.Xpos -
      ship.radius * (Math.cos(ship.direction) + Math.sin(ship.direction)),
    ship.Ypos +
      ship.radius * (Math.sin(ship.direction) - Math.cos(ship.direction))
  )

  ctx.lineTo(
    // Bottom Right
    ship.Xpos -
      ship.radius * (Math.cos(ship.direction) - Math.sin(ship.direction)),
    ship.Ypos +
      ship.radius * (Math.sin(ship.direction) + Math.cos(ship.direction))
  )
  ctx.closePath()
  ctx.stroke()

  // if(BOUNDING_BOX) { }

  // draw Asteroids
  ctx.strokeStyle = 'linen'
  ctx.lineWidth = SHIP_SIZE / 30
  let x, y, radius, direction, verticies, offset
  for (let i = 0; i < asteroids.length; i++) {
    x = asteroids[i].x
    y = asteroids[i].y
    radius = asteroids[i].radius
    direction = asteroids[i].direction
    verticies = asteroids[i].verticies
    offset = asteroids[i].offset

    ctx.beginPath()
    ctx.moveTo(
      x + radius * offset[0] * Math.cos(direction),
      y + radius * offset[0] * Math.sin(direction)
    )

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
      )
    }
    ctx.closePath()
    ctx.stroke()

    // Move Asteroid

    asteroids[i].x += asteroids[i].xvelocity
    asteroids[i].y += asteroids[i].yvelocity

    if (asteroids[i].y < 0 - asteroids[i].radius) {
      asteroids[i].y = canvas.height + asteroids[i].radius
    } else if (asteroids[i].y > canvas.height + asteroids[i].radius) {
      asteroids[i].y = 0 - asteroids[i].radius
    }

    if (asteroids[i].x < 0 - asteroids[i].radius) {
      asteroids[i].x = canvas.width + asteroids[i].radius
    } else if (asteroids[i].x > canvas.width + asteroids[i].radius) {
      // console.log("BOUNDARY")
      asteroids[i].x = 0 - asteroids[i].radius
    }
  }

  // Move Ship
  ship.Xpos += ship.thrust.x
  ship.Ypos += ship.thrust.y

  // Rotate Ship
  ship.direction += ship.rotation

  // Screen Wrap FOR THE SHIP
  if (ship.Xpos <= 0) {
    ship.Xpos = canvas.width - ship.radius
  } else if (ship.Xpos > canvas.width) {
    // console.log("BOUNDARY")
    ship.Xpos = 0 + ship.radius
  }

  if (ship.Ypos <= 0) {
    ship.Ypos = canvas.height - ship.radius
  } else if (ship.Ypos > canvas.height) {
    ship.Ypos = 0 + ship.radius
  }

  //  SCREEN WRAP FOR ASTEROIDS

  // END OF UPDATE FUNC
}
const gameloop = () => {
  setInterval(update, 1000 / FPS)
}

gameloop()
