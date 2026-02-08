import PGA2D from "./pga2d.js";

export default class Camera {
    constructor() {
        this._pose = new Float32Array([1, 0, 0, 0, 1, 1]);
    }
    updatePose(newpose){
        this._pose = newpose
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

    zoomIn() {
        this._pose[4] *= 1.1;
        this._pose[5] *= 1.1;
    }

    zoomOut() {
        this._pose[4] /= 1.1;
        this._pose[5] /= 1.1;
    }
}