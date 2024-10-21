const COLOR1 = 'rgba(0, 45, 151, 1)';
const COLOR2 = 'gray';

const svgplotlib = require('../../svgplotlib');
const lib3d = require('../../lib3d');
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



















let SVG_DEFS = '';
let SVG_CONTENTS_OUTER = '';
let SVG_CONTENTS_INNER = '';
let SVG_CONTENTS_OVERLAY = '';










// FLoating weave field
let multidot_material_2 = {
    vertex: function (uv) {
        let x = 0;
        let y = 0;
        let mathXY = [uv[0] - 0.5, uv[1] - 0.5];
        let camera_xyz_pre = [...mathXY, 0];
        let aptitude = 0.0015 * (1.0 + 1.95 * (0.1 + camera_xyz_pre[1]));
        aptitude = aptitude * (3 - 30.0 * Math.abs(mathXY[0]));
        let frequency = 160 * (0.8 - 0.15 * camera_xyz_pre[1]);
        camera_xyz_pre[2] += aptitude * Math.cos(0.0 + frequency * camera_xyz_pre[0]);
        let camera_xyz = camera_xyz_pre;
        camera_xyz = lib3d.rotate_x(camera_xyz, deg2rad(-88));
        camera_xyz = lib3d.rotate_y(camera_xyz, deg2rad(-0.6));
        camera_xyz[2] += 4;
        const plane_xy = lib3d.camera_xyz_to_plane_xy(camera_xyz, { focal: 0.75, fov: 90 })
        // console.log(`plane_xy`, plane_xy);
        x = plane_xy.plane_xy[0] - mathXY[0];
        y = plane_xy.plane_xy[1] - mathXY[1];
        // let s = 1;
        let s = 5.2 - camera_xyz[2];
        s = Math.pow(s, 1.25);

        const return_value = [x, y, s];
        // console.log(`return_value`, return_value);
        return return_value;
    },
    fragment: function (raw_uv, vertex, grid) {
        // vertex = vec3(vec2 uv_offset, float signed_scale)
        if (vertex[2] <= 0) { return; };
        // console.log(`vertex`, vertex);
        let COLOR = [
            244,
            100 + 122 * raw_uv[0],
            250 - 150 * raw_uv[1],
        ].map(f => Math.round(f));
        // const opacity = 0.1 + raw_uv[0] * 0.9;
        let opacity = Math.max(0, vertex[2] / 1.3 - 0.3);
        // let opacity = 1;
        const cx = (vertex[0] * grid.size[0]).toString();
        const cy = (vertex[1] * grid.size[1]).toString();
        const r = (12 * vertex[2]).toString().slice(0, 4);
        // if (opacity < 0.05) { return; };
        return `<circle fill="rgb(${COLOR.join(',')})" cx="${cx}" cy="${cy}" r="${r}" opacity="${opacity}" />\n`
    }
};


SVG_CONTENTS_OUTER += lib3d.renderMultidotMaterial(multidot_material_2, {
    omit_cols: [240, 240],
    row_col: [640, 30],
    size: [266000, 266000]
}, { transform: "translate(-133000, -133000)" });






// Wide canvas
const OUTPUT_SVG = `<svg viewBox="-6000 -3000 12000 6000" xmlns="http://www.w3.org/2000/svg">
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



fs.writeFileSync(`2024/2024-003/svgout/${PREF}.${PROG}.svg`, OUTPUT_SVG);



/*
node 2024/2024-003/2024-003.js
sh 2024/2024-003/2024-003.sh
*/
