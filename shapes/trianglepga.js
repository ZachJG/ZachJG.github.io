import Standard2DGAPosedVertexObject from "../classes/standard2dPose.js";
import PGA2D from "../classes/pga2d.js";

export default class TrianglePGA extends Standard2DGAPosedVertexObject {
    constructor(device, canvasFormat, vertices, pose,color) {
        super(device, canvasFormat, vertices,pose,'../shaders/chooseColorPGA.wgsl', 'triangle-list');
        this._shape = vertices;
        this._pose = pose;
        this._color = new Float32Array([
            color[0]/255,color[1]/255,color[2]/255,color[3]
        ]);
    }
    updatePose(newpose){
        for (let i = 0; i < 4; ++i) {
            this._pose[i] = newpose[i];
        }
    }
    moveLeft(d) {
        let dt = PGA2D.createTranslator(-d, 0);
        let newpose = PGA2D.normalizeMotor(PGA2D.geometricProduct(dt, [this._pose[0], this._pose[1], this._pose[2], this._pose[3]]));
        this.updatePose(newpose);
    }
    moveRight(d) {
        let dt = PGA2D.createTranslator(d, 0);
        let newpose = PGA2D.normalizeMotor(PGA2D.geometricProduct(dt, [this._pose[0], this._pose[1], this._pose[2], this._pose[3]]));
        this.updatePose(newpose);
    }
    moveUp(d) {
        let dt = PGA2D.createTranslator(0, d);
        let newpose = PGA2D.normalizeMotor(PGA2D.geometricProduct(dt, [this._pose[0], this._pose[1], this._pose[2], this._pose[3]]));
        this.updatePose(newpose);
    }
    moveDown(d) {
        let dt = PGA2D.createTranslator(0, -d);
        let newpose = PGA2D.normalizeMotor(PGA2D.geometricProduct(dt, [this._pose[0], this._pose[1], this._pose[2], this._pose[3]]));
        this.updatePose(newpose);
    }
    // More methods to implement
    async createGeometry() {
        // Call parent's to create vertex geometry
        super.createGeometry();
        // Create pose buffer to store the object pose in GPU
        this._poseBuffer = this._device.createBuffer({
            label: "Pose " + this.getName(),
            size: this._pose.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        this._colorBuffer = this._device.createBuffer({
            label: "Colors " + this.getName(),
            size: this._color.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        this._device.queue.writeBuffer(this._colorBuffer, 0, this._color);
        // Initial update of the geomtery - in this case only the pose
        this.updateGeometry();
    }
    updateGeometry() {
        // Copy from pose from CPU to GPU
        this._device.queue.writeBuffer(this._poseBuffer, 0, this._pose);
    }
    async createRenderPipeline() {
        // Call parent's to create render pipeline
        super.createRenderPipeline();
        // Creata a bind group to pass the pose buffer into @group(0) @binding(0)
        this._bindGroup = this._device.createBindGroup({
            label: "Triangle Bind Group " + this.getName(),
            layout: this._renderPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this._poseBuffer },
                },
                {
                    binding: 1,
                    resource: { buffer: this._colorBuffer },
                }
            ],
        });
    }
    render(pass) {
        pass.setBindGroup(0, this._bindGroup);  // bind the pose buffer
        super.render(pass);                     // reuse the render function
    }
}