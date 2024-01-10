class Settings {

  static MIN_WIDTH = 1
  static MIN_HEIGHT = 1
  static MIN_CELL_SIZE = 1
  static DEFAULT_WIDTH = 20
  static DEFAULT_HEIGHT = 20
  static DEFAULT_CELL_SIZE = 10
  static DEFAULT_FULL_SIZE = 'true'

  _cellSize
  _width
  _height
  _fullSize

  constructor(params = {}) {
    this.listeners = []

    this.width = params.width || Settings.DEFAULT_WIDTH
    this.height = params.height || Settings.DEFAULT_HEIGHT
    this.fullSize = params.fullSize || Settings.DEFAULT_FULL_SIZE
    this.cellSize = params.cellSize || Settings.DEFAULT_CELL_SIZE
  }

  set width(value) {
    this._width = Math.max(Settings.MIN_WIDTH, value)
  }

  set height(value) {
    this._height = Math.max(Settings.MIN_HEIGHT, value)
  }

  set cellSize(value) {
    let cell_size = +value
    const main = document.querySelector('main')

    if (this._fullSize !== 'true') {
      while (
        cell_size > Settings.MIN_CELL_SIZE
        && ((this._height * cell_size) > main.clientHeight
        || (this._width * cell_size) > main.clientWidth)
      ) cell_size -= 1
    }

    this._cellSize = Math.max(Settings.MIN_CELL_SIZE, cell_size)

    if (this._fullSize === 'true') {
      this.width = Math.floor(main.clientWidth / this._cellSize)
      this.height = Math.floor(main.clientHeight / this._cellSize)
    }
  }

  set fullSize(value) {
    if (value === 'true') {
      this.width = Math.floor(window.innerWidth / this._cellSize)
      this.height = Math.floor(window.innerHeight / this._cellSize)
      this._fullSize = value
    } else {
      this._fullSize = 'false'
    }
  }

  getParams() {
    return {
      cellSize: this._cellSize,
      width: this._width,
      height: this._height,
      isFullSize: this._fullSize,
    }
  }

  addListener(listener) {
    this.listeners.push(listener)
  }

  notify(newData) {
    if (newData) {
      const { width, height, cellSize, isFullSize = this._fullSize } = newData
      if (width) this.width = width
      if (height) this.height = height
      if (cellSize) this.cellSize = cellSize
      if (isFullSize) this.fullSize = isFullSize
    }
    const data = this.getParams()
    this.listeners.forEach(listener => listener.resize(data))
  }
}

export default Settings