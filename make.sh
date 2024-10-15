#!/bin/bash

source utils/shlib.sh

case $1 in
    20*/20*-*/svgout/*.svg)
        makepng "$1"
        ;;
esac
