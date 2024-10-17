const COLOR1 = 'rgba(0, 45, 151, 1)';
const COLOR2 = 'gray';

const svgplotlib = require('../../svgplotlib');
const fs = require('fs');

const PROG = parseInt(process.env.PROG || 10000);
const PREF = process.env.PREF || 'Base';

// Some specific config variables
const CORNER_DECORATION_BORDER_CIRCLE_SKIP = 300;
const USABLE_CONTENT_SIZE_W = CORNER_DECORATION_BORDER_CIRCLE_SKIP * 12 + 0;
const USABLE_CONTENT_SIZE_H = CORNER_DECORATION_BORDER_CIRCLE_SKIP * 18 + 0;


// Some functions
const deg2rad = function (deg) {
    return deg / 360 * (Math.PI * 2);
};
const uv_to_polarity = function (uv) {
    return uv * 2 - 1;
}



















let SVG_DEFS = '';
let SVG_CONTENTS_OUTER = '';
let SVG_CONTENTS_INNER = '';
let SVG_CONTENTS_OVERLAY = '';


// Make new entropy
// let ENTROPY_POOL = [];
// for (let i = 0; i <= 500; i ++) {
//     ENTROPY_POOL.push(Math.random());
// };
// fs.writeFileSync(`2024/2024-002/2024-002.entropy_pool.json`, JSON.stringify(ENTROPY_POOL));

// Get saved entropy
let ENTROPY_POOL = JSON.parse(fs.readFileSync(`2024/2024-002/2024-002.entropy_pool.json`).toString());





const renderMultidotMaterial = function (material, grid, input_attrs) {
    // material = { func vertex(uv), func fragment(vertex)}
    // NOTE: vertex returns vec3(vec2 uv_offset, float signed_scale)
    // grid = {vec2 row_col, vec2 size}
    let attrs_string = attrs = Object.keys(input_attrs).map(function (attrname) {
        return `  ${attrname}="${input_attrs[attrname]}"  `;
    }).join(' ');
    let output_string = `<g ${attrs_string}>`;
    for (let uv_x_int = 0; uv_x_int <= grid.row_col[0]; uv_x_int += 1) {
        let uv_x_f = uv_x_int / grid.row_col[0];
        for (let uv_y_int = 0; uv_y_int <= grid.row_col[1]; uv_y_int += 1) {
            let uv_y_f = uv_y_int / grid.row_col[1];
            let raw_uv = [uv_x_f, uv_y_f];
            let uv = [uv_x_f, uv_y_f];
            let vertex = material.vertex(uv);
            vertex[0] += raw_uv[0];
            vertex[1] += raw_uv[1];
            output_string += material.fragment(raw_uv, vertex, grid);
        };
    };
    output_string += '</g>\n';
    return output_string;
}

// Something like Windows 98 logo
let multidot_material_1 = {
    vertex: function (uv) {
        let x = 0.02 * Math.sin(uv[1] * 5.9) + 0.25 * uv[1];
        x *= 1 - 0.15 * uv[1];
        let y = 0.07 * Math.cos(uv[0] * 4.2) * (1.0 - 0.2 * uv[1]);
        y *= 1 - 0.15 * uv[0];
        let s = uv[0] * 0.4 + 0.6;
        return [x, y, s];
    },
    fragment: function (raw_uv, vertex, grid) {
        // vertex = vec3(vec2 uv_offset, float signed_scale)
        let COLOR = [
            50 + 170 * raw_uv[0],
            250 - 200 * raw_uv[1],
            180
        ].map(f => Math.round(f));
        if (Math.abs(raw_uv[0] - 0.5) < 0.04 || Math.abs(raw_uv[1] - 0.5) < 0.04) { return ''; };
        const cx = (vertex[0] * grid.size[0]).toString().slice(0, 6);
        const cy = (vertex[1] * grid.size[1]).toString().slice(0, 6);
        const r = (12 * vertex[2]).toString().slice(0, 4);
        return `<circle fill="rgb(${COLOR.join(',')})" cx="${cx}" cy="${cy}" r="${r}" />\n`
    }
};

