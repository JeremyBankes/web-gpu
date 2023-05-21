import { Buffer } from "./Buffer";
import { Pipeline } from "./Pipeline";

export class BindGroup {

    public readonly label: string;
    public readonly index: number;
    public readonly pipeline: Pipeline;
    public readonly handle: GPUBindGroup;

    public constructor(pipeline: Pipeline, label: string, index: number, buffer: Buffer) {
        this.pipeline = pipeline;
        this.label = label;
        this.index = index;
        this.handle = pipeline.renderer.underlying.device.createBindGroup({
            label: label,
            layout: pipeline.handle.getBindGroupLayout(index),
            entries: [
                {
                    binding: 0, // Corresponds to @binding
                    resource: {
                        buffer: buffer.handle
                    }
                }
            ]
        });
    }



}