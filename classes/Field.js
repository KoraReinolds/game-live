class Field {
  _width
  _height
  _cellSize
  _element

  static DEFAULT_RENDER_ELEMENT = 'body'

  constructor(args = {}) {
    const params = {
      elCreator: function () { },
      elContainer: Field.DEFAULT_RENDER_ELEMENT,
      ...args,
    }

    const container = document.querySelector(params.elContainer)
    const element = params.elCreator()
    if (container?.nodeType !== 1) {
      throw new Error("elContainer has no Node type")
    }
    if (element?.nodeType !== 1) {
      throw new Error("elCreator returned element has no Node type")
    }
    this._element = element
    container.appendChild(element)
    this._cellSize = params.cellSize
    this.width = params.width
    this.height = params.height

    this._element.addEventListener('click', this.setCoords.bind(this))
  }

  resize({ width, height, cellSize }) {
    if (width) this.width = width
    if (height) this.height = height
    if (cellSize) this.cellSize = cellSize
  }

  setCellLive(cellIndex) {
    throw new Error('Abstract method must be implemented')
  }

  setCoords(event) {
    const { left, top } = this._element.getBoundingClientRect()
    const { clientX, clientY } = event

    const x = Math.floor((clientX - left) / this._cellSize)
    const y = Math.floor((clientY - top) / this._cellSize)

    this.setCellLive(y * this.width + x)
  }

  set cellSize(value) {
    this._cellSize = value
    this.width = this.width
    this.height = this.height
  }

  get width() {
    return this._width
  }

  set width(value) {
    this._width = value
    this._element.width = value * this._cellSize
    this._element.style.width = `${value * this._cellSize}px`
  }

  get height() {
    return this._height
  }

  set height(value) {
    this._height = value
    this._element.height = value * this._cellSize
    this._element.style.height = `${value * this._cellSize}px`
  }

}

export default Field