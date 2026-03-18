

@group(0) @binding(0) var<storage,read> col: vec4f;

struct VOut {
    @builtin(position) pos: vec4f,
    @location(0) color: vec4f
}

@vertex // this compute the scene coordinate of each input vertex
fn vertexMain(@location(0) pos: vec2f) -> VOut {
    var out : VOut;
    out.pos = vec4f(pos, 0, 1); // (pos, Z, W) = (X, Y, Z, W)
    out.color = col;
    return out;
}

fn makeColor(c : f32) -> f32 {
    return c/255;
}

@fragment // this compute the color of each pixel
fn fragmentMain(v: VOut) -> @location(0) vec4f {
    let r = vec4f(makeColor(v.color[0]),makeColor(v.color[1]),makeColor(v.color[2]),v.color[3]);
    let g = vec4f(makeColor(v.color[0]),makeColor(v.color[1]),makeColor(v.color[2]),v.color[3])
    let b = vec4f(makeColor(v.color[0]),makeColor(v.color[1]),makeColor(v.color[2]),v.color[3])
    return vec4f(r,g,b,v.color[3]); // (R, G, B, A)
}