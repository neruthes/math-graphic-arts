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



    SVG_DEFS += `<g id="core_knot1_body">` + (function () {
        let result = '';
        result += `<path transform="rotate(90)" fill="none" stroke="white" stroke-linejoin="round" stroke-linecap="round" stroke-width="24" d="M 0 10 c 20,0 30,10 30,30 l 0 233.33" />`;//Right stick, main body
        result += `<rect transform="rotate(45)" fill="none" rx="40" ry="40"
        stroke="black" stroke-linejoin="round" stroke-linecap="round" stroke-width="50"
        x="-90" y="-90" width="180" height="180" />`;//Outer ring, black shadow
        result += `<rect transform="rotate(45)" fill="none" rx="40" ry="40"
        stroke="white" stroke-linejoin="round" stroke-linecap="round" stroke-width="24"
        x="-90" y="-90" width="180" height="180" />`;//Outer ring, white ring body
        result += `<path fill="none" stroke="black" stroke-linejoin="round" stroke-linecap="round" stroke-width="40" d="M 0 10 c -20,0 -30,10 -30,30 l 0 233.33" />`;//Left stick, black shadow
        result += `<rect transform="rotate(45)" fill="white" rx="20" ry="20"
        stroke="blue" stroke-linejoin="round" stroke-linecap="round" stroke-width="0"
        x="-66" y="-66" width="132" height="132" />`;//Inner body
        result += `<path fill="none" stroke="black" stroke-linejoin="round" stroke-linecap="round" stroke-width="36" d="M 0 60 l 0 20 M -60,0 l -20,0" />`;//Crescent under
        result += `<path fill="none" stroke="white" stroke-linejoin="round" stroke-linecap="round" stroke-width="24" d="M 0 10 c -20,0 -30,10 -30,30 l 0 233.33" />`;//Left stick, main body
        result += `<circle cx="0" cy="0" r="20" fill="black" />`; // Middle hole
        return result;
    })() + `</g>\n`;


    for (let xx = -22; xx <= 22; xx += 1) {
        for (let yy = -22; yy <= 22; yy += 1) {
            SVG_CONTENTS_OUTER += `<rect transform="translate(${xx * 270}, ${yy * 270})" x="-136" y="-136" width="272" height="272" fill="white" mask="url(#knot1_symbol_as_mask)" />\n`
        }
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
    <mask id="core_knot1_mask_quarter">
        <rect x="-141" y="-1"
            width="142" height="142"
            rx="0" ry="0" stroke-width="0" fill="white" opacity="1" />
    </mask>
    <g id="knot1_real">
        <use href="#core_knot1_body" mask="url(#core_knot1_mask_quarter)" transform="rotate(000)" />
        <use href="#core_knot1_body" mask="url(#core_knot1_mask_quarter)" transform="rotate(090)" />
        <use href="#core_knot1_body" mask="url(#core_knot1_mask_quarter)" transform="rotate(180)" />
        <use href="#core_knot1_body" mask="url(#core_knot1_mask_quarter)" transform="rotate(270)" />
    </g>
    <mask id="knot1_symbol_as_mask">
        <rect x="-200" y="-200" width="400" height="400" fill="black" />
        <use href="#knot1_real" transform="rotate(000)" />
    </mask>
    ${SVG_DEFS}
</defs>


<!--
canvas size debug
<rect fill="gray" x="-2500" y="-2500" width="5000" height="5000" />
-->
<rect fill="#112233" x="-2500" y="-2500" width="5000" height="5000" />


${SVG_CONTENTS_OUTER}
<rect x="-${(USABLE_CONTENT_SIZE_W + 111.00) / 2}" y="-${(USABLE_CONTENT_SIZE_H + 111.00) / 2}"
    width="${(USABLE_CONTENT_SIZE_W + 111.00)}" height="${(USABLE_CONTENT_SIZE_H + 111.00)}"
    rx="0" ry="0" stroke="none" stroke-width="17" fill="white" opacity="0" />

<g mask="url(#contentsizebox-mask)">
    ${SVG_CONTENTS_INNER}
</g>

<use href="#contentsizebox" stroke="${COLOR1}" stroke-width="35" fill="none" opacity="1" />

${SVG_CONTENTS_OVERLAY}


<!-- Symbol knot1_real debug
<use href="#knot1_real" />
-->

<!--
gradient debug
<rect opacity="1" x="0" y="0" width="2000" height="2000" fill="url(#bordergradient-radial)" />
-->




</svg>`;



    fs.writeFileSync(`2024/2024-006/svgout/${PREF}.${PROG}.svg`, OUTPUT_SVG);








})();

/*
node 2024/2024-006/2024-006.js
sh 2024/2024-006/2024-006.sh
*/
