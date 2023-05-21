type Vector<Size extends number = 0, Tuple extends number[] = []> = Tuple["length"] extends Size ? (Size extends 0 ? number[] : Tuple) : Vector<Size, [number, ...Tuple]>;
type Matrix<Size extends number = 0, Rows extends Vector<Size>[] = []> = Rows["length"] extends Size ? (Size extends 0 ? number[][] : Rows) : Matrix<Size, [Vector<Size>, ...Rows]>;

export namespace Math {

    export function Vector2(x = 0, y = x): Vector<2> {
        return [x, y];
    }

    export function Vector3(x = 0, y = x, z = y): Vector<3> {
        return [x, y, z];
    }

    export function Vector4(x = 0, y = x, z = y, w = z): Vector<4> {
        return [x, y, z, w];
    }

    export function Matrix3(matrix: Matrix<3> = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]): Matrix<3> {
        return matrix;
    }

    export function Matrix4(matrix: Matrix<4> = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ]): Matrix<4> { return matrix; }

    export namespace Projection {

        export function orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix<4> {
            const width = right - left;
            const height = top - bottom;
            const depth = far - near;
            const translationX = -(right + left) / width;
            const translationY = -(top + bottom) / height;
            const translationZ = -(far + near) / depth;
            return [
                [2 / width, 0, 0, translationX],
                [0, 2 / height, 0, translationY],
                [0, 0, -2 / depth, translationZ],
                [0, 0, 0, 1]
            ];
        }

    }

    export namespace Transformation {

        export function translate(translationX: number, translationY: number, translationZ: number): Matrix<4> {
            return [
                [1, 0, 0, translationX],
                [0, 1, 0, translationY],
                [0, 0, 1, translationZ],
                [0, 0, 0, 1]
            ];
        }

        export function rotate(angleInDegrees: number, axisX: number, axisY: number, axisZ: number): Matrix<4> {
            const angleInRadians = angleInDegrees * globalThis.Math.PI / 180;
            const cosAngle = globalThis.Math.cos(angleInRadians);
            const sinAngle = globalThis.Math.sin(angleInRadians);
            const oneMinusCos = 1 - cosAngle;

            const tx = oneMinusCos * axisX;
            const ty = oneMinusCos * axisY;
            const tz = oneMinusCos * axisZ;
            const txy = tx * axisY;
            const txz = tx * axisZ;
            const tyz = ty * axisZ;
            const sinX = sinAngle * axisX;
            const sinY = sinAngle * axisY;
            const sinZ = sinAngle * axisZ;

            return [
                [tx * axisX + cosAngle, txy - sinZ, txz + sinY, 0],
                [txy + sinZ, ty * axisY + cosAngle, tyz - sinX, 0],
                [txz - sinY, tyz + sinX, tz * axisZ + cosAngle, 0],
                [0, 0, 0, 1]
            ];
        }

        export function scale(scaleX: number, scaleY: number, scaleZ: number): Matrix<4> {
            return [
                [scaleX, 0, 0, 0],
                [0, scaleY, 0, 0],
                [0, 0, scaleZ, 0],
                [0, 0, 0, 1]
            ];
        }

    }

    export function clone<MatrixType extends Matrix>(matrix: MatrixType): MatrixType {
        const newMatrix = [];
        for (const row of matrix) {
            newMatrix.push([...row]);
        }
        return newMatrix as MatrixType;
    }

    export function copy<MatrixType extends Matrix>(from: MatrixType, to: MatrixType) {
        for (let i = 0; i < from.length; i++) {
            for (let j = 0; j < from[i].length; j++) {
                to[i][j] = from[i][j];
            }
        }
    }

    export function transpose(matrix: Matrix) {
        const transposed = clone(matrix);
        for (let i = 0; i < matrix.length; i++) {
            const row = matrix[i];
            for (let j = 0; j < row.length; j++) {
                transposed[j][i] = row[j];
            }
        }
        copy(transposed, matrix);
        return matrix;
    }

    export function toString(matrix: Matrix) {
        let maximumLength = 0;
        return matrix.map(row => row.map(cell => {
            const string = cell.toString();
            maximumLength = globalThis.Math.max(maximumLength, string.length);
            return string;
        })).map(row => `[ ${row.map(cell => cell.padStart(maximumLength, " ")).join(" | ")} ]`).join("\n");
    }

}