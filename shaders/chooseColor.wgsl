

@vertex // this compute the scene coordinate of each input vertex
    fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
        return vec4f(pos, 0, 1); // (pos, Z, W) = (X, Y, Z, W)
    }

@group(0) @binding(0) var<storage> color: vec4f;

@fragment // this compute the color of each pixel
    fn fragmentMain() -> @location(0) vec4f {
        return vec4f(color[0]/255, color[1]/255, color[2]/255, color[3]); // (R, G, B, A)
    }