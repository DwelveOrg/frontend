# Dwelve Logo Assets — Exact Shape / Color Matched

This ZIP contains the Dwelve logo assets generated from the uploaded reference image.

## Important

The logo was **not redrawn**. The first horizontal logo in the reference image was used as the master pixel mask. All variants reuse the same extracted shape and alpha mask, then only the RGB colors are changed.

## Sampled colors used

- Ink / Primary Dark: `#0F1537`
- Purple Accent: `#7B58E8`
- Purple Deep: `#6A5DE9`
- Light Background: `#F3F4FF`
- Dark Background: `#14152A`
- White: `#FFFFFF`

## Folders

- `logos/` — SVG logo files. These SVGs embed the exact raster master to preserve the reference shape pixel-for-pixel instead of redrawing paths.
- `png/` — transparent PNG exports.
- `favicon/` — favicon files made from the icon-only logo.
- `app-icons/` — Apple/PWA icons on the light brand background.
- `social/` — Open Graph and Twitter/X preview images.
- `docs/` — updated markdown files with matching brand colors.
- `quality-check/` — method notes and mask verification.

## Website usage

Use `logos/dwelve-logo-horizontal.svg` on light surfaces and `logos/dwelve-logo-horizontal-dark.svg` on dark surfaces. Use the icon-only files only where the full wordmark would be too small, such as favicons, app icons, compact navigation, and PWA metadata.
