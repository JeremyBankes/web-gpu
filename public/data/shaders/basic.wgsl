struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f
}

struct Uniforms {
    projectionMatrix: mat4x4<f32>
}

@binding(0) @group(0) var<uniform> uniforms : Uniforms;

@vertex
fn vertexMain(@location(0) position: vec4f, @location(1) color: vec4f) -> VertexOutput {
    var output: VertexOutput;
    output.position = uniforms.projectionMatrix * position;
    output.color = color;
    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    return input.color;
}