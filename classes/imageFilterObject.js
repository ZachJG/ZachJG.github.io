import SceneObject from "./sceneObject.js";

export default class ImageFilterObject extends SceneObject {
    async createGeometry() {}

    updateGeometry() {}

    async createRenderPipeline() {}

    render(pass) {}

    // more methods to implement
    // ...
    async createComputePipeline() {
        // Create a compute pipeline that updates the image.
        this._computePipeline = this._device.createComputePipeline({
            label: "Image Filter Pipeline " + this.getName(),
            layout: "auto",
            compute: {
                module: this._shaderModule,
                entryPoint: "computeMain",
            }
        });
    }
    createBindGroup(inTexture, outTexture) {
        // Create a bind group
        this._bindGroup = this._device.createBindGroup({
            label: "Image Filter Bind Group",
            layout: this._computePipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: inTexture.createView()},
                {binding: 1,
                resource: outTexture.createView()
            }],
        });
    this._wgWidth = Math.ceil(inTexture.width);
    this._wgHeight = Math.ceil(inTexture.height);
    }
    compute(pass) {
        // add to compute pass
        pass.setPipeline(this._computePipeline);                // set the compute pipeline
        pass.setBindGroup(0, this._bindGroup);                  // bind the buffer
        pass.dispatchWorkgroups(this._wgWidth, this._wgHeight); // dispatch
    }
}