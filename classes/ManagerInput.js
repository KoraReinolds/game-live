class ManagerInput {

  _observer

  constructor(observer) {
    this.widthInput = document.getElementById('width_input')
    this.heightInput = document.getElementById('height_input')
    this.cellSizeInput = document.getElementById('cell_size_input')
    this.fullSizeCheckbox = document.getElementById('is_full_size')
    this._observer = observer
    this.setupListeners()
  }

  setupListeners() {
    this.widthInput?.addEventListener('input', () => this.handleInputChange())
    this.heightInput?.addEventListener('input', () => this.handleInputChange())
    this.cellSizeInput?.addEventListener('input', () => this.handleInputChange())
    this.fullSizeCheckbox?.addEventListener('input', () => this.handleInputChange())
  }

  resize({ width, height, cellSize, isFullSize }) {
    this.widthInput.value = width
    this.heightInput.value = height
    this.cellSizeInput.value = cellSize
    const fullSize = isFullSize === 'true'
    this.fullSizeCheckbox.checked = fullSize
    this.widthInput.disabled = fullSize
    this.heightInput.disabled = fullSize
  }

  handleInputChange() {
    const isFullSize = `${this.fullSizeCheckbox.checked}`
    const width = this.widthInput.value
    const height = this.heightInput.value
    const cellSize = this.cellSizeInput.value
    this._observer.notify({ width, height, cellSize, isFullSize })
  }

}

export default ManagerInput