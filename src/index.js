import './styles.css'

// Initial
let canvas = document.getElementById('app')
let ctx = canvas.getContext('2d')

const SHIP_SIZE = 30 /* in pixels*/
const FPS = 30
const TURN_SPEED = 360
const SHIP_THRUST = 8
const DRAG = 0.7

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
  } else {
    ship.thrust.x -= (DRAG * ship.thrust.x) / FPS
    ship.thrust.y -= (DRAG * ship.thrust.y) / FPS
  }

  // Draw Triangular Ship
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
  // Move Ship
  ship.Xpos += ship.thrust.x
  ship.Ypos += ship.thrust.y

  // Rotate Ship
  ship.direction += ship.rotation

  // center dot

  // Screen Wrap
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

}
const gameloop = () => {
  setInterval(update, 1000 / FPS)
  console.log(ship.Ypos)
  console.log(canvas.width)
}

gameloop()
