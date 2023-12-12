class Settings {

  static MIN_WIDTH = 1
  static MIN_HEIGHT = 1
  static MIN_CELL_SIZE = 1
  static DEFAULT_WIDTH = 20
  static DEFAULT_HEIGHT = 20
  static DEFAULT_CELL_SIZE = 10
  static MAX_SIZE = 1000

  _cellSize
  _width
  _height

  constructor(params = {}) {
    this.listeners = []

    this.width = params.width || Settings.DEFAULT_WIDTH
    this.height = params.height || Settings.DEFAULT_HEIGHT
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
    const maxSide = Math.max(this._width, this._height)
    while (
      cell_size > Settings.MIN_CELL_SIZE
      && (maxSide * cell_size) > Settings.MAX_SIZE
    ) cell_size -= 1
    this._cellSize = Math.max(Settings.MIN_CELL_SIZE, cell_size)
  }

  getParams() {
    return {
      cellSize: this._cellSize,
      width: this._width,
      height: this._height,
    }
  }

  addListener(listener) {
    this.listeners.push(listener)
  }

  notify(newData) {
    if (newData) {
      const { width, height, cellSize } = newData
      if (width) this.width = width
      if (height) this.height = height
      if (cellSize) this.cellSize = cellSize
    }
    const data = this.getParams()
    this.listeners.forEach(listener => listener.resize(data))
  }
}

export default Settings