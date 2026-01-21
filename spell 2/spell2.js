async function init() {
  // Create a canvas tag, where we render on the browser
  const canvasTag = document.createElement('canvas');
  canvasTag.id = "renderCanvas"; // Important! This tells which CSS style to use
  document.body.appendChild(canvasTag);
  // Check if the browser supports WebGPU
  if (!navigator.gpu) {
    throw Error("WebGPU is not supported in this browser.");
  }
  // Get an GPU adapter - use the API to get a GPU adapter
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.");
  }
  // Get a GPU device - use the adapter to request a GPU
  const device = await adapter.requestDevice();
  // Get canvas context using webgpu
  const context = canvasTag.getContext("webgpu");
  const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device: device,
    format: canvasFormat,
  });
  // Create a gpu command encoder
  // The encoder allows us to craft different rendering spells
  const encoder = device.createCommandEncoder();
  // Use the encoder to begin render pass
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 0, g: 56/255, b: 101/255, a: 1 }, // Blue
      loadOp: "clear",
      storeOp: "store",
    }]
  });
   // Vertex shader code
  var vertCode = `
  @vertex // this compute the scene coordinate of each input vertex
  fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
    return vec4f(pos, 0, 1); // (pos, Z, W) = (X, Y, Z, W)
  }`;
  // Fragment shader code
  var fragCode = `
  @fragment // this compute the color of each pixel
  fn fragmentMain() -> @location(0) vec4f {
    return vec4f(238.f/255, 118.f/255, 35.f/255, 1); // (R, G, B, A)
  }`;
  var shaderModule = device.createShaderModule({
    label: "Shader",
    code: vertCode + '\n' + fragCode,
  });
  // Use the module to create a render pipeline
  var renderPipeline = device.createRenderPipeline({
    label: "Render Pipeline",
    layout: "auto", // we will talk about layout later
    vertex: {
      module: shaderModule,         // the shader module
      entryPoint: "vertexMain",     // where the vertex shader starts
      buffers: [vertexBufferLayout] // the buffer layout - more about it soon
    },
    fragment: {
      module: shaderModule,         // the shader module
      entryPoint: "fragmentMain",   // where the fragment shader starts
      targets: [{
        format: canvasFormat        // the target canvas format (the output)
      }]
    }
  }); 
  pass.end(); // end the pass
  // Create the command buffer using the encoder
  const commandBuffer = encoder.finish();
  // Submit it to the device to render
  device.queue.submit([commandBuffer]);
  return context;
}

init().then( ret => {
  console.log(ret);
}).catch( error => {
  // Error Handling - add a p tag to display the error message
  const pTag = document.createElement('p');
  pTag.innerHTML = navigator.userAgent + "</br>" + error.message;
  document.body.appendChild(pTag);
  // also remove the created canvas tag
  document.getElementById("renderCanvas").remove();
});

