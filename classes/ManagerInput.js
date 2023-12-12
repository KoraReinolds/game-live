class ManagerInput {

  _observer

  constructor(observer) {
    this.widthInput = document.getElementById('width_input')
    this.heightInput = document.getElementById('height_input')
    this.cellSizeInput = document.getElementById('cell_size_input')
    this._observer = observer
    this.setupListeners()
  }

  setupListeners() {
    this.widthInput.addEventListener('input', () => this.handleInputChange())
    this.heightInput.addEventListener('input', () => this.handleInputChange())
    this.cellSizeInput.addEventListener('input', () => this.handleInputChange())
  }

  resize({ width, height, cellSize }) {
    this.widthInput.value = width
    this.heightInput.value = height
    this.cellSizeInput.value = cellSize
  }

  handleInputChange() {
    const width = this.widthInput.value
    const height = this.heightInput.value
    const cellSize = this.cellSizeInput.value
    this._observer.notify({ width, height, cellSize })
  }

}

export default ManagerInput