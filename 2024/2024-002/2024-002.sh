#!/bin/bash

source utils/shlib.sh



for i in {0..1} 10000; do
    PROG=$i node 2024/2024-002/2024-002.js
done




mkdir -p .tmp
find 2024/2024-002/svgout -name '*.svg' | sort -V | grep -v 10000 > .tmp/svglist
cat .tmp/svglist

lines="$(wc -l .tmp/svglist | cut -d' ' -f1)"
echo "lines=$lines"

is_working=y
heap_ptr=2
cached_lines=""
while [[ $is_working == y ]]; do
    lines="$(head -n$heap_ptr .tmp/svglist | tail -n2)"
    if [[ $heap_ptr -gt 500 ]] || [[ "$cached_lines" == "$lines" ]]; then
        is_working=n
        break
    fi
    cached_lines="$lines"
    f1="$(head -n1 <<< "$lines")"
    f2="$(tail -n1 <<< "$lines")"
    # echo diff "$f1" "$f2"
    diff -s "$f1" "$f2" | grep -sq 'are identical' && rm "$f1"
    heap_ptr=$((heap_ptr+1))
done

find 2024/2024-002/svgout -name '*.svg' | while read -r line; do
    makepng "$line"
done



# bash 2024/2024-002/2024-002.sh
