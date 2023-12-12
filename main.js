import './style.css'
import FieldCanvas from './classes/FieldCanvas'
import animate from './modules/animate'
import Settings from './classes/Settings'
import ManagerInput from './classes/ManagerInput'
import ManagerURL from './classes/ManagerURL'

const settings = new Settings()

const url = new ManagerURL()
settings.addListener(url)

const width = +url.searchParams.get('width')
const height = +url.searchParams.get('height')
const cellSize = +url.searchParams.get('cell_size')

const app = new FieldCanvas({
  height,
  width,
  elContainer: 'main',
  cellSize,
})
settings.addListener(app)

const inputs = new ManagerInput(settings)
settings.addListener(inputs)

settings.notify({ width, height, cellSize })

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