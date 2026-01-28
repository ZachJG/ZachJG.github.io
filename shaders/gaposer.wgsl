// A 2D GA pose stored in a uniform buffer.
//
// Pose layout in memory (Float32Array):
//   rotor:      2 floats  (cos, -sin)
//   translator: 2 floats  (tx, ty)
//   scale:      2 floats  (sx, sy)
struct Pose {
    rotor: vec2f,
    translator: vec2f,
    scale: vec2f
};

@group(0) @binding(0) var<uniform> pose: Pose;

fn geometricProduct(a: vec4f, b: vec4f) -> vec4f {
    // each input is p is p[0] S + p[1] e0 + p[2] e1 + p[3] e01
    // ref: https://geometricalgebratutorial.com/ga-basics/
    // Note: e0e0 = 1, e1e1 = 1, and e01=-e10, denote the scalar term as S
    // The multiplication table is:
    //   SS   = S   , Se0            = e0   , Se1   = e1  , Se01             = e01
    //   e0S  = e0  , e0e0           = S    , e0e1  = e01 , e0e01  =  1e1    = e1
    //   e1S  = e1  , e1e0           = -e01 , e1e1  = S   , e1e01  = -e1e10  = -e0
    //   e01S = e01 , e01e0 = -e10e0 = -e1  , e01e1 = e0  , e01e01 = -e01e10 = -S
    // So S   terms are: SS, e0e0, e1e1, e01e01
    //    e0  terms are: Se0, e0S, e1e01, e01e1
    //    e1  terms are: Se1, e1S, e0e01, e01e0
    //    e01 terms are: Se01, e01S, e0e1, e1e0
    return vec4f(
        a[0] * b[0] + a[1] * b[1] + a[2] * b[2] - a[3] * b[3], // S
        a[0] * b[1] + a[1] * b[0] - a[2] * b[3] + a[3] * b[2], // e0
        a[0] * b[2] + a[1] * b[3] + a[2] * b[0] - a[3] * b[1], // e1
        a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]  // e2
    );
};

fn reverse(a: vec4f) -> vec4f {
    return vec4f(a[0], a[1], a[2], -a[3]); // [S, e0, e1, -e01]
}

fn applyRotorToPoint(p: vec2f, r: vec2f) -> vec2f{
    // p = x e0 + y e1
    // r = c S - s e01
    // r * p * rv
    let rotated = geometricProduct(vec4f(r[0], 0, 0, r[1]), geometricProduct(vec4f(0, p[0], p[1], 0), reverse(vec4f(r[0], 0, 0, r[1]))));
    // to extract 2d point from the multivector, we take the e0, e1 coeeficients
    return vec2f(rotated[1], rotated[2]);
};

@vertex // this compute the scene coordinate of each input vertex
fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
    // Apply rotor
    let rotated = applyRotorToPoint(pos, pose.rotor);
    // Apply translator
    let transformed = rotated + pose.translator;
    // Apply scale
    let scaled = transformed * pose.scale;
    return vec4f(scaled, 0, 1); // (pos, Z, W) = (X, Y, Z, W)
}

@fragment // this compute the color of each pixel
fn fragmentMain() -> @location(0) vec4f {
    return vec4f(238.f/255, 118.f/255, 35.f/255, 1); // (R, G, B, A)
}

// struct to store 2D GA pose
    struct Pose {
    rotor: vec2f,
    translator: vec2f,
    scale: vec2f,
    r_center: vec2f // added a rotation center
};

@group(0) @binding(0) var<uniform> pose: Pose;

fn geometricProduct(a: vec4f, b: vec4f) -> vec4f {
    // each input is p is p[0] S + p[1] e0 + p[2] e1 + p[3] e01
    // ref: https://geometricalgebratutorial.com/ga-basics/
    // Note: e0e0 = 1, e1e1 = 1, and e01=-e10, denote the scalar term as S
    // The multiplication table is:
    //   SS   = S   , Se0            = e0   , Se1   = e1  , Se01             = e01
    //   e0S  = e0  , e0e0           = S    , e0e1  = e01 , e0e01  =  1e1    = e1
    //   e1S  = e1  , e1e0           = -e01 , e1e1  = S   , e1e01  = -e1e10  = -e0
    //   e01S = e01 , e01e0 = -e10e0 = -e1  , e01e1 = e0  , e01e01 = -e01e10 = -S
    // So S   terms are: SS, e0e0, e1e1, e01e01
    //    e0  terms are: Se0, e0S, e1e01, e01e1
    //    e1  terms are: Se1, e1S, e0e01, e01e0
    //    e01 terms are: Se01, e01S, e0e1, e1e0
    return vec4f(
        a[0] * b[0] + a[1] * b[1] + a[2] * b[2] - a[3] * b[3], // S
        a[0] * b[1] + a[1] * b[0] - a[2] * b[3] + a[3] * b[2], // e0
        a[0] * b[2] + a[1] * b[3] + a[2] * b[0] - a[3] * b[1], // e1
        a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]  // e2
    );
};

fn reverse(a: vec4f) -> vec4f {
    return vec4f(a[0], a[1], a[2], -a[3]); // [S, e0, e1, -e01]
}

fn applyRotorToPoint(p: vec2f, r: vec2f) -> vec2f{
    // p = x e0 + y e1
    // r = c S - s e01
    // r * p * rv
    let rotated = geometricProduct(vec4f(r[0], 0, 0, r[1]), geometricProduct(vec4f(0, p[0], p[1], 0), reverse(vec4f(r[0], 0, 0, r[1]))));
    // to extract 2d point from the multivector, we take the e0, e1 coeeficients
    return vec2f(rotated[1], rotated[2]);
};

@vertex // this compute the scene coordinate of each input vertex
fn vertexMain(@location(0) pos: vec2f) -> @builtin(position) vec4f {
    // Apply rotor
    let rotated = applyRotorToPoint(pos - pose.r_center, pose.rotor) + pose.r_center;
    // Apply translator
    let transformed = rotated + pose.translator;
    // Apply scale
    let scaled = transformed * pose.scale;
    return vec4f(scaled, 0, 1); // (pos, Z, W) = (X, Y, Z, W)
}

@fragment // this compute the color of each pixel
fn fragmentMain() -> @location(0) vec4f {
    return vec4f(238.f/255, 118.f/255, 35.f/255, 1); // (R, G, B, A)
}