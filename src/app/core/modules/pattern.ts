import { checkCommTypes, checkIDs, checkIDnTypes } from './_check_args';
import { Txyz, TPlane, TRay } from '@libs/geo-info/common';

/**
 * Adds positions in a circle.
* @param __model__
* @param origin XYZ coordinates as a list of three numbers.
* @param radius Radius of circle as a number.
* @param num_positions Number of positions distributed equally along the arc.
* @param arc_angle Angle of arc (in radians).
* @returns New positions if successful, null if unsuccessful or on error.
* @example positions1 = make.PositionsArc([0,0,0], 10, 12, PI)
* @example_info Creates a list of 12 positions distributed equally along a semicircle of radius 10.
 */
export function Arc(origin: Txyz|TPlane, radius: number, num_positions: number, arc_angle: number): Txyz[] {
    // --- Error Check ---
    const fn_name = 'make.PositionsArc';
    checkCommTypes(fn_name, 'origin', origin, ['isCoord', 'isPlane']);
    checkCommTypes(fn_name, 'radius', radius, ['isNumber']);
    checkCommTypes(fn_name, 'num_positions', num_positions, ['isInt']);
    checkCommTypes(fn_name, 'arc_angle', arc_angle, ['isNumber']);
    // --- Error Check ---
    const posis_id: Txyz[] = [];
    for (let i = 0; i < num_positions + 1; i++) {
        const vec: Txyz = origin as Txyz;
        const angle: number = (arc_angle / num_positions) * i;
        const x: number = (Math.cos(angle) * radius) + vec[0];
        const y: number = (Math.sin(angle) * radius) + vec[1];
        posis_id.push( [x, y, vec[2]] );
    }
    // TODO Implement the TPlane version
    return posis_id;
}
/**
 * Adds positions in a grid.
 * @param __model__
* @param origin XYZ coordinates as a list of three numbers.
* @param size Size of grid. If number, assume square grid of that length; if list of two numbers, x and y lengths respectively.
* @param num_positions Number of positions. If integer, same number for x and y; if list of two numbers, number for x and y respectively.
* @returns New positions if successful, null if unsuccessful or on error.
* @example positions1 = make.PositionsGrid([0,0,0], 10, 3)
* @example_info Creates a list of 9 positions on a 3x3 square grid of length 10.
* @example positions1 = make.PositionsGrid([0,0,0], [10,20], [2,4])
* @example_info Creates a list of 8 positions on a 2x4 grid of length 10 by 20.
 */
export function Grid(origin: Txyz|TPlane, size: number|[number, number], num_positions: number|[number, number]): Txyz[] {
    // --- Error Check ---
    const fn_name = 'make.PositionsGrid';
    checkCommTypes(fn_name, 'origin', origin, ['isCoord', 'isPlane']);
    checkCommTypes(fn_name, 'size', size, ['isNumber', 'isXYlist']);
    checkCommTypes(fn_name, 'num_positions', num_positions, ['isInt', 'isXYlistInt']);
    // --- Error Check ---
    const xy_size: [number, number] = (Array.isArray(size) ? size : [size, size]) as [number, number];
    const xy_num_posis: [number, number] =
        (Array.isArray(num_positions) ? num_positions : [num_positions, num_positions]) as [number, number];
    const x_offset: number = xy_size[0] / (xy_num_posis[0] - 1);
    const y_offset: number = xy_size[1] / (xy_num_posis[1] - 1);
    const posis_id: Txyz[] = [];
    for (let i = 0; i < xy_num_posis[0]; i++) {
        const vec: Txyz = origin as Txyz;
        const x: number = (i * x_offset) + vec[0] - (xy_size[0] / 2);
        for (let j = 0; j < xy_num_posis[1]; j++) {
            const y: number = (j * y_offset) + vec[1] - (xy_size[1] / 2);
            posis_id.push( [x, y, vec[2]] );
        }
    }
    // TODO Implement the TPlane version
    return posis_id;
}
/**
 * Adds positions in a rectangle.
* @param __model__
* @param origin XYZ coordinates as a list of three numbers.
* @param size Size of rectangle. If number, assume square of that length; if list of two numbers, x and y lengths respectively.
* @returns New positions if successful, null if unsuccessful or on error.
* @example positions1 = make.PositionsRect([0,0,0], 10)
* @example_info Creates a list of 4 positions, being the vertices of a 10 by 10 square.
* @example positions1 = make.PositionsGrid([0,0,0], [10,20])
* @example_info Creates a list of 4 positions, being the vertices of a 10 by 20 rectangle.
 */
export function Rectangle(origin: Txyz|TPlane, size: number|[number, number]): Txyz[] {
    // --- Error Check ---
    const fn_name = 'make.PositionsRect';
    checkCommTypes(fn_name, 'origin', origin, ['isCoord', 'isPlane']);
    checkCommTypes(fn_name, 'size', size, ['isNumber', 'isXYlist']);
    // --- Error Check ---
    const xy_size: [number, number] = (Array.isArray(size) ? size : [size, size]) as [number, number];
    const vec: Txyz = origin as Txyz;
    const c1: Txyz = [vec[0] - (xy_size[0] / 2), vec[1] - (xy_size[1] / 2), vec[2]];
    const c2: Txyz = [vec[0] + (xy_size[0] / 2), vec[1] - (xy_size[1] / 2), vec[2]];
    const c3: Txyz = [vec[0] + (xy_size[0] / 2), vec[1] + (xy_size[1] / 2), vec[2]];
    const c4: Txyz = [vec[0] - (xy_size[0] / 2), vec[1] + (xy_size[1] / 2), vec[2]];
    return [c1, c2, c3, c4];
    // TODO Implement the TPlane version
}