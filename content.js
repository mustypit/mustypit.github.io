/* ============================================================
   YOUR CONTENT — this is the only file you need to edit.
   ============================================================
   • name / tagline / email: shown on the site.
   • photos: every picture on the canvas.
       image   → the file in the "images" folder
       title   → caption under the photo
       project → which project page it opens (see "projects" below)
       x, y    → position on the canvas (the canvas is 5000 × 3600;
                 the centre is x 2500, y 1800)
       width   → size in pixels (height follows the photo's shape)
     The order of the list is the order of the numbers (01, 02…).
   • projects: one entry per project page.
   Tip: export photos about 2000px on the long side, as .jpg.
   ============================================================ */

window.SITE = {
  name: "[YOUR NAME]",
  tagline: "Photography & film",
  email: "you@example.com",

  photos: [
    { image: "images/01.jpg", title: "[Project title]", project: "project-1", x: 1880, y: 1420, width: 420 },
    { image: "images/02.jpg", title: "[Project title]", project: "project-2", x: 2760, y: 1380, width: 300 },
    { image: "images/03.jpg", title: "[Project title]", project: "project-3", x: 2000, y: 1900, width: 280 },
    { image: "images/04.jpg", title: "[Project title]", project: "project-4", x: 2700, y: 1960, width: 480 },
    { image: "images/05.jpg", title: "[Project title]", project: "project-5", x: 1200, y: 1000, width: 360 },
    { image: "images/06.jpg", title: "[Project title]", project: "project-6", x: 2200, y: 950, width: 460 },
    { image: "images/07.jpg", title: "[Project title]", project: "project-1", x: 3300, y: 1050, width: 380 },
    { image: "images/08.jpg", title: "[Project title]", project: "project-2", x: 3500, y: 1700, width: 420 },
    { image: "images/09.jpg", title: "[Project title]", project: "project-3", x: 1150, y: 1750, width: 480 },
    { image: "images/10.jpg", title: "[Project title]", project: "project-4", x: 1500, y: 2250, width: 340 },
    { image: "images/11.jpg", title: "[Project title]", project: "project-5", x: 2350, y: 2350, width: 520 },
    { image: "images/12.jpg", title: "[Project title]", project: "project-6", x: 3200, y: 2300, width: 300 },
    { image: "images/13.jpg", title: "[Project title]", project: "project-1", x: 200, y: 200, width: 600 },
    { image: "images/14.jpg", title: "[Project title]", project: "project-2", x: 1900, y: 250, width: 420 },
    { image: "images/15.jpg", title: "[Project title]", project: "project-3", x: 3000, y: 200, width: 500 },
    { image: "images/16.jpg", title: "[Project title]", project: "project-4", x: 4200, y: 300, width: 440 },
    { image: "images/17.jpg", title: "[Project title]", project: "project-5", x: 250, y: 1300, width: 420 },
    { image: "images/18.jpg", title: "[Project title]", project: "project-6", x: 4250, y: 1400, width: 520 },
    { image: "images/19.jpg", title: "[Project title]", project: "project-1", x: 300, y: 2400, width: 500 },
    { image: "images/20.jpg", title: "[Project title]", project: "project-2", x: 1100, y: 3000, width: 600 },
    { image: "images/21.jpg", title: "[Project title]", project: "project-3", x: 2600, y: 3000, width: 420 },
    { image: "images/22.jpg", title: "[Project title]", project: "project-4", x: 3600, y: 2950, width: 380 },
    { image: "images/23.jpg", title: "[Project title]", project: "project-5", x: 4300, y: 2400, width: 520 },
  ],

  projects: {
    "project-1": {
      title: "[Project title]",
      year: "[2025]",
      location: "[City, Country]",
      client: "[Personal / Client name]",
      camera: "[Camera, film or lens]",
      text: "[Two or three sentences about the project: where you shot it, why, and what you were looking for.]",
      images: ["images/04.jpg", "images/05.jpg", "images/06.jpg", "images/07.jpg"],
      video: ""   // optional: a YouTube or Vimeo embed link, e.g. "https://player.vimeo.com/video/123456"
    },
    "project-2": {
      title: "[Project title]",
      year: "[2025]",
      location: "[City, Country]",
      client: "[Personal / Client name]",
      camera: "[Camera, film or lens]",
      text: "[Two or three sentences about the project: where you shot it, why, and what you were looking for.]",
      images: ["images/07.jpg", "images/08.jpg", "images/09.jpg", "images/10.jpg"],
      video: ""   // optional: a YouTube or Vimeo embed link, e.g. "https://player.vimeo.com/video/123456"
    },
    "project-3": {
      title: "[Project title]",
      year: "[2025]",
      location: "[City, Country]",
      client: "[Personal / Client name]",
      camera: "[Camera, film or lens]",
      text: "[Two or three sentences about the project: where you shot it, why, and what you were looking for.]",
      images: ["images/10.jpg", "images/11.jpg", "images/12.jpg", "images/13.jpg"],
      video: ""   // optional: a YouTube or Vimeo embed link, e.g. "https://player.vimeo.com/video/123456"
    },
    "project-4": {
      title: "[Project title]",
      year: "[2025]",
      location: "[City, Country]",
      client: "[Personal / Client name]",
      camera: "[Camera, film or lens]",
      text: "[Two or three sentences about the project: where you shot it, why, and what you were looking for.]",
      images: ["images/13.jpg", "images/14.jpg", "images/15.jpg", "images/16.jpg"],
      video: ""   // optional: a YouTube or Vimeo embed link, e.g. "https://player.vimeo.com/video/123456"
    },
    "project-5": {
      title: "[Project title]",
      year: "[2025]",
      location: "[City, Country]",
      client: "[Personal / Client name]",
      camera: "[Camera, film or lens]",
      text: "[Two or three sentences about the project: where you shot it, why, and what you were looking for.]",
      images: ["images/16.jpg", "images/17.jpg", "images/18.jpg", "images/19.jpg"],
      video: ""   // optional: a YouTube or Vimeo embed link, e.g. "https://player.vimeo.com/video/123456"
    },
    "project-6": {
      title: "[Project title]",
      year: "[2025]",
      location: "[City, Country]",
      client: "[Personal / Client name]",
      camera: "[Camera, film or lens]",
      text: "[Two or three sentences about the project: where you shot it, why, and what you were looking for.]",
      images: ["images/19.jpg", "images/20.jpg", "images/21.jpg", "images/22.jpg"],
      video: ""   // optional: a YouTube or Vimeo embed link, e.g. "https://player.vimeo.com/video/123456"
    },
  }
};
