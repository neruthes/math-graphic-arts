(async function () {


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



    const reduce_precision_f = function (value_f) {
        return (Math.round(value_f * 100) / 100).toString().replace(/\.\d\d(\d+)/, '');
    }

    const polar_to_cartesian = function (deg, vertexDistance) {
        const theta_rad = deg / 360 * Math.PI * 2;
        const x1 = Math.round(100 * vertexDistance * Math.sin(theta_rad)) / 100;
        const y1 = Math.round(100 * vertexDistance * Math.cos(theta_rad)) / 100;
        return [x1, y1];
    };

    const massager = function (input_num, force) {
        return Math.pow(Math.abs(input_num), force);
    }

    for (let itr = 0; itr <= 3; itr++) {
        const f_curve_base = function (theta_normalized) {
            // Note: theta is normalized to range(-1, 1)
            // theta_normalized_massaged = Math.pow(Math.abs(theta_normalized), 1.25) * theta_normalized;
            return 1400 + 150 * Math.cos(5.0 * massager(theta_normalized, 0.8)) - 100 * Math.abs(1.3 * massager(theta_normalized, 0.7));
        }
        const f_curve_width = function (theta_normalized) {
            // Note: theta is normalized to range(-1, 1)
            return 80 + 90 * Math.cos(2.5 * massager(theta_normalized, 1.15));
        }
        const semispan = 38.0;
        const rounds = 9;
        const deg_precision = 10;
        let arr_1 = [];
        let arr_2 = [];
        let arr_6 = [];
        let arr_7 = [];
        for (let deg_micro = -semispan * deg_precision; deg_micro <= semispan * deg_precision; deg_micro += 1) {
            const deg = deg_micro / deg_precision;
            let curve_base = f_curve_base(deg / semispan);
            let curve_width = f_curve_width(deg / semispan);
            const vertexDistance1 = curve_base + curve_width * Math.sin(rounds * deg / semispan * 2 * Math.PI);
            const vertexDistance6 = curve_base + 1.0 * curve_width + 50;
            const vertexDistance2 = curve_base - curve_width * Math.sin(rounds * deg / semispan * 2 * Math.PI);
            const vertexDistance7 = curve_base - 1.0 * curve_width - 50;
            arr_1.push(polar_to_cartesian(deg + itr * 90, vertexDistance1));
            arr_2.push(polar_to_cartesian(deg + itr * 90, vertexDistance2));
            arr_6.push(polar_to_cartesian(1.0 * deg + itr * 90, vertexDistance6));
            arr_7.push(polar_to_cartesian(1.0 * deg + itr * 90, vertexDistance7));
        }
        let path_data1 = 'M' + arr_1.map(a => a.join(',')).join('\n L ');
        let path_data2 = 'M' + arr_2.map(a => a.join(',')).join('\n L ');
        let path_data6 = '';
        let path_data7 = '';
        path_data6 = 'M' + arr_6.map(a => a.join(',')).join('\n L ');
        path_data7 = 'M' + arr_7.map(a => a.join(',')).join('\n L ');
        SVG_CONTENTS_OVERLAY += `<path stroke-linejoin="round" stroke-linecap="round" fill="none" opacity="1" transform="rotate(0)" stroke="black" stroke-width="6"  d="
        ${path_data1}
        ${path_data2}
        ${path_data6}
        ${path_data7}
        " />\n`;
    }










    // Wide canvas
    const OUTPUT_SVG = `<svg viewBox="-2000 -2000 4000 4000" xmlns="http://www.w3.org/2000/svg">
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
<rect fill="gray" x="-2500" y="-2500" width="5000" height="5000" />
-->
<rect fill="white" x="-2500" y="-2500" width="5000" height="5000" />


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



    fs.writeFileSync(`2024/2024-005/svgout/${PREF}.${PROG}.svg`, OUTPUT_SVG);








})();

/*
node 2024/2024-005/2024-005.js
sh 2024/2024-005/2024-005.sh
*/
