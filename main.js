import './style.css'
import FieldCanvas from './classes/FieldCanvas'
import animate from './modules/animate'
import Settings from './classes/Settings'
import ManagerInput from './classes/ManagerInput'
import ManagerURL from './classes/ManagerURL'

const url = new ManagerURL()

const width = +url.searchParams.get('width')
const height = +url.searchParams.get('height')
const cellSize = +url.searchParams.get('cell_size')

const settings = new Settings({
  width, height, cellSize
})
settings.addListener(url)

const app = new FieldCanvas({
  elContainer: 'main',
  ...settings.getParams(),
})
settings.addListener(app)

const inputs = new ManagerInput(settings)
settings.addListener(inputs)

settings.notify()

const fpsField = document.getElementById('fps_value')
const updateFPS = fpsField
  ? function (value) { fpsField.innerHTML = value }
  : undefined

const {
  startAnimation,
  stopAnimation,
  isAnimate,
} = animate({
  update: app.update.bind(app),
  updateFPS,
})

const clearBtn = document.getElementById('clear_btn')
if (clearBtn) {
  clearBtn.addEventListener('click', app.clearField.bind(app))
}

const randomBtn = document.getElementById('random_btn')
if (randomBtn) {
  randomBtn.addEventListener('click', app.displayRandomData.bind(app))
}

const animationBtn = document.getElementById('animation_btn')
if (animationBtn) {
  animationBtn.addEventListener('click', (event) => {
    event.preventDefault()
    if (isAnimate()) {
      stopAnimation()
      animationBtn.innerHTML = 'Start'
    } else {
      startAnimation()
      animationBtn.innerHTML = 'Stop'
    }
  })
}