// FLoating weave field
let multidot_material_2 = {
    vertex: function (uv) {
        let x = 0;
        let y = 0;
        let mathXY = [uv[0] - 0.5, uv[1] - 0.5];

        let height_shift_UVW = Math.cos(5.5 + 9 * (uv[0] + 0.4 * uv[1]));
        let height_effeciency = 0.2 + 0.8 * uv[1] // More volatile if nearer to camera

        x = -0.5;
        mathXY[1] = Math.pow(uv[1], 1.5) - 0.25;
        mathXY[0] *= 0.9 + 0.9 * mathXY[1];
        // Finalize
        y = mathXY[1] - uv[1];
        x = mathXY[0] - uv[0];
        y += 0.3 * height_effeciency * height_shift_UVW; // Apply height shifting wave
        // Special extra shifting
        x += 0.05;
        y += -0.1;
        let s = 1;
        s = 0.0 + 1.0 * (Math.pow(1 + uv[1], 2.3) - 1) - 0.5 * height_shift_UVW;
        return [x, y, s];
    },
    fragment: function (raw_uv, vertex, grid) {
        // vertex = vec3(vec2 uv_offset, float signed_scale)
        if (vertex[2] <= 0) { return; };
        let COLOR = [
            244,
            100 + 122 * raw_uv[0],
            250 - 150 * raw_uv[1],
        ].map(f => Math.round(f));
        // const opacity = 0.1 + raw_uv[0] * 0.9;
        let opacity = vertex[2]/4;
        const cx = (vertex[0] * grid.size[0]).toString().replace(/\.(\d{2}).+$/, '.$1');
        const cy = (vertex[1] * grid.size[1]).toString().replace(/\.(\d{2}).+$/, '.$1');
        const r = (12 * vertex[2]).toString().slice(0, 4);
        // if (opacity < 0.05) { return; };
        return `<circle fill="rgb(${COLOR.join(',')})" cx="${cx}" cy="${cy}" r="${r}" opacity="${opacity}" />\n`
    }
};


SVG_CONTENTS_OUTER += renderMultidotMaterial(multidot_material_2, {
    row_col: [44, 35],
    size: [6000, 2000]
}, { transform: "translate(0, 0)" });






// Square canvas
const OUTPUT_SVG = `<svg viewBox="-3000 -3000 6000 6000" xmlns="http://www.w3.org/2000/svg">
<desc>Copyright (c) 2024 Neruthes. All rights reserved.</desc>

<defs>
    <mask id="contentsizebox-mask">
        <rect x="-${(USABLE_CONTENT_SIZE_W + 111.00) / 2}" y="-${(USABLE_CONTENT_SIZE_H + 111.00) / 2}"
            width="${(USABLE_CONTENT_SIZE_W + 111.00)}" height="${(USABLE_CONTENT_SIZE_H + 111.00)}"
            rx="0" ry="0" stroke-width="0" fill="white" opacity="1" />
    </mask>
    ${SVG_DEFS}
</defs>


<!--
canvas size debug
<rect fill="gray" x="-3535" y="-5000" width="7070" height="10000" />
-->
<rect fill="black" x="-6000" y="-6000" width="12000" height="12000" />


${SVG_CONTENTS_OUTER}
<rect x="-${(USABLE_CONTENT_SIZE_W + 111.00) / 2}" y="-${(USABLE_CONTENT_SIZE_H + 111.00) / 2}"
    width="${(USABLE_CONTENT_SIZE_W + 111.00)}" height="${(USABLE_CONTENT_SIZE_H + 111.00)}"
    rx="0" ry="0" stroke="none" stroke-width="17" fill="white" opacity="0" />

<g mask="url(#contentsizebox-mask)">
    ${SVG_CONTENTS_INNER}
</g>

<use href="#contentsizebox" stroke="${COLOR1}" stroke-width="35" fill="none" opacity="1" />

${SVG_CONTENTS_OVERLAY}

<!--
gradient debug
<rect opacity="1" x="0" y="0" width="2000" height="2000" fill="url(#bordergradient-radial)" />
-->




</svg>`;



fs.writeFileSync(`2024/2024-002/svgout/${PREF}.${PROG}.svg`, OUTPUT_SVG);



// node 2024/2024-002/2024-002.js
