const COLOR1 = 'rgba(0, 45, 151, 1)';
const COLOR2 = 'gray';

const svgplotlib = require('../../svgplotlib');
const fs = require('fs');

const PROG = parseInt(process.env.PROG || 10000);
const PREF = process.env.PREF || 'Base';

// Some specific config variables
const CORNER_DECORATION_BORDER_CIRCLE_SKIP = 510;
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
//     entropy_pool.push(Math.random());
// };
// fs.writeFileSync(`2024/2024-001/2024-001.entropy_pool.json`, JSON.stringify(ENTROPY_POOL));

// Get saved entropy
let ENTROPY_POOL = JSON.parse(fs.readFileSync(`2024/2024-001/2024-001.entropy_pool.json`).toString());








for (let itr = 16; itr > 1; itr--) {
    if (itr > PROG) {
        continue
    };
    let myfunc_rosemain = function (theta_rad) {
        const rad_ring_polarity = 2.0 * ENTROPY_POOL[itr] - 1.0;
        const theta_rad_new = theta_rad + ENTROPY_POOL[99 - itr] * 2 * Math.PI;
        const anti_theta_rad = 2 * Math.PI - theta_rad_new;
        let k1 = 0;
        for (let jjj = 1; jjj < 22; jjj++) {
            let multiplier = Math.round(2.0 + 16 * ENTROPY_POOL[15 + 22 * itr + jjj]); // Generating a ranged random
            let high_freq_penalty = 1.0 - (multiplier / 23); // Higher multiplier means smaller impact
            high_freq_penalty = Math.pow(high_freq_penalty, 1.1);
            k1 += (high_freq_penalty * ENTROPY_POOL[10 * itr + jjj] * 0.5 + 0.5) * Math.sin(multiplier * (theta_rad_new + 0.2 * ENTROPY_POOL[itr]));
        }
        let basic_r = 360 + k1 * (6.0 + 1.0 * itr) * 0.4;
        basic_r += itr * 90;
        basic_r *= 1 + 0.16 * itr;
        return basic_r;
    }
    // Fill
    let scale_x = 1.0 + 0.1 * uv_to_polarity(ENTROPY_POOL[15 + itr]);
    let scale_y = 1.02 + 0.1 * uv_to_polarity(ENTROPY_POOL[77 - itr]);
    let tr_x = (itr + 11) * 1 * uv_to_polarity(ENTROPY_POOL[120 + itr]);
    let tr_y = -750 + itr * 50 + (itr + 11) * 1 * uv_to_polarity(ENTROPY_POOL[155 + 2 * itr]);
    SVG_CONTENTS_INNER += svgplotlib.drawpolarcircle({
        step: itr > 7 ? 1 : 2,
        attrs: {
            transform: `scale(${scale_x},${scale_y}) translate(${tr_x},${tr_y})`,
            fill: COLOR1,
            opacity: 0.002 + Math.pow((16 - itr) / 18, 1.5) * 0.43,
            stroke: `url(#bordergradient-radial)`,
            'stroke-width': '14px',
            'stroke-linejoin': 'round',
        },
        func: myfunc_rosemain
    }) + '\n';
}


if (PROG > 30) {
    SVG_CONTENTS_OVERLAY += `<use href="#main-text-group" fill="${COLOR1}" stroke="${COLOR1}" stroke-width="22" transform="translate(22,22)" opacity="0.5" />`;
    SVG_CONTENTS_OVERLAY += `<use href="#main-text-group" fill="white" stroke="white" stroke-width="9" opacity="1" />`;
}

if (PROG > 31) {
    SVG_CONTENTS_OVERLAY += `<text font-family="New Heterodox Mono" font-weight="900" font-size="235" x="-${(USABLE_CONTENT_SIZE_W + 111.00) / 2}" y="-4475">THIS IS A FICTIONAL EVENT POSTER</text>`;
}
if (PROG > 32) {
    SVG_CONTENTS_OVERLAY += `<text font-family="New Heterodox Mono" font-weight="900" font-size="506" x="-${(USABLE_CONTENT_SIZE_W + 111.00) / 2}" y="4120">2024/OCT/15/TUE</text>`;
}
if (PROG > 33) {
    SVG_CONTENTS_OVERLAY += `<text font-family="New Heterodox Mono" font-weight="900" font-size="506" x="-${(USABLE_CONTENT_SIZE_W + 111.00) / 2}" y="4620">1 INFINITE LOOP</text>`;
}



// A4 paper, 
const OUTPUT_SVG = `<svg viewBox="-3535 -5000 7070 10000" data-height="100vh" xmlns="http://www.w3.org/2000/svg">
<desc>Copyright (c) 2024 Nekostein, an unincorporated game development team. All rights reserved.</desc>

<defs>
    <g id="main-text-group">
        <g transform="scale(1,1.1)">
            <text font-family="DM Serif Display" font-size="1155" x="-${(USABLE_CONTENT_SIZE_W + 111.00) / 2}" y="1000">POSTER</text>
            <text font-family="DM Serif Display" font-size="1155" x="-${(USABLE_CONTENT_SIZE_W + 111.00) / 2}" y="2000">TITLE</text>
        </g>
    </g>

    <mask id="contentsizebox-mask">
        <rect x="-${(USABLE_CONTENT_SIZE_W + 111.00) / 2}" y="-${(USABLE_CONTENT_SIZE_H + 111.00) / 2}"
            width="${(USABLE_CONTENT_SIZE_W + 111.00)}" height="${(USABLE_CONTENT_SIZE_H + 111.00)}"
            rx="0" ry="0" stroke-width="0" fill="white" opacity="1" />
    </mask>
    <linearGradient id="bordergradient-linear" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="rgba(0, 33, 99, 1)" />
        <stop offset="50%" stop-color="rgba(0, 55, 166, 1)" stop-opacity="0.5" />
        <stop offset="100%" stop-color="rgba(230, 240, 255, 1)" />
    </linearGradient>
    <radialGradient id="bordergradient-radial" cy="42%" fx="45%" fy="20%" r="57%">
        <stop offset="61%" stop-color="rgba(0, 40, 136, 1)" />
        <stop offset="100%" stop-color="rgba(190, 220, 240, 1)" />
    </radialGradient>
    ${SVG_DEFS}
</defs>


<!--
canvas size debug
<rect fill="gray" x="-3535" y="-5000" width="7070" height="10000" />
-->
<rect fill="white" x="-6000" y="-6000" width="12000" height="12000" />

${SVG_CONTENTS_OUTER}
<rect x="-${(USABLE_CONTENT_SIZE_W + 111.00) / 2}" y="-${(USABLE_CONTENT_SIZE_H + 111.00) / 2}"
    width="${(USABLE_CONTENT_SIZE_W + 111.00)}" height="${(USABLE_CONTENT_SIZE_H + 111.00)}"
    rx="0" ry="0" stroke="none" stroke-width="17" fill="white" opacity="1" />

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



fs.writeFileSync(`2024/2024-001/svgout/${PREF}.${PROG}.svg`, OUTPUT_SVG);



// node 2024/2024-001/2024-001.js
