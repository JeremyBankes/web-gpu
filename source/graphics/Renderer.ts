import { Data } from "@jeremy-bankes/toolbox";
import { Buffer } from "./Buffer";
import { Shader } from "./Shader";
import { VertexShader } from "./VertexShader";
import { Color } from "../utilities/Color";
import { FragmentShader } from "./FragmentShader";
import { Pipeline } from "./Pipeline";

export interface RendererOptions {
    clearColor: Color
}

export class Renderer {

    public static readonly DEFAULT_OPTIONS: RendererOptions = { clearColor: Color.BLACK };

    private _context?: GPUCanvasContext;
    private _adapter?: GPUAdapter;
    private _device?: GPUDevice;
    private _preferredCanvasFormat: GPUTextureFormat;

    public clearColor: Color;

    public constructor(options: RendererOptions = Renderer.DEFAULT_OPTIONS) {
        this._preferredCanvasFormat = navigator.gpu.getPreferredCanvasFormat();
        this.clearColor = options.clearColor;
    }

    public async initialize(context: GPUCanvasContext) {
        Data.assert(navigator.gpu !== undefined, "WebGPU is not supported.");
        const adapter = await navigator.gpu.requestAdapter();
        Data.assert(adapter !== null, "Failed to request WebGPU adapter.");
        this._adapter = adapter;
        this._device = await adapter.requestDevice();

        this._context = context;
        context.configure({
            device: this._device,
            format: navigator.gpu.getPreferredCanvasFormat(),
            alphaMode: "premultiplied"
        });
    }

    public get underlying() {
        type UnderlyingAccess = {
            device: GPUDevice,
            context: GPUCanvasContext,
            preferredCanvasFormat: GPUTextureFormat
        };
        return new Proxy<UnderlyingAccess>(this as never, {
            get(target, key) {
                key = key.toString();
                const value = target[`_${key}` as never];
                Data.assert(value !== undefined, `Missing underlying WebGPU resource "${key}".`);
                return value;
            }
        });
    }
}