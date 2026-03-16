

@group(0) @binding(0) var<storage,read> col: vec4f;

struct VOut {
    @builtin(position) pos: vec4f,
    @location(0) color: vec4f
}

@vertex // this compute the scene coordinate of each input vertex
fn vertexMain(@location(0) pos: vec2f, @builtin(vertex_index) v_idx: u32) -> VOut {
    var out : VOut;
    out.pos = vec4f(pos, 0, 1); // (pos, Z, W) = (X, Y, Z, W)
    out.color[v_idx] = col[v_idx];
    return out;
}



@fragment // this compute the color of each pixel
fn fragmentMain(v: VOut) -> @location(0) vec4f {
    return vec4f(v.color[0]/255, v.color[1]/255, v.color[2]/255, v.color[3]); // (R, G, B, A)
}