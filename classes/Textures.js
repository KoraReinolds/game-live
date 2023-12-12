class Textures {
  _gl
  _width
  _height
  _textures = {}

  constructor(gl, dataSize) {
    this._gl = gl

    let textureSize = Math.trunc(dataSize / 4)
    if (dataSize % 4) textureSize += 1

    let width = Math.min(textureSize, this._gl.canvas.clientWidth) || 0
    while (width > 0) {
      if (textureSize % width === 0) {
        this._width = width
        this._height = textureSize / width
        console.log(this._width, this._height)
        break
      }
      width -= 1
    }
    if (!width) {
      throw new Error("Can't calculate texture size")
    }
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  initData() {
    return new Uint8Array(
      new Array(4 * this.width * this.height)
        .fill(0)
        .map(() => (Math.random() > 0.5) ? 255 : 0)
    )
  }

  setDataToTexture(name, data) {
    const texture = this.get(name)
    if (texture) {
      this._gl.bindTexture(this._gl.TEXTURE_2D, texture)
      this._gl.texImage2D(
        this._gl.TEXTURE_2D, 0, this._gl.RGBA,
        this.width, this.height,
        0, this._gl.RGBA, this._gl.UNSIGNED_BYTE,
        data
      )
    }
  }

  create(name) {
    const texture = this._gl.createTexture()
    this._textures[name] = texture
    this.setDataToTexture(name, this.initData())
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE)
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE)
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST)
    this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST)
    return texture
  }

  get(name) {
    const texture = this._textures[name]
    if (texture) return texture
    else {
      console.warn(`Texture '${name}' not found`)
    }
  }

}

export default Textures