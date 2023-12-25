
const getCoords = `
vec2 getCoords(vec2 uv, vec2 size) {
  return floor(uv * size);
}
`

const getCoordsFromIndex = `
vec2 getCoordsFromIndex(float i, float width) {
  return vec2(
    mod(i, width),
    floor(i / width)
  );
}
`

const getIndexFromCoords = `
float getIndexFromCoords(vec2 coords, vec2 size) {
  return coords.y * size.x + coords.x;
}
`

const getIndex = `
float getIndex(vec2 uv, vec2 size) {
  vec2 coords = getCoords(uv, size);
  return getIndexFromCoords(coords, size);      
}
`
const getValueFromChannel = `
float getValueFromChannel(float channel, float index) {
  return floor(mod((channel * 255.) / pow(2.0, index), 2.0));
}
`

const getValueOfColorIndex = `
float getValueOfColorIndex(vec4 color, float index) {
  float i = floor(index / 8.0);
  float v = color.r;

  if (i == 1.0) {
    v = color.g;
  } else if (i == 2.0) {
    v = color.b;
  } else if (i == 3.0) {
    v = color.a;
  }

  return getValueFromChannel(v, mod(index, 8.0));
}
`
const getColorFromTexture = `
vec4 getColorFromTexture(sampler2D texture, vec2 texture_size, float index) {
  float data_in_row = texture_size.x * 32.0;
  vec2 half_step = (1.0 / texture_size) / 2.0;
  vec2 data_coords = getCoordsFromIndex(index, data_in_row);
  vec2 coords_color = vec2(
    floor(data_coords.x / 32.0),
    data_coords.y
  ) / texture_size;
  vec4 color = texture2D(texture, coords_color + half_step);

  return color;
}
`

const getValueFromTexture = `
float getValueFromTexture(sampler2D texture, vec2 texture_size, float index) {
  vec4 color = getColorFromTexture(texture, texture_size, index);

  return getValueOfColorIndex(color, mod(index, 32.0));
}
`

