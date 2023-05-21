import { Data } from "@jeremy-bankes/toolbox";
import { Renderer } from "./Renderer";
import { Shader } from "./Shader";

export type VertexFormat = GPUVertexFormat;

export class VertexShader extends Shader {

    public static readonly FORMAT_REGEX = /(u|s)?(int|norm|float)([0-9]+)(?:x([0-9]+))?/;

    private _attributes: { [AttributeName: string]: GPUVertexAttribute };
    private _stride: number;

    public constructor(renderer: Renderer, sourceCode: string, entryPoint: string) {
        super(renderer, sourceCode, entryPoint);
        this._attributes = {};
        this._stride = 0;
    }

    public addAttribute(name: string, format: VertexFormat) {
        const location = Object.keys(this._attributes).length;
        const match = format.match(VertexShader.FORMAT_REGEX);
        Data.assert(match !== null, `Failed to parse vertex format "${format}".`);
        const size = parseInt(match[3]) / 8;
        const count = parseInt(match[4]);
        this._attributes[name] = {
            shaderLocation: location,
            format: format,
            offset: this._stride
        };
        this._stride += size * count;
        return location;
    }

    public get stride() { return this._stride; }
    public get attributes() { return Object.values(this._attributes); }

    public createVertexState(): GPUVertexState {
        return {
            module: this.handle,
            entryPoint: this.entryPoint,
            buffers: [
                {
                    attributes: this.attributes,
                    arrayStride: this.stride,
                    stepMode: "vertex",
                },
            ]
        };
    }

}