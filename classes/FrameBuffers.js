class FrameBuffers {

  _gl
  _textures
  _framebuffers = {}

  constructor(textures) {
    this._textures = textures
    this._gl = this._textures._gl
  }

  unbind() {
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null)
  }

  create(name) {
    const texture = this._textures.get(name)
    if (!texture) return
    const framebuffer = this._gl.createFramebuffer()
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, framebuffer)
    this._gl.framebufferTexture2D(
      this._gl.FRAMEBUFFER,
      this._gl.COLOR_ATTACHMENT0,
      this._gl.TEXTURE_2D,
      texture, 0
    )

    if (this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER) !== this._gl.FRAMEBUFFER_COMPLETE) {
      console.error("Framebuffer is not complete")
      return null
    }

    this._framebuffers[name] = framebuffer

    return framebuffer
  }

  get(name) {
    const fb = this._framebuffers[name]
    if (fb) return fb
    else {
      console.warn(`FrameBuffer '${name}' not found`)
    }
  }

  readData(name) {
    const frameBuffer = this.get(name)
    if (!frameBuffer) return []
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, frameBuffer)
    const pixels = this._textures.initData()
    this._gl.readPixels(
      0, 0,
      this._textures.width,
      this._textures.height,
      this._gl.RGBA, this._gl.UNSIGNED_BYTE,
      pixels
    )
    return pixels
  }


}

export default FrameBuffers