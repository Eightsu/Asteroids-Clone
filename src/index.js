import './styles.css'

// Initial
let canvas = document.getElementById('app')
let ctx = canvas.getContext('2d')

const SHIP_SIZE = 30 /* in pixels*/
const FPS = 30
const TURN_SPEED = 360

let ship = {
  Xpos: canvas.width / 2,
  Ypos: canvas.height / 2,
  radius: SHIP_SIZE / 2,
  direction: (90 / 180) * Math.PI /* deg to rad */,
  rotation: 0
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
      break
    case 39: // right arrow (rotate ship right)
      ship.rotation = ((-TURN_SPEED / 180) * Math.PI) / FPS
      break
  }
}

function keyUp(e) {
  switch (e.keyCode) {
    case 37: // left arrow (stop rotating left)
      ship.rotation = 0
      break
    case 38: // up arrow (stop thrusting)
      ship.thrusting = false
      break
    case 39: // right arrow (stop rotating right)
      ship.rotation = 0
      break
  }
}

let update = () => {
  // Draw BG

  ctx.filStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

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

  // Rotate Ship
  ship.direction += ship.rotation

  // center dot
}

const gameloop = () => {}
setInterval(update, 1000 / FPS)

// gameloop();
