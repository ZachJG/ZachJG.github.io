

@group(0) @binding(0) var<storage,read> col: vec4f;

struct VOut {
    @builtin(position) vec4f pos;
    @location(0) vec4f color;
}

@vertex // this compute the scene coordinate of each input vertex
fn vertexMain(@location(0) pos: vec2f, @builtin(vertex_index) v_idx: u32) -> VOut {
    out: Vout;
    out.pos = vec4f(pos, 0, 1); // (pos, Z, W) = (X, Y, Z, W)
    out.color = col[v_idx];
    return out;
}



@fragment // this compute the color of each pixel
fn fragmentMain(color: vec4f) -> @location(0) vec4f {
    return vec4f(color[0]/255, color[1]/255, color[2]/255, color[3]); // (R, G, B, A)
}