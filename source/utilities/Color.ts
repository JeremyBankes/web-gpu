export type Rgba = readonly [number, number, number, number];

export class Color {

    private _hex: bigint;
    private _rgba: Rgba;

    private constructor(hex: bigint) {
        this._hex = hex;
        this._rgba = Color._getRgba(hex);
    }

    public get rgba() { return this._rgba; }
    public get hex() { return Number(this._hex); }
    public set hex(value: number) {
        this._hex = BigInt(value);
        this._rgba = Color._getRgba(this._hex);
    }

    public get red() { return this.rgba[0]; }
    public get green() { return this.rgba[1]; }
    public get blue() { return this.rgba[2]; }
    public get alpha() { return this.rgba[3] }

    public static getRgba(hex: number) {
        return Color._getRgba(BigInt(hex));
    }

    public static getHex(rgba: Rgba) {
        return Number(Color._getHex(rgba));
    }

    private static _getRgba(hex: bigint): Rgba {
        return [
            Number((hex >> 8n * 3n) & 0xFFn),
            Number((hex >> 8n * 2n) & 0xFFn),
            Number((hex >> 8n * 1n) & 0xFFn),
            Number((hex >> 8n * 0n) & 0xFFn)
        ];
    }

    private static _getHex(rgba: Rgba) {
        return (
            BigInt(rgba[0]) << (8n * 3n) |
            BigInt(rgba[1]) << (8n * 2n) |
            BigInt(rgba[2]) << (8n * 1n) |
            BigInt(rgba[3]) << (8n * 0n)
        );
    }

    public static from(hex: number): Color;
    public static from(rgba: Rgba): Color;
    public static from(rgbaOrHex: number | Rgba): Color {
        if (typeof rgbaOrHex === "number") {
            return new Color(BigInt(rgbaOrHex));
        } else {
            return new Color(Color._getHex(rgbaOrHex));
        }
    }

    public static readonly BLACK = Color.from(0x000000FF);
    public static readonly WHITE = Color.from(0xFFFFFFFF);
    public static readonly GRAY = Color.from(0x808080FF);

    public static readonly RED = Color.from(0xFF0000FF);
    public static readonly GREEN = Color.from(0x00FF00FF);
    public static readonly BLUE = Color.from(0x0000FFFF);

    public static readonly CYAN = Color.from(0x00FFFFFF);
    public static readonly MAGENTA = Color.from(0xFF00FFFF);
    public static readonly YELLOW = Color.from(0xFFFF00FF);

}