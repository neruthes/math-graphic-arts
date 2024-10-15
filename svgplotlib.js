/*
    File name: svgplotlib.js
    Copyright (c) 2023-2024 Neruthes.
    This file is released with the MIT license.
*/

function drawstar(opt) {
    let myshape_POINTS = [];
    const VERTEX_QTY = opt.vert;
    for (let itr = 0; itr < VERTEX_QTY; itr += 1) {
        const vertexDistance = (itr % 2 === 0) ? opt.long : opt.short;
        const theta_rad = Math.PI * 2 / VERTEX_QTY * itr;
        const x1 = Math.floor(100 * vertexDistance * Math.sin(theta_rad)) / 100;
        const y1 = Math.floor(100 * vertexDistance * Math.cos(theta_rad)) / 100;
        myshape_POINTS.push(x1, y1);
    };
    const DEFAULT_ATTRS = {
        'stroke-width': '1.00'
    };
    let attrs = ''
    if (opt.attrs) {
        let new_attr_obj = {};
        Object.keys(DEFAULT_ATTRS).map(function (attrname) { new_attr_obj[attrname] = DEFAULT_ATTRS[attrname] }); // Initialize content
        Object.keys(opt.attrs).map(function (attrname) { new_attr_obj[attrname] = opt.attrs[attrname] }); // Overwrite
        attrs = Object.keys(new_attr_obj).map(function (attrname) {
            return `  ${attrname}="${new_attr_obj[attrname]}"  `;
        }).join(' ');
    } else {
        attrs = Object.keys(DEFAULT_ATTRS).map(function (attrname) {
            return `  ${attrname}="${DEFAULT_ATTRS[attrname]}"  `;
        }).join(' ');
    };
    let tmpnode = `<polygon ${attrs} points="${myshape_POINTS.join(' ')}" />`;
    return tmpnode;
};

function drawpolarcircle(opt) {
    let myshape_POINTS = [];
    for (let itr = 0; itr < 360; itr += opt.step || 1) {
        const theta_rad = itr / 360 * Math.PI * 2;
        const vertexDistance = opt.func(theta_rad);
        const x1 = Math.round(100 * vertexDistance * Math.sin(theta_rad)) / 100;
        const y1 = Math.round(100 * vertexDistance * Math.cos(theta_rad)) / 100;
        myshape_POINTS.push(x1, y1);
    };
    const DEFAULT_ATTRS = {
        'stroke-width': '1.00'
    };
    let attrs = ''
    if (opt.attrs) {
        let new_attr_obj = Object.assign({}, DEFAULT_ATTRS, opt.attrs);
        attrs = flatten_attr_obj(new_attr_obj);
    } else {
        attrs = flatten_attr_obj(DEFAULT_ATTRS);
    };
    let tmpnode = `<polygon ${attrs} points="${myshape_POINTS.join(' ')}" />`;
    return tmpnode;
};


function flatten_attr_obj(attr_obj) {
    return Object.keys(attr_obj).map(function (attrname) {
        return ` ${attrname}="${attr_obj[attrname]}" `;
    }).join('');
};

module.exports = { drawstar, drawpolarcircle };
