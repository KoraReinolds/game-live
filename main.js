import './style.css'
import Field from './classes/Field'
import url from './modules/url'

const width = +url.get('width')
const height = +url.get('height')
const cellSize = +url.get('cell_size')

const app = new Field({
  elCreator: () => document.createElement('div'),
  height,
  width,
  elContainer: '#app',
  cellSize,
})
