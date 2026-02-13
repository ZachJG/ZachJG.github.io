@group(0) @binding(1) var<storage> cellStatusIn: array<u32>;
@group(0) @binding(2) var<storage, read_write> cellStatusOut: array<u32>;

@compute
@workgroup_size(4, 4)
fn computeMain(@builtin(global_invocation_id) cell: vec3u) {
  // First count how many neighbors are alive
  let x = cell.x;
  let y = cell.y;
  let neighborsAlive = cellStatusIn[(y) * 10 + (x + 1)] + cellStatusIn[(y) * 10 + (x - 1)] +
                       cellStatusIn[(y + 1) * 10 + (x)] + cellStatusIn[(y - 1) * 10 + (x)];
  let i = y * 10 + x;
  // Compute new status  
  if ((i + neighborsAlive) % 2 == 1) { // if the cell index + number of alive neighbors is odd
    cellStatusOut[i] = 1; // alive
  }
  else {
    cellStatusOut[i] = 0; // dead
  }
}

struct VertexOutput {
  @builtin(position) pos: vec4f,
  @location(0) cellStatus: f32 // pass the cell status
};

@vertex // this compute the scene coordinate of each input vertex
fn vertexMain(@location(0) pos: vec2f, @builtin(instance_index) idx: u32) -> VertexOutput {
  let u = idx % 10; // we are expecting 10x10, so modulo 10 to get the x index
  let v = idx / 10; // divide by 10 to get the y index
  let uv = vec2f(f32(u), f32(v)) / 10; // normalize the coordinates to [0, 1]
  let halfLength = 1.f; // half cell length
  let cellLength = halfLength * 2.f; // full cell length
  let cell = pos / 10; // divide the input quad into 10x10 pieces
  let offset = - halfLength + uv * cellLength + cellLength / 10 * 0.5; // compute the offset for the instance
  // Apply motor
  let transformed = applyMotorToPoint(cell + offset, reverse(pos.motor));
  // Apply scale
  let scaled = transformed * pos.scale;
  var out: VertexOutput;
  out.pos = vec4f(scaled, 0, 1);
  out.cellStatus = f32(cellStatusIn[idx]);
  return out;
}

@fragment // this compute the color of each pixel
fn fragmentMain(@location(0) cellStatus: f32) -> @location(0) vec4f {
  return vec4f(238.f/255, 118.f/255, 35.f/255, 1) * cellStatus; // (R, G, B, A)
  // cellStatus is either 1 or 0, so it will be either orange or black
}