#rm *.png
for f in *.pdf; do convert -thumbnail x400 -background white -alpha remove "$f"[7] "${f%.pdf}.png"; done
echo Thumbnails Generated.
