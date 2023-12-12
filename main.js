import './style.css'
import FieldCanvas from './classes/FieldCanvas'
import url from './modules/url'
import animate from './modules/animate'

const width = +url.get('width')
const height = +url.get('height')
const cellSize = +url.get('cell_size')

const app = new FieldCanvas({
  height,
  width,
  elContainer: '#app',
  cellSize,
})

const {
  startAnimation,
  stopAnimation,
  isAnimate
} = animate(app.update.bind(app))

document.addEventListener('contextmenu', (event) => {
  event.preventDefault()
  if (isAnimate()) {
    stopAnimation()
  } else {
    startAnimation()
  }
})