# Quality Check

- Source image: `74280e54-6bc0-4ff6-956f-e2ee27875260.png`
- Master crop box: `(133, 166, 719, 304)`
- Master dimensions: `586x138`
- Method: extract alpha mask from the uploaded reference image, classify existing pixels as main ink or purple page, then recolor only RGB channels.
- Shape policy: no vector path reconstruction, no manual icon redrawing, no wordmark retyping.
- All horizontal variants use the same master alpha mask.
- Icon and wordmark assets are cropped from that same master mask.

This means the logo shape is preserved from the reference crop. The SVG files intentionally embed the raster master so the shape is not reinterpreted by a vector redraw.
