

struct VOut {
    @builtin(position) pos: vec4f,
    @location(0) color: vec4f,
}

//@group(0) @binding(0) var<storage,read> col: vec4f;
@group(0) @binding(0) var<uniform> col: vec4f;

@vertex // this compute the scene coordinate of each input vertex
fn vertexMain(@location(0) pos: vec2f, @builtin(vertex_index) idx : u32) -> VOut {
    var out : VOut;
    out.pos = vec4f(pos, 0, 1); // (pos, Z, W) = (X, Y, Z, W)
    out.color[idx] = col[idx];
    return out;
}

fn makeColor(co : f32) -> f32 {
    return co/255;
}

@fragment // this compute the color of each pixel
fn fragmentMain(v: VOut) -> @location(0) vec4f {
    //let r = makeColor(v.color[0]);
    //let g = makeColor(v.color[1]);
    //let b = makeColor(v.color[2]);
    //let a = v.color[3];
    //return vec4f(r,g,b,a); (R, G, B, A)
    return col;
}