const fragmentShaderSourceDisplay = `
precision mediump float;

#define RGB_DARK vec3(.1)
#define RGB_GRAY_2 vec3(.14)
#define RGB_GREEN vec3(.0,.4,.0)
#define PIXEL_SIZE 2.
uniform vec2 u_resolution;
uniform vec2 u_grid;
uniform vec2 u_data_size;
varying vec2 v_position;
varying vec2 v_resolution;
uniform sampler2D u_data;

float fill(float v, float th) {
  return step(v, th);
}

float stroke(float v, float c, float w) {
  return fill(v, c+w/2.) - fill(v, c-w/2.);
}

float grid(vec2 uv, vec2 scale, vec2 thickness) {
  vec2 grid_uv = uv;
  grid_uv = fract(grid_uv * scale);
  vec2 ps = thickness * scale;
  float grid_x = stroke(grid_uv.x, .0, ps.x);
  float grid_y = stroke(grid_uv.y, .0, ps.y);
  
  return max(grid_x, grid_y);
}

${getValueFromChannel}
${getCoords}
${getCoordsFromIndex}
${getIndexFromCoords}
${getIndex}
${getValueOfColorIndex}
${getColorFromTexture}
${getValueFromTexture}

void main() {
  vec3 scene=RGB_DARK;
  vec2 uv=v_position;

  vec2 pixel_size = PIXEL_SIZE / v_resolution;
  
  scene=mix(
    scene,
    RGB_GRAY_2,
    grid(uv, u_grid, pixel_size)
  );
  
  vec3 c = texture2D(u_data, uv).rgb;
  vec3 co = texture2D(u_data, vec2(0.0)).rgb;

  scene=mix(
    scene,
    RGB_GREEN,
    getValueFromTexture(
      u_data,
      u_data_size,
      getIndex(uv, u_grid)
    )
  );

  gl_FragColor = vec4(scene, 1.0);
}
`
const vertexShaderSource = `
attribute vec2 a_position;
uniform vec2 u_resolution;
varying vec2 v_position;
varying vec2 v_resolution;

void main() {
  v_position = a_position;      
  v_position+=1.;
  v_position/=2.;
  v_position.y=1.-v_position.y;

  v_resolution = u_resolution;
  gl_Position = vec4(a_position, 0, 1);
}
`
const fragmentShaderSourceData = `
precision mediump float;
uniform sampler2D u_data;
varying vec2 v_position;
uniform vec2 u_grid;
uniform vec2 u_data_size;

${getValueFromChannel}
${getCoords}
${getCoordsFromIndex}
${getIndexFromCoords}
${getIndex}
${getValueOfColorIndex}
${getColorFromTexture}
${getValueFromTexture}

vec2 getLeft(vec2 cur, vec2 size) {
  if (cur.x == 0.0) {
    return vec2(size.x-1.0, cur.y);
  } else {
    return vec2(cur.x-1.0, cur.y);
  }
}    

vec2 getTop(vec2 cur, vec2 size) {
  if (cur.y == 0.0) {
    return vec2(cur.x, size.y-1.0);
  } else {
    return vec2(cur.x, cur.y-1.0);
  }
}    

vec2 getRight(vec2 cur, vec2 size) {
  if (cur.x == size.x-1.0) {
    return vec2(0.0, cur.y);
  } else {
    return vec2(cur.x+1.0, cur.y);
  }
}

vec2 getBottom(vec2 cur, vec2 size) {
  if (cur.y == size.y-1.0) {
    return vec2(cur.x, 0.0);
  } else {
    return vec2(cur.x, cur.y+1.0);
  }
}

float cellIsLive(vec2 coords, vec2 grid, vec2 data_size, sampler2D u_data) {
  return getValueFromTexture(
    u_data,
    data_size,
    getIndexFromCoords(coords, grid)
  );
}

float getNewState(float isLive, float index, vec2 grid, vec2 data_size, sampler2D u_data) {
  vec2 grid_coords = getCoordsFromIndex(index, grid.x);
  
  vec2 left = getLeft(grid_coords, grid);
  vec2 right = getRight(grid_coords, grid);
  vec2 top = getTop(grid_coords, grid);
  vec2 bottom = getBottom(grid_coords, grid);
  vec2 top_left = getLeft(top, grid);
  vec2 top_right = getRight(top, grid);
  vec2 bottom_left = getLeft(bottom, grid);
  vec2 bottom_right = getRight(bottom, grid);

  float live_counter = 0.0;
  live_counter += cellIsLive(left, grid, data_size, u_data);
  live_counter += cellIsLive(right, grid, data_size, u_data);
  live_counter += cellIsLive(top, grid, data_size, u_data);
  live_counter += cellIsLive(bottom, grid, data_size, u_data);
  live_counter += cellIsLive(top_left, grid, data_size, u_data);
  live_counter += cellIsLive(top_right, grid, data_size, u_data);
  live_counter += cellIsLive(bottom_left, grid, data_size, u_data);
  live_counter += cellIsLive(bottom_right, grid, data_size, u_data);
  
  if ((isLive != 0.0 && live_counter == 2.0) || live_counter == 3.0) {
    return 1.0;
  }

  return 0.0;
}

float getNewChannel(float channel, float index, vec2 grid, vec2 data_size, sampler2D u_data) {
  float channel_value = 0.0;

  const float iterations = 8.0;

  for (float i = 0.0; i < iterations; ++i) {
    float isLive = getValueFromChannel(channel, mod(index + i, 8.0));
    if (getNewState(isLive, index + i, grid, data_size, u_data) == 1.0) {
      channel_value += pow(2.0, i);
    }
  }

  return channel_value / 255.;
}

vec4 getNewColorState(vec4 color, float index, vec2 grid, vec2 data_size, sampler2D u_data) {
  float i = index*32.0;

  color.r = getNewChannel(color.r, i + 0.0, grid, data_size, u_data);
  color.g = getNewChannel(color.g, i + 8.0, grid, data_size, u_data);
  color.b = getNewChannel(color.b, i + 16.0, grid, data_size, u_data);
  color.a = getNewChannel(color.a, i + 24.0, grid, data_size, u_data);
 
  return color;
}


void main() {
  vec2 uv = v_position;

  // set 0.0 to the bottom-left for reading from the texture
  uv = vec2(v_position.x, 1.0 - v_position.y);
  
  vec4 color = texture2D(u_data, uv);
  
  gl_FragColor = getNewColorState(
    color,
    getIndex(uv, u_data_size),
    u_grid,
    u_data_size,
    u_data
  );
}
`

export {
  fragmentShaderSourceDisplay,
  vertexShaderSource,
  fragmentShaderSourceData,
}