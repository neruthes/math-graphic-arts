function makepng () {
    svg_fn="$1"
    png_fn="${svg_fn/.svg/.png}"
    realpath "$png_fn"
    rsvg-convert "$svg_fn" -z0.5 -o "$png_fn"
}
