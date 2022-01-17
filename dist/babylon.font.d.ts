import * as loader from '@assemblyscript/loader';
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Vector4, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color4 } from '@babylonjs/core/Maths/math.color';

interface IPathCommand {
    type: string;
    x?: number;
    y?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
}
interface MyAPI {
    memory: WebAssembly.Memory;
    compile(bytesUsed: number, fmt: string, ppc: number, eps: number): number;
}
declare type Vertex = [number, number];
declare type Polygon = Vertex[];
declare type Shape = {
    fill: Polygon;
    holes: Polygon[];
};
declare class Compiler {
    private wasm;
    constructor(wasm: loader.ASUtil & MyAPI);
    static Build(wasmUrl: string): Promise<Compiler>;
    encode(cmds: IPathCommand[], buffer: ArrayBuffer): number;
    compileEncoded(buffer: ArrayBuffer, bytesUsed: number, fmt: string, ppc: number, eps: number): Shape[];
    compile(cmds: IPathCommand[], fmt: string, ppc: number, eps: number): Shape[];
}

declare type PolygonMeshOption = {
    backUVs?: Vector4;
    depth?: number;
    faceColors?: Color4[];
    faceUV?: Vector4[];
    frontUVs?: Vector4;
    sideOrientation?: number;
    updatable?: boolean;
};
declare class Font {
    raw: opentype.Font;
    private compiler;
    private constructor();
    static Install(fontUrl: string, compiler: Compiler, opentype: any): Promise<Font>;
    measure(name: string, size: number): Metrics;
    static Compile(font: Font, name: string, size: number, ppc: number, eps: number): Shape[];
}
interface IBabylon {
    Mesh: typeof Mesh;
    MeshBuilder: typeof MeshBuilder;
    Vector3: typeof Vector3;
}
declare class TextMeshBuilder {
    private babylon;
    private earcut;
    constructor(babylon: IBabylon, earcut: any);
    private createFromShapes;
    create({ font, text, size, ppc, eps, ...option }: {
        font: Font;
        text: string;
        size: number;
        ppc: number;
        eps: number;
    } & PolygonMeshOption, scene?: Scene): Mesh;
}
declare class Metrics {
    private font;
    private name;
    private size;
    constructor(font: Font, name: string, size: number);
    get ascender(): number;
    get descender(): number;
    get advanceWidth(): number;
}

export { Compiler, Font, Metrics, Shape, TextMeshBuilder };
