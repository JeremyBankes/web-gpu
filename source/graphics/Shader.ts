import { Renderer } from "./Renderer";

export class Shader {

    public readonly renderer: Renderer;
    public readonly entryPoint: string;
    public readonly handle: GPUShaderModule;

    public constructor(renderer: Renderer, sourceCode: string, entryPoint: string) {
        this.renderer = renderer;
        this.entryPoint = entryPoint;
        this.handle = renderer.underlying.device.createShaderModule({ code: sourceCode });
    }

}