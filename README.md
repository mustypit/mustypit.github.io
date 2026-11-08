# Portfolio

A photography portfolio on an open canvas: visitors pan, zoom, move and resize photos, stamp stars, and open projects.

Live at **https://mustypit.github.io**

## Editing your content

Everything you need to change is in **`content.js`**:

- `name`, `tagline`, `email`: your details.
- `photos`: one line per photo on the canvas.
  - `image`: the file in the `images` folder.
  - `title`: caption under the photo.
  - `project`: which project page it opens.
  - `x`, `y`: position on the canvas (5000 × 3600; the centre is x 2500, y 1800).
  - `width`: size in pixels. Height follows the photo's shape.
- `projects`: the text, details and images for each project page.

## Adding photos

1. Export them as `.jpg`, about 2000px on the long side.
2. Upload them to the `images` folder on GitHub (Add file → Upload files).
3. Add or change the matching line in `content.js` and commit.

The site updates by itself within a minute or two.

## Files

- `index.html`: the canvas gallery
- `project.html`: the project page
- `content.js`: your content
- `css/style.css`: the look
- `js/canvas.js`: the canvas behaviour
- `js/shapes.js`, `cursors/`: the stamp shapes
