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
    this._textures = new Textures(gl, this.width * this.height)

    this._textures.create('data')
    this._textures.create('display')

    this.frameBuffers = new FrameBuffers(this._textures)
    this.frameBuffers.create('display')

    this._shaders = new Shaders(gl)
    const vertexShader = this._shaders.createVertex(vertexShaderSource)
    const fragmentShaderDisplay = this._shaders.createFragment('display', fragmentShaderSourceDisplay)
    const fragmentShaderData = this._shaders.createFragment('data', fragmentShaderSourceData)

    this._programs = new Programs(this._shaders)

    const setUniforms = (programName) => {
      return this._programs
        .setUniform('u_data_size', programName, (loc) => {
          gl.uniform2f(loc, this._textures.width, this._textures.height)
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
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._textures.get('display'))
    this._draw('display', this._gl.canvas.width, this._gl.canvas.height)
  }

  displayRandomData() {
    this._textures.setDataToTexture(
      'display',
      this._textures.randomData()
    )
    this._displayData()
  }

  resize(data) {
    super.resize(data)
    this._textures.resetTextureSize(this.width * this.height)
    this._programs.updateLocation('data', 'u_data_size')
    this._programs.updateLocation('data', 'u_grid')
    this._programs.updateLocation('data', 'u_resolution')
    this._programs.updateLocation('display', 'u_data_size')
    this._programs.updateLocation('display', 'u_grid')
    this._programs.updateLocation('display', 'u_resolution')
    this._textures.setDataToTexture(
      'display',
      this._textures.initData()
    )
    this._displayData()
  }

  update() {
    this._textures.setDataToTexture(
      'data',
      this.frameBuffers.readData('display')
    )

    this._draw('data', this._textures.width, this._textures.height)

    this._displayData()
  }

  setCellLive(index) {
    const data = this.frameBuffers.readData('display')
    data[index] = 1
    this._textures.setDataToTexture('display', data)

    this._displayData()
  }

}

export default FieldCanvas