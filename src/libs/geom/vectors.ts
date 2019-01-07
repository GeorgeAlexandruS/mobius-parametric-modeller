import * as three from 'three';
import * as mathjs from 'mathjs';
type Txyz = [number, number, number];
const EPS = 1e-6;

//  Vectors using Txyz =======================================================================================================


export function vecsSub(v1: Txyz, v2: Txyz, norm: boolean = false): Txyz {
    const v3: Txyz = [
        v1[0] - v2[0],
        v1[1] - v2[1],
        v1[2] - v2[2],
    ];
    if (norm) {
        this.vectorNorm(v3);
    }
    return v3;
}

export function vecsAdd(v1: Txyz, v2: Txyz, norm: boolean = false): Txyz {
    const v3: Txyz = [
        v1[0] + v2[0],
        v1[1] + v2[1],
        v1[2] + v2[2],
    ];
    if (norm) {
        this.vectorNorm(v3);
    }
    return v3;
}

export function vecsSum(vecs: Txyz[], norm: boolean = false): Txyz {
    const vec_sum: Txyz = [0, 0, 0];
    for (const vec of vecs) {
        vec_sum[0] += vec[0];
        vec_sum[1] += vec[1];
        vec_sum[2] += vec[2];
    }
    if (norm) {
        this.vectorNorm(vec_sum);
    }
    return vec_sum;
}

export function vecDiv(vec: Txyz, divisor: number): Txyz {
    return [
        vec[0] / divisor,
        vec[1] / divisor,
        vec[2] / divisor
    ];
}

export function vecMult(vec: Txyz, multiplier: number): Txyz {
    return [
        vec[0] * multiplier,
        vec[1] * multiplier,
        vec[2] * multiplier
    ];
}

export function vecsCross(v1: Txyz, v2: Txyz, norm: boolean = false): Txyz {
    return mathjs.cross(v1, v2);
}

export function vecsDot(v1: Txyz, v2: Txyz): number {
    return mathjs.dot(v1, v2);
}

export function vecNorm(v: Txyz): Txyz {
    const length: number = Math.hypot(...v);
    return [v[0] / length, v[1] / length, v[2] / length];
}

export function vecLen(v: Txyz): number {
    return Math.hypot(...v);
}

export function vecRev(v: Txyz): Txyz {
    return [
        v[0] * -1,
        v[1] * -1,
        v[2] * -1
    ];
}

export function vecMakeOrtho(v1: Txyz, v2: Txyz): Txyz {
    return vecsCross(v2, vecsCross(v1, v2));
}

export function vecsAreCodir(v1: Txyz, v2: Txyz) {
    v1  = vecNorm(v1);
    v2  = vecNorm(v2);
    if (Math.abs(1 - mathjs.dot(v1, v2)) > EPS) { return false; }
    return true;
}

export function dist(p1: Txyz, p2: Txyz): number {
    return mathjs.distance(p1, p2);
}

/**
 * Finds the normal to a set of points using Newell's method
 */
export function newellNorm(pts: Txyz[]): Txyz {

    const normal: Txyz = [0, 0, 0];
    for (let i = 0; i < pts.length - 1; i++) {
        const p0: Txyz = pts[i];
        const p1: Txyz = pts[i + 1];
        normal[0] += (p0[1] - p1[1]) * (p0[2] + p1[2]);
        normal[1] += (p0[2] - p1[2]) * (p0[0] + p1[0]);
        normal[2] += (p0[0] - p1[0]) * (p0[1] + p1[1]);
    }
    return vecNorm(normal);
}

/**
 * Create new points between two points.
 */
export function interpByNum(pt1: Txyz, pt2: Txyz, num_points: number): Txyz[] {
    if (num_points < 1) {return []; }
    const sub_vec: Txyz = vecDiv(vecsSub(pt2, pt1), num_points + 1);
    const points: Txyz[] = [];
    let next: Txyz = pt1;
    for (let i = 0; i < num_points; i++) {
        next = vecsAdd(next, sub_vec);
        points.push(next);
    }
    return points;
}
export function interpByLen(pt1: Txyz, pt2: Txyz, len: number): Txyz[] {
    const vec: Txyz = vecsSub(pt2, pt1);
    const num_points: number = Math.floor(vecLen(vec) / len);
    const sub_vec: Txyz = vecMult(vecNorm(vec), len);
    const points: Txyz[] = [];
    let next: Txyz = pt1;
    for (let i = 0; i < num_points; i++) {
        next = vecsAdd(next, sub_vec);
        points.push(next);
    }
    return points;
}

