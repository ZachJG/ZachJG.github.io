@vertex // this compute the scene coordinate of each input vertex
    fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
        return vec4f(pos, 0, 1); // (pos, Z, W) = (X, Y, Z, W)
    }

struct Uniforms {
    color: vec4<f32>,
};
@group(0) @binding(0) var<uniform> u_color: Uniforms;

@fragment
fn fs_main() -> @location(0) vec4<f32> {
    return u_color.color;
}