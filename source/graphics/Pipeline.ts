import { FragmentShader } from "./FragmentShader";
import { Renderer } from "./Renderer";
import { VertexShader } from "./VertexShader";
import { Buffer } from "./Buffer";
import { BindGroup } from "./BindGroup";

export class Pipeline {

    public readonly renderer: Renderer;
    public readonly handle: GPURenderPipeline;
    public readonly vertexShader: VertexShader;
    public readonly fragmentShader: FragmentShader;

    public constructor(renderer: Renderer, vertexShader: VertexShader, fragmentShader: FragmentShader) {
        this.renderer = renderer;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.handle = renderer.underlying.device.createRenderPipeline({
            vertex: vertexShader.createVertexState(),
            fragment: fragmentShader.createFragmentState(),
            primitive: {
                topology: "triangle-list"
            },
            layout: "auto"
        });
    }

    public render(buffer: Buffer, bindGroups: BindGroup[]) {
        const commandEncoder = this.renderer.underlying.device.createCommandEncoder();
        const texture = this.renderer.underlying.context.getCurrentTexture();
        const renderPassEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [
                {
                    clearValue: {
                        r: this.renderer.clearColor.red,
                        g: this.renderer.clearColor.green,
                        b: this.renderer.clearColor.blue,
                        a: this.renderer.clearColor.alpha
                    },
                    loadOp: "clear",
                    storeOp: "store",
                    view: texture.createView()
                }
            ]
        });

        renderPassEncoder.setPipeline(this.handle);
        renderPassEncoder.setVertexBuffer(0, buffer.handle);
        for (const bindGroup of bindGroups) {
            renderPassEncoder.setBindGroup(bindGroup.index, bindGroup.handle);
        }
        renderPassEncoder.draw(3);
        renderPassEncoder.end();
        const commandBuffer = commandEncoder.finish();
        this.renderer.underlying.device.queue.submit([commandBuffer]);
    }

}