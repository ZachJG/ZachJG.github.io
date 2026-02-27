import SceneObject from "./sceneObject.js";

export default class ParticleSystemObject extends SceneObject {
  constructor(device, canvasFormat, shaderFile, numParticles = 4096) {
    super(device, canvasFormat, shaderFile);
    this._numParticles = numParticles;
    this._step = 0;
  }
  
  async createGeometry() { 
    await this.createParticleGeometry();
  }
  
  async createParticleGeometry() {
    // Create particles
    this._particles = new Float32Array(this._numParticles * 6); // [x, y, ix, iy, vx, vy]
    // TODO 1 - create ping-pong buffers to store and update the particles in GPU
    // name the ping-pong buffers _particleBuffers
    
    this._particleBuffers = [
      this._device.createBuffer({
        label: "Particle status Buffer 1 " + this.getName(),
        size: this._particles.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      }),
      this._device.createBuffer({
        label: "Particle status Buffer 2 " + this.getName(),
        size: this._particles.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      })
    ];
    
    
    
    // calling the resetParticles function to reset the particle buffers
    this.resetParticles();
  }
    
  resetParticles() {
    for (let i = 0; i < this._numParticles; ++i) {
      var randY = Math.random() % 10;
      var randX = Math.random() % 10;
      // random position between [-1, 1] x [-1, 1]
      this._particles[6 * i + 0] = (Math.random() * 2 - 1); // [-1, 1] 
      this._particles[6 * i + 1] = (Math.random() * 2 - 1);
      // store the initial positions
      this._particles[6 * i + 2] = this._particles[6 * i + 0];
      this._particles[6 * i + 3] = this._particles[6 * i + 1];
      // TODO 6: update the velocity
      var speedY = 0;
      var speedX = 0;
      if (randY % 2 == 0) {
        speedY = 1;
      } else {
        speedY = -1;
      }
      if (randX % 2 == 0) {
        speedX = 1;
      } else {
        speedX = -1;
      }
      this._particles[6 * i + 4] = speedY;
      this._particles[6 * i + 5] = speedX;
    }
    // Copy from CPU to GPU
    this._step = 0;
    this._device.queue.writeBuffer(this._particleBuffers[this._step % 2], 0, this._particles);
  }
  
  updateGeometry() { }
  
  async createShaders() {
    await super.createShaders()
    // TODO 2 - Create the bind group layout for using the ping-pong buffers in the GPU
    // name the bind group layout _bindGroupLayout
    
    this._bindGroupLayout = this._device.createBindGroupLayout({
      label: "Particle Bind Group Layout " + this.getName(),
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
        buffer: { type: "read-only-storage"}
      }, {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: "storage"}
      }]
    });
    
    
    // create the pipeline layout using the bind group layout
    this._pipelineLayout = this._device.createPipelineLayout({
      label: "Particles Pipeline Layout",
      bindGroupLayouts: [ this._bindGroupLayout ],
    });
  }
  
  async createRenderPipeline() { 
    await this.createParticlePipeline();
  }
  
  async createParticlePipeline() {
    this._particlePipeline = this._device.createRenderPipeline({
      label: "Particles Render Pipeline " + this.getName(),
      layout: this._pipelineLayout,
      vertex: {
        module: this._shaderModule, 
        entryPoint: "vertexMain",
      },
      fragment: {
        module: this._shaderModule,
        entryPoint: "fragmentMain",
        targets: [{
          format: this._canvasFormat
        }]
      },
      primitives: {
        typology: 'line-strip'
      }
    }); 
    // Create bind group to bind the particle buffers
    this._bindGroups = [
      this._device.createBindGroup({
        layout: this._particlePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: this._particleBuffers[0] }
          },
          {
            binding: 1,
            resource: { buffer: this._particleBuffers[1] }
          }
        ],
      }),
      this._device.createBindGroup({
        layout: this._particlePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: this._particleBuffers[1] }
          },
          {
            binding: 1,
            resource: { buffer: this._particleBuffers[0] }
          }
        ],
      })
    ];
  }
  
  render(pass) { 
    pass.setPipeline(this._particlePipeline); 
    pass.setBindGroup(0, this._bindGroups[this._step % 2]);
    pass.draw(128, this._numParticles);
  }
  
  async createComputePipeline() { 
    this._computePipeline = this._device.createComputePipeline({
      label: "Particles Compute Pipeline " + this.getName(),
      layout: this._pipelineLayout,
      compute: {
        module: this._shaderModule,
        entryPoint: "computeMain",
      }
    });
  }
  
  compute(pass) { 
    pass.setPipeline(this._computePipeline);
    pass.setBindGroup(0, this._bindGroups[this._step % 2]);
    pass.dispatchWorkgroups(Math.ceil(this._numParticles / 256));
    ++this._step
  }
}