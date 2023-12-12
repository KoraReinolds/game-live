class Shaders {

  _gl
  _shaders = {}

  constructor(gl) {
    this._gl = gl
  }

  get(name) {
    const shader = this._shaders[name]
    if (shader) return shader
    else {
      console.warn(`Shader '${name}' not found`)
    }
  }

  _create(name, type, source) {
    const shader = this._gl.createShader(type)
    this._gl.shaderSource(shader, source)
    this._gl.compileShader(shader)
    const success = this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)
    if (success) {
      this._shaders[name] = shader
      return shader
    }

    console.log(this._gl.getShaderInfoLog(shader))
    this._gl.deleteShader(shader)
  }

  createVertex(src) {
    return this._create('vertex', this._gl.VERTEX_SHADER, src)
  }

  createFragment(name, src) {
    return this._create(name, this._gl.FRAGMENT_SHADER, src)
  }

  fillPositionBuffer(positionAttributeLocation) {
    const positionBuffer = this._gl.createBuffer()
    this._gl.bindBuffer(this._gl.ARRAY_BUFFER, positionBuffer)
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]
    this._gl.bufferData(
      this._gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this._gl.STATIC_DRAW
    )
    this._gl.enableVertexAttribArray(positionAttributeLocation)
    const size = 2
    const type = this._gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    this._gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset
    )
  }

}

export default Shaders