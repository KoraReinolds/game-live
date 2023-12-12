class Programs {

  _gl
  _shaders
  _programs = {}

  constructor(shaders) {
    this._shaders = shaders
    this._gl = this._shaders._gl
  }

  get(name) {
    const program = this._programs[name]
    if (program) return program
    else {
      console.warn(`Program '${name}' not found`)
    }
  }

  _create(name, vertexShader, fragmentShader) {
    const program = this._gl.createProgram()
    this._gl.attachShader(program, vertexShader)
    this._gl.attachShader(program, fragmentShader)
    this._gl.linkProgram(program)
    const success = this._gl.getProgramParameter(program, this._gl.LINK_STATUS)
    if (success) {
      this._programs[name] = program
      return program
    }

    console.log(this._gl.getProgramInfoLog(program))
    this._gl.deleteProgram(program)
  }

  initProgram(name, vertexShader, fragmentShader) {
    const program = this._create(name, vertexShader, fragmentShader)
    this._gl.useProgram(program)

    return program
  }

  setUniform(uniformName, programName, updateLocation) {
    const program = this.get(programName)
    if (program) {
      this._gl.useProgram(program)
      const location = this._gl.getUniformLocation(program, uniformName)
      updateLocation(location)
    }
    return this
  }

}

export default Programs