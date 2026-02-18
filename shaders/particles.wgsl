// TODO 3: Define a struct to store a particle
struct Particle {
  position: vec3f,
  velocity: vec3f,
}

// TODO 4: Write the bind group spells here using array<Particle>
// name the binded variables particlesIn and particlesOut

@group(0) @binding(0) var<storage> particlesIn: array<Particle>;
@group(0) @binding(1) var<storage, read_write> particlesOut: array<Particle>;

@vertex
fn vertexMain(@builtin(instance_index) idx: u32, @builtin(vertex_index) vIdx: u32) -> @builtin(position) vec4f {
  // TODO 5: Revise the vertex shader to draw circle to visualize the particles
  let particle = particlesIn[idx].p;
  let size = 0.0125;
  let pi = 3.14159265;
  let theta = 2. * pi / 8. * f32(vIdx);
  let x = cos(theta) * size;
  let y = sin(theta) * size;
  return vec4f(vec2f(x + particle.x, y + particle.y), 0, 1);
}

@fragment
fn fragmentMain() -> @location(0) vec4f {
  return vec4f(238.f/255, 118.f/255, 35.f/255, 1); // (R, G, B, A)
}

@compute @workgroup_size(256)
fn computeMain(@builtin(global_invocation_id) global_id: vec3u) {
  let idx = global_id.x;
  
  if (idx < arrayLength(&particlesIn)) {
    particlesOut[idx] = particlesIn[idx];
    // TODO 6: Revise the compute shader to update the particles using the velocity
    
    
    
    // TOOD 7: Add boundary checking and respawn the particle when it is offscreen
  }
}