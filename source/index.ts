import { Data } from "@jeremy-bankes/toolbox";
import { Buffer } from "./graphics/Buffer";
import { FragmentShader } from "./graphics/FragmentShader";
import { Pipeline } from "./graphics/Pipeline";
import { Renderer } from "./graphics/Renderer";
import { VertexShader } from "./graphics/VertexShader";
import { BindGroup } from "./graphics/BindGroup";
import { Math } from "./math/Math";

const [canvas] = document.getElementsByTagName("canvas");
const renderer = new Renderer();

const context = canvas.getContext("webgpu");
Data.assert(context !== null, "Could not get WebGPU context from canvas.");
await renderer.initialize(context);

const response = await fetch("/data/shaders/basic.wgsl");
Data.assert(response.status === 200, `Failed to get WGSL shader source. Error ${response.status}: ${response.statusText}`);
const sourceCode = await response.text();

const vertexShader = new VertexShader(renderer, sourceCode, "vertexMain");
vertexShader.addAttribute("position", "float32x4");
vertexShader.addAttribute("color", "float32x4");

const fragmentShader = new FragmentShader(renderer, sourceCode, "fragmentMain");

const buffer = Buffer.create(renderer, Buffer.USAGE.VERTEX, [
    // x     y     z     w     r     g     b     a
    +0.5, +0.2, +0.0, +1.0, +1.0, +0.0, +0.0, +1.0,
    +0.8, +0.8, +0.0, +1.0, +0.0, +1.0, +0.0, +1.0,
    +0.2, +0.8, +0.0, +1.0, +0.0, +0.0, +1.0, +1.0,
]);

const pipeline = new Pipeline(renderer, vertexShader, fragmentShader);

const projectionMatrix = Math.transpose(Math.Projection.orthographic(0, 1, 1, 0, -1, 1)).flat();
const uniformBuffer = Buffer.create(renderer, Buffer.USAGE.UNIFORM | Buffer.USAGE.COPY_DST, projectionMatrix);

const bindGroup = new BindGroup(pipeline, "Uniforms", 0, uniformBuffer);

const update = () => {
    pipeline.render(buffer, [bindGroup]);
    window.requestAnimationFrame(update);
};

update();