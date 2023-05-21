import { Data } from "@jeremy-bankes/toolbox";
export class Renderer {
    _context;
    _adapter;
    _device;
    constructor(options) {
    }
    async initialize(context) {
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
    createShader(sourceCode) {
        const module = this.safeDevice.createShaderModule({ code: sourceCode });
    }
    get safeDevice() {
        Data.assert(this._device !== undefined, "Missing WebGPU logical device.");
        return this._device;
    }
}
