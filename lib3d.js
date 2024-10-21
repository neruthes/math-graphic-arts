/*
    File name: svgplotlib.js
    Copyright (c) 2023-2024 Neruthes.
    This file is released with the MIT license.
*/


function renderMultidotMaterial(material, grid, input_attrs) {
    // material = { func vertex(uv), func fragment(vertex)}
    // NOTE: vertex returns vec3(vec2 uv_offset, float signed_scale)
    // grid = {vec2 row_col, vec2 size}
    let attrs_string = attrs = Object.keys(input_attrs).map(function (attrname) {
        return `  ${attrname}="${input_attrs[attrname]}"  `;
    }).join(' ');
    let output_string = `<g ${attrs_string}>`;
    for (let uv_x_int = 0; uv_x_int <= grid.row_col[0]; uv_x_int += 1) {
        let uv_x_f = uv_x_int / grid.row_col[0];
        if (grid.omit_cols) {
            if (uv_x_int < grid.omit_cols[0] || uv_x_int > grid.row_col[0] - grid.omit_cols[1]) {
                continue;
            };
        };
        for (let uv_y_int = 0; uv_y_int <= grid.row_col[1]; uv_y_int += 1) {
            let uv_y_f = uv_y_int / grid.row_col[1];
            let raw_uv = [uv_x_f, uv_y_f];
            let uv = [uv_x_f, uv_y_f];
            let vertex = material.vertex(uv);
            vertex[0] += raw_uv[0];
            vertex[1] += raw_uv[1];
            if (vertex[2] > 0) {
                output_string += material.fragment(raw_uv, vertex, grid);
            }
        };
    };
    output_string += '</g>\n';
    return output_string;
}



const camera_xyz_to_plane_xy = function (camera_xyz, camera_spec) {
    let plane_xy = [];
    plane_xy[0] = camera_spec.focal * camera_xyz[0] / camera_xyz[2];
    plane_xy[1] = camera_spec.focal * camera_xyz[1] / camera_xyz[2];
    return {
        camera_xyz, camera_spec, plane_xy
    }
};


function matrix_multiply(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (var c = 0; c < bNumCols; ++c) {
            m[r][c] = 0;             // initialize the current cell
            for (var i = 0; i < aNumCols; ++i) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
}

const rotate_x = function (xyz, theta) {
    // https://en.wikipedia.org/wiki/Rotation_matrix
    const mat33 = [
        [1, 0, 0],
        [0, Math.cos(theta), - Math.sin(theta)],
        [0, Math.sin(theta), Math.cos(theta)]
    ];
    const result = matrix_multiply(mat33, xyz.map(a=>[a]));
    return result.map(x => x[0]);
}

const rotate_y = function (xyz, theta) {
    // https://en.wikipedia.org/wiki/Rotation_matrix
    const mat33 = [
        [Math.cos(theta), 0, Math.sin(theta)],
        [0, 1, 0],
        [-Math.sin(theta), 0, Math.cos(theta)]
    ];
    const result = matrix_multiply(mat33, xyz.map(a => [a]));
    return result.map(x => x[0]);
}



module.exports = { renderMultidotMaterial, rotate_x, rotate_y, matrix_multiply, camera_xyz_to_plane_xy };
