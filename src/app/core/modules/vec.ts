import * as mathjs from 'mathjs';
import { TId, Txyz, TEdge, EEntStrToAttribMap, EEntityTypeStr } from '@libs/geo-info/common';
import { checkCommTypes, checkIDnTypes } from './_check_args';
import { GIModel } from '@libs/geo-info/GIModel';
import { idBreak } from '@libs/geo-info/id';
import { vecsSub } from '@libs/geom/vectors';

/**
 * Vector functions.
 */

/**
 * Sets the length of a vector.
 * @param __model__
 * @param vector Vector or a list of three numbers.
 * @param length Length of the vector to be set.
 * @returns Vector.
 * @example vector1 = vec.SetLength ([2,4,4], 3)
 * @example_info vector1 = [1,2,2]
 */
export function SetLength(vector: Txyz, length: number): Txyz {
    // --- Error Check ---
    const fn_name = 'vec.SetLength';
    checkCommTypes(fn_name, 'vector', vector, ['isVector']);
    checkCommTypes(fn_name, 'length', length, ['isNumber']);
    // --- Error Check ---
    return mathjs.multiply(mathjs.norm(vector), length) as Txyz;
}

/**
 * Gets the length of a vector.
 * @param __model__
 * @param vector Vector or a list of three numbers.
 * @returns Length of the vector.
 * @example length1 = vec.GetLength ([1,2,2])
 * @example_info length1 = 3
 */
export function GetLength(vector: Txyz): number {
    // --- Error Check ---
    checkCommTypes('vec.GetLength', 'vector', vector, ['isVector']);
    // --- Error Check ---
    if (vector === undefined) { throw new Error('Invalid arg: vector must be defined.'); }
    return mathjs.hypot(vector);
}

/**
 * Gets the angle (in radian) between two edges, two vectors, or an edge and a vector.
 * @param __model__
 * @param edgeOrVector1 First edge or vector.
 * @param edgeOrVector2 Second edge or vector.
 * @returns Angle (in radian).
 * @example angle1 = vec.Angle (edgeorvector1, edgeorvector2)
 */
export function Angle(edgeOrVector1: Txyz, edgeOrVector2: Txyz): number {
    // --- Error Check ---
    const fn_name = 'vec.Angle';
    checkIDnTypes(fn_name, 'edgeOrVector1', edgeOrVector1, ['isID', 'isVector'], ['EDGE']);
    checkIDnTypes(fn_name, 'edgeOrVector2', edgeOrVector2, ['isID', 'isVector'], ['EDGE']);
    // --- Error Check ---
    throw new Error('Not impemented.'); return null;
}

/**
 * Gets the cross product of two vectors.
 * @param __model__
 * @param vector1 Vector or a list of three numbers.
 * @param vector2 Vector or a list of three numbers.
 * @returns The vector cross product of two vectors.
 * @example vector3 = vec.Cross(vector1, vector2)
 */
export function Cross(vector1: Txyz, vector2: Txyz): Txyz {
    // --- Error Check ---
    const fn_name = 'vec.Cross';
    checkCommTypes(fn_name, 'vector1', vector1, ['isVector']);
    checkCommTypes(fn_name, 'vector2', vector2, ['isVector']);
    // --- Error Check ---
    return mathjs.cross(vector1, vector2);
}

/**
 * Returns the dot product of two vectors.
 * @param __model__
 * @param vector1 Vector or a list of three numbers.
 * @param vector2 Vector or a list of three numbers.
 * @returns The scalar dot product of two vectors.
 * @example vector3 = vec.Dot(vector1, vector2)
 */
export function Dot(vector1: Txyz, vector2: Txyz): number {
    // --- Error Check ---
    const fn_name = 'vec.Dot';
    checkCommTypes(fn_name, 'vector1', vector1, ['isVector']);
    checkCommTypes(fn_name, 'vector2', vector2, ['isVector']);
    // --- Error Check ---
    return mathjs.dot(vector1, vector2);
}

/**
 * Returns the dot product of two vectors.
 * @param __model__
 * @param edge The id of an edge
 * @returns The vector from the start point of an edge to teh end point of an edge
 */
export function FromEdge(__model__: GIModel, edge_id: TId): Txyz {
    // --- Error Check ---

    // --- Error Check ---
    const [ent_type_str, index]: [EEntityTypeStr, number] = idBreak(edge_id);
    const posis_i: number[] = __model__.geom.query.navAnyToPosi(ent_type_str, index);
    const start: Txyz = __model__.attribs.query.getPosiCoords(posis_i[0]);
    const end: Txyz = __model__.attribs.query.getPosiCoords(posis_i[1]);
    return vecsSub(end, start);
}
