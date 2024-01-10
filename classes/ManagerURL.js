class ManagerURL {

  _url

  constructor() {
    this._reloadURL()
  }

  _reloadURL() {
    this._url = new URL(window.location.href)
  }

  get searchParams() {
    return this._url.searchParams
  }

  resize({ width, height, cellSize, isFullSize }) {
    if (width) this.searchParams.set('width', width)
    if (height) this.searchParams.set('height', height)
    if (cellSize) this.searchParams.set('cell_size', cellSize)
    if (isFullSize) this.searchParams.set('full_size', isFullSize)
    window.history.replaceState({}, '', '?' + this.searchParams.toString())
  }

}

export default ManagerURL