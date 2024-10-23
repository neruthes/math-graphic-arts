(async function () {


    const COLOR1 = 'rgba(0, 45, 151, 1)';
    const COLOR2 = 'gray';

    const svgplotlib = require('../../svgplotlib');
    const lib3d = require('../../lib3d');
    const fs = require('fs');

    const Jimp = require("jimp").Jimp;
    const image_buffer = fs.readFileSync("2024/2024-004/res/text1-blur.png");
    const text1_image = await Jimp.fromBuffer(image_buffer);




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

    const apply_distortion_field = function (x, y) {
        const xx = Math.round(x);
        let yy = Math.round(y);
        const text_color = text1_image.getPixelColor(xx + 2500, yy + 2500);
        const text_color_float = (Math.floor(text_color / 256) % 256) / 255; // Using the Blue channel for convenience
        let yyy = y + text_color_float * 35;
        return [x, yyy];
    }

    for (let itr_x = -150; itr_x <= 150; itr_x++) {
        let path_data1 = `M `;
        let path_data2 = `M `;
        for (let itr_y = -2300; itr_y <= 2300; itr_y += 4) {
            let yy = itr_y;
            let xx = 99 * Math.cos(yy / 190) + itr_x * 23 + 0.2 * yy;
            if (Math.abs(xx) < 2400 && Math.abs(yy) < 2400) {
                path_data1 += apply_distortion_field(xx, yy).map(v => reduce_precision_f(v)).join(' ') + '\nL';
            }
        }
        for (let itr_y = -2300; itr_y <= 2300; itr_y += 4) {
            let yy = itr_y + 200;
            let xx = 122 * Math.cos(yy / 230) + itr_x * 17 + 0.2 * yy;
            if (Math.abs(xx) < 2400 && Math.abs(yy) < 2400) {
                path_data2 += apply_distortion_field(yy, xx).map(v => reduce_precision_f(v)).join(' ') + '\nL';
            }
        }
        // Yellow lower
        SVG_CONTENTS_OUTER += `<path fill="none" opacity="0.9" transform="rotate(0)" stroke="#DDDDDD" stroke-width="4"  d="${path_data2}" />\n`;
        // Green higher
        SVG_CONTENTS_OVERLAY += `<path fill="none" opacity="0.5" transform="rotate(0)" stroke="#999999" stroke-width="5"  d="${path_data1}" />\n`;
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



    fs.writeFileSync(`2024/2024-004/svgout/${PREF}.${PROG}.svg`, OUTPUT_SVG);








})();

/*
node 2024/2024-004/2024-004.js
sh 2024/2024-004/2024-004.sh
*/
