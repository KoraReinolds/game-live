import Field from "./Field"
import Programs from "./Programs"
import Textures from "./Textures"
import Shaders from "./Shaders"
import FrameBuffers from "./FrameBuffers"
import {
  fragmentShaderSourceDisplay,
  vertexShaderSource,
  fragmentShaderSourceData,
} from "../shaders"

class FieldCanvas extends Field {
  _canvas
  _gl
  _textures
  _frameBuffers
  _shaders

  constructor(args) {
    const canvas = document.createElement('canvas')
    super({
      elCreator: function () { return canvas },
      ...args,
    })
    this._canvas = canvas
    this._gl = canvas.getContext("webgl")

    const gl = this._gl
    this.textures = new Textures(gl, this.width * this.height)

    this.textures.create('data')
    this.textures.create('display')

    this.frameBuffers = new FrameBuffers(this.textures)
    this.frameBuffers.create('display')

    this._shaders = new Shaders(gl)
    const vertexShader = this._shaders.createVertex(vertexShaderSource)
    const fragmentShaderDisplay = this._shaders.createFragment('display', fragmentShaderSourceDisplay)
    const fragmentShaderData = this._shaders.createFragment('data', fragmentShaderSourceData)

    this._programs = new Programs(this._shaders)

    const setUniforms = (programName) => {
      return this._programs
        .setUniform('u_data_size', programName, (loc) => {
          gl.uniform2f(loc, this.textures.width, this.textures.height)
        })
        .setUniform('u_grid', programName, (loc) => {
          gl.uniform2f(loc, this.width, this.height)
        })
        .setUniform('u_resolution', programName, (loc) => {
          gl.uniform2f(loc, gl.canvas.width, gl.canvas.height)
        })
    }

    this._programs.initProgram('data', vertexShader, fragmentShaderData)

    setUniforms('data')
      .setUniform('a_position', 'data', (loc) => {
        this._shaders.fillPositionBuffer(loc)
      })

    this._programs.initProgram('display', vertexShader, fragmentShaderDisplay)

    setUniforms('display')

    this._displayData()

  }

  _draw(programName, width, height) {
    this._gl.useProgram(this._programs.get(programName))

    this._gl.viewport(0, 0, width, height)

    this._gl.clearColor(0, 0, 0, 0)
    this._gl.clear(this._gl.COLOR_BUFFER_BIT)

    const primitiveType = this._gl.TRIANGLES
    const offset = 0
    const count = 6
    this._gl.drawArrays(primitiveType, offset, count)
  }

  _displayData() {
    this.frameBuffers.unbind()
    this._gl.bindTexture(this._gl.TEXTURE_2D, this.textures.get('display'))
    this._draw('display', this._gl.canvas.width, this._gl.canvas.height)
  }

  update() {
    const data = this.frameBuffers.readData('display')
    this.textures.setDataToTexture('data', data)

    this._draw('data', this.textures.width, this.textures.height)

    this._displayData()
  }

}

export default FieldCanvas