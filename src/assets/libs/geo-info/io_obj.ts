import { GIModel } from './GIModel';
import {  TColor, TNormal, TTexture, EAttribNames, Txyz, EEntType, TId } from './common';

/**
 * Import obj
 */
export function importObj(obj_str: string): GIModel {
    const model: GIModel = new GIModel();
    enum EObjLine {
        OBJ_COMMENT = '#',
        OBJ_COORD = 'v ',
        OBJ_TEXTURE = 'vt ',
        OBJ_NORMAL = 'vn ',
        OBJ_FACE = 'f ',
        OBJ_LINE = 'l '
    }
    const obj_lines: string[] = obj_str.split(/\r?\n/);
    const coords: Txyz[] = [];
    const normals: TNormal[] = [];
    const textures: TTexture[] = [];
    const faces: number[][][] = [];
    const plines: number[][] = [];
    for (const obj_line of obj_lines) {
        if (obj_line.startsWith( EObjLine.OBJ_COMMENT )) {
            // Do not do anything
        } else if (obj_line.startsWith( EObjLine.OBJ_COORD )) {
            const coord: Txyz = obj_line.split(' ').slice(1, 4).map( v => parseFloat(v) ) as Txyz;
            coords.push(coord);
        } else if (obj_line.startsWith( EObjLine.OBJ_TEXTURE )) {
            const normal: TNormal = obj_line.split(' ').slice(1, 4).map( v => parseFloat(v) ) as TNormal;
            normals.push(normal);
        } else if (obj_line.startsWith( EObjLine.OBJ_NORMAL )) {
            const texture: TTexture = obj_line.split(' ').slice(1, 3).map( v => parseFloat(v) ) as TTexture;
            textures.push(texture);
        } else if (obj_line.startsWith( EObjLine.OBJ_FACE )) {
            const face_strs: string[] = obj_line.split(' ').slice(1);
            const v_indexes: number[] = [];
            const t_indexes: number[] = [];
            const n_indexes: number[] = [];
            face_strs.forEach( face_str => {
                const face_sub_indexes: number[] = face_str.split('/').map( str => parseInt(str, 10) - 1 );
                v_indexes.push(face_sub_indexes[0]);
                t_indexes.push(face_sub_indexes[1]);
                n_indexes.push(face_sub_indexes[2]);
            });
            faces.push([v_indexes, t_indexes, n_indexes]);
        } else if (obj_line.startsWith( EObjLine.OBJ_LINE )) {
            const pline: number[] = obj_line.split(' ').slice(1).map( v => parseInt(v, 10) - 1 ) as TTexture;
            plines.push(pline);
        } else {
            console.log('Found unrecognised line of data in OBJ file');
        }
    }
    for (const coord of coords) {
        const posi_i: number = model.geom.add.addPosi();
        model.attribs.add.setAttribVal(EEntType.POSI, posi_i, EAttribNames.COORDS, coord);
    }
    for (const face of faces) {
        console.log(face[0]);
        const face_i: number = model.geom.add.addPgon(face[0]);
        // TODO: texture uv
        // TODO: normals
    }
    return model;
}

/**
 * Export to obj
 */
export function exportObj(model: GIModel, entities: TId[]): string {
    const h_str = '# File generated by Mobius.\n';
    // the order of data is 1) vertex, 2) texture, 3) normal
    let v_str = '';
    let vt_str = '';
    let vn_str = '';
    let f_str = '';
    let l_str = '';
    // do we have color, texture, normal?
    const has_color_attrib: boolean = model.attribs.query.hasAttrib(EEntType.VERT, EAttribNames.COLOR);
    const has_normal_attrib: boolean = model.attribs.query.hasAttrib(EEntType.VERT, EAttribNames.NORMAL);
    const has_texture_attrib: boolean = model.attribs.query.hasAttrib(EEntType.VERT, EAttribNames.TEXTURE);
    const posis_i: number[] = model.geom.query.getEnts(EEntType.POSI, false);
    const verts_i: number[] = model.geom.query.getEnts(EEntType.VERT, false);
    // positions
    if (has_color_attrib) {
        for (const vert_i of verts_i) {
            const color: TColor = model.attribs.query.getAttribVal(EEntType.VERT, EAttribNames.COLOR, vert_i) as TColor;
            const coord: Txyz = model.attribs.query.getVertCoords(vert_i);
            v_str += 'v ' + coord.map( v => v.toString() ).join(' ') + color.map( c => c.toString() ).join(' ') + '\n';
        }
    } else {
        for (const posi_i of posis_i) {
            const coord: Txyz = model.attribs.query.getPosiCoords(posi_i);
            v_str += 'v ' + coord.map( v => v.toString() ).join(' ') + '\n';
        }
    }
    // textures, vt
    if (has_texture_attrib) {
        for (const vert_i of verts_i) {
            const texture: TTexture = model.attribs.query.getAttribVal(EEntType.VERT, EAttribNames.TEXTURE, vert_i) as TTexture;
            vt_str += 'v ' + texture.map( v => v.toString() ).join(' ') + '\n';
        }
    }
    // normals, vn
    if (has_normal_attrib) {
        for (const vert_i of verts_i) {
            const normal: TNormal = model.attribs.query.getAttribVal(EEntType.VERT, EAttribNames.NORMAL, vert_i) as TNormal;
            vn_str += 'v ' + normal.map( v => v.toString() ).join(' ') + '\n';
        }
    }
    // polygons, f
    const pgons_i: number[] = model.geom.query.getEnts(EEntType.PGON, false);
    for (const pgon_i of pgons_i) {
        const pgon_verts_i_outer: number[] = model.geom.nav.navAnyToVert(EEntType.PGON, pgon_i);
        // const verts_i_outer = verts_i[0];
        // TODO what about holes
        if (has_texture_attrib) {
            // TODO
        }
        if (has_normal_attrib) {
            // TODO
        }
        if (has_color_attrib) {
            f_str += 'f ' + pgon_verts_i_outer.map( vert_i => (vert_i + 1).toString() ).join(' ') + '\n';
        } else {
            f_str += 'f ' + pgon_verts_i_outer.map( vert_i => (model.geom.nav.navVertToPosi(vert_i) + 1).toString() ).join(' ') + '\n';
        }
    }
    // polylines, l
    const plines_i: number[] = model.geom.query.getEnts(EEntType.PLINE, false);
    for (const pline_i of plines_i) {
        const pline_verts_i: number[] = model.geom.nav.navAnyToVert(EEntType.PLINE, pline_i);
        l_str += 'l ' + pline_verts_i.map( vert_i => (vert_i + 1).toString() ).join(' ') + '\n';
    }
    // result
    return h_str + v_str + v_str + vt_str + vn_str + f_str + l_str;
}
