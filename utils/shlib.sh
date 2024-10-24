function makepng () {
    svg_fn="$1"
    png_fn="${svg_fn/.svg/.png}"
    realpath "$png_fn"
    rsvg-convert "$svg_fn" -o "$png_fn"
}

function makepdf () {
    svg_fn="$1"
    pdf_fn="${svg_fn/.svg/.pdf}"
    realpath "$pdf_fn"
    rsvg-convert "$svg_fn" --format=pdf -o "$pdf_fn"
}
