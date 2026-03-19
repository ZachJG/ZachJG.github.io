

@group(0) @binding(0) var<storage,read> col: vec4f;

struct VOut {
    @builtin(position) pos: vec4f,
    @location(0) color: vec4f,
    c: vec4f
}

@vertex // this compute the scene coordinate of each input vertex
fn vertexMain(@location(0) pos: vec2f, @builtin(vertex_index) idx : u32) -> VOut {
    var out : VOut;
    out.pos = vec4f(pos, 0, 1); // (pos, Z, W) = (X, Y, Z, W)
    out.c[idx] = col[idx];
    return out;
}

fn makeColor(co : f32) -> f32 {
    return co/255;
}

@fragment // this compute the color of each pixel
fn fragmentMain(v: VOut) -> @location(0) vec4f {
    let r = makeColor(v.c[0]);
    let g = makeColor(v.c[1]);
    let b = makeColor(v.c[2]);
    let a = v.c[3]
    return vec4f(r,g,b,a); // (R, G, B, A)
}