/* Open-canvas gallery. You shouldn't need to edit this file —
   change your photos and text in content.js instead. */
(function () {
  'use strict';
  var SITE = window.SITE || { photos: [], projects: {} };
  var SHAPES = window.STAMP_SHAPES || {};
  var ICONS = window.STAMP_ICONS || {};
  var COLORS = { black: '#111111', red: '#D7263D', blue: '#1F4FD6', yellow: '#F2B705', white: '#FFFFFF' };
  var COLOR_ORDER = ['black', 'red', 'blue', 'yellow', 'white'];
  var SHAPE_ORDER = ['star', 'sparkle', 'shine'];
  var W = 5000, H = 3600, MIN = 0.0005, MAX = 2.5;
  var STORE = 'portfolio-canvas-v1';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var vp = document.getElementById('viewport');
  var world = document.getElementById('world');
  var ink = document.getElementById('ink');
  var $ = function (id) { return document.getElementById(id); };

  // Site text
  document.querySelectorAll('[data-site]').forEach(function (el) {
    el.textContent = SITE[el.getAttribute('data-site')] || '';
  });
  if (SITE.name) document.title = SITE.name;

  // ---------- Build photos ----------
  var tiles = [];
  SITE.photos.forEach(function (p, i) {
    var a = document.createElement('a');
    a.className = 'tile';
    a.href = 'project.html?p=' + encodeURIComponent(p.project || '');
    a.style.left = p.x + 'px';
    a.style.top = p.y + 'px';
    a.style.width = p.width + 'px';
    a.dataset.index = i;
    var ph = document.createElement('div');
    ph.className = 'ph';
    var img = document.createElement('img');
    img.src = p.image;
    img.alt = p.title || '';
    img.draggable = false;
    img.decoding = 'async';
    ph.appendChild(img);
    ['nw', 'ne', 'sw', 'se'].forEach(function (c) {
      var g = document.createElement('span');
      g.className = 'grip'; g.dataset.c = c; g.setAttribute('aria-hidden', 'true');
      ph.appendChild(g);
    });
    var cap = document.createElement('span');
    cap.className = 'cap';
    cap.textContent = String(i + 1).padStart(2, '0') + ' · ' + (p.title || '');
    a.appendChild(ph);
    a.appendChild(cap);
    world.insertBefore(a, ink);
    tiles.push({ el: a, ph: ph, cap: cap, origW: p.width, off: { x: 0, y: 0 }, w: p.width });
  });

  // ---------- View (pan / zoom) ----------
  var v = { tx: 0, ty: 0, s: 1 };
  var raf = null;
  function clamp(s) { return Math.min(MAX, Math.max(MIN, s)); }
  function size() { return { w: vp.clientWidth, h: vp.clientHeight }; }
  function apply(nv) {
    v = nv;
    world.style.transform = 'translate(' + v.tx + 'px,' + v.ty + 'px) scale(' + v.s + ')';
    $('zoomLabel').textContent = (v.s >= 0.1 ? Math.round(v.s * 100) : v.s >= 0.01 ? (v.s * 100).toFixed(1) : (v.s * 100).toFixed(2)) + '%';
    save();
  }
  function stopAnim() { if (raf) cancelAnimationFrame(raf); raf = null; }
  function animateTo(t, dur) {
    stopAnim();
    if (reduce) { apply(t); return; }
    dur = dur || 750;
    var z = size(), a = v;
    var ca = { x: (z.w / 2 - a.tx) / a.s, y: (z.h / 2 - a.ty) / a.s };
    var cb = { x: (z.w / 2 - t.tx) / t.s, y: (z.h / 2 - t.ty) / t.s };
    var ls = Math.log(a.s), lt = Math.log(t.s), t0 = performance.now();
    var ease = function (p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur), k = ease(p);
      var sc = Math.exp(ls + (lt - ls) * k);
      var cx = ca.x + (cb.x - ca.x) * k, cy = ca.y + (cb.y - ca.y) * k;
      apply({ s: sc, tx: z.w / 2 - cx * sc, ty: z.h / 2 - cy * sc });
      raf = p < 1 ? requestAnimationFrame(step) : null;
    })(t0);
  }
  function zoomAt(px, py, f) {
    var ns = clamp(v.s * f), wx = (px - v.tx) / v.s, wy = (py - v.ty) / v.s;
    apply({ s: ns, tx: px - wx * ns, ty: py - wy * ns });
  }
  var target = null;
  function zoomAnimated(f) {
    var z = size(), base = raf && target ? target : v;
    var ns = clamp(base.s * f), wx = (z.w / 2 - base.tx) / base.s, wy = (z.h / 2 - base.ty) / base.s;
    target = { s: ns, tx: z.w / 2 - wx * ns, ty: z.h / 2 - wy * ns };
    animateTo(target, 350);
  }
  function centerOn(s, animate) {
    var z = size();
    var t = { s: s, tx: z.w / 2 - (W / 2) * s, ty: z.h / 2 - (H / 2) * s };
    if (animate) animateTo(t); else apply(t);
  }
  function toWorld(cx, cy) {
    var r = vp.getBoundingClientRect();
    return { x: (cx - r.left - v.tx) / v.s, y: (cy - r.top - v.ty) / v.s };
  }

  // ---------- Stamps ----------
  var stamps = [], penOn = false, shape = 'sparkle', color = 'black';
  var NS = 'http://www.w3.org/2000/svg';
  function drawStamp(k, fresh) {
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('transform', 'translate(' + k.x + ' ' + k.y + ') rotate(' + k.r + ') scale(' + k.k + ')');
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', SHAPES[k.s] || SHAPES.star);
    p.setAttribute('fill', k.hex || COLORS[k.c] || COLORS.black);
    if (fresh) p.setAttribute('class', 'stamp');
    g.appendChild(p);
    ink.appendChild(g);
  }
  function redrawStamps() { ink.innerHTML = ''; stamps.forEach(function (k) { drawStamp(k, false); }); }
  function updateTools() {
    var icon = ICONS[shape] || ICONS.star;
    $('stampIcon').setAttribute('d', icon);
    $('stampIcon').setAttribute('fill', penOn ? '#111111' : 'none');
    $('stamp').setAttribute('aria-pressed', penOn ? 'true' : 'false');
    $('clear').hidden = stamps.length === 0;
    vp.classList.toggle('pen-on', penOn);
    var cur = penOn ? 'url(cursors/' + shape + '-black.svg) 22 22, crosshair' : '';
    vp.style.cursor = cur;
    tiles.forEach(function (t) {
      t.el.style.cursor = cur;
      t.cap.style.cursor = cur;
      t.ph.querySelectorAll('.grip').forEach(function (g) { g.style.cursor = cur; });
    });
  }

  // Stamp color comes from the photo under the click (black on empty canvas)
  var sampler = document.createElement('canvas');
  sampler.width = sampler.height = 9;
  var sctx = sampler.getContext('2d', { willReadFrequently: true });
  function sampleColor(e) {
    var ph = e.target.closest && e.target.closest('.tile .ph');
    var img = ph && ph.querySelector('img');
    if (!img || !img.naturalWidth) return '#111111';
    try {
      var r = img.getBoundingClientRect();
      var fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      var sw = img.naturalWidth * 0.04, sh = img.naturalHeight * 0.04;
      sctx.clearRect(0, 0, 9, 9);
      sctx.drawImage(img, Math.max(0, fx * img.naturalWidth - sw / 2), Math.max(0, fy * img.naturalHeight - sh / 2), sw, sh, 0, 0, 9, 9);
      var d = sctx.getImageData(0, 0, 9, 9).data, R = 0, G = 0, B = 0, n = 0;
      for (var i = 0; i < d.length; i += 4) { R += d[i]; G += d[i + 1]; B += d[i + 2]; n++; }
      R /= n; G /= n; B /= n;
      var avg = (R + G + B) / 3;
      var sat = function (c) { return Math.max(0, Math.min(255, avg + (c - avg) * 1.8)); };
      R = sat(R); G = sat(G); B = sat(B);
      var lum = (0.299 * R + 0.587 * G + 0.114 * B) / 255;
      var adj = function (c) { return Math.round(lum > 0.5 ? c * 0.42 : c + (255 - c) * 0.65); };
      return 'rgb(' + adj(R) + ',' + adj(G) + ',' + adj(B) + ')';
    } catch (err) { return '#111111'; }
  }

  // ---------- Saving (so "back" from a project restores the canvas) ----------
  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        sessionStorage.setItem(STORE, JSON.stringify({
          v: v,
          tiles: tiles.map(function (t) { return { x: t.off.x, y: t.off.y, w: t.w }; }),
          stamps: stamps, shape: shape, color: color, pen: penOn
        }));
      } catch (e) {}
    }, 150);
  }
  function restore() {
    try {
      var d = JSON.parse(sessionStorage.getItem(STORE) || 'null');
      if (!d || !d.v) return false;
      (d.tiles || []).forEach(function (s, i) {
        var t = tiles[i]; if (!t || !s) return;
        t.off = { x: s.x || 0, y: s.y || 0 };
        t.w = s.w || t.origW;
        t.el.style.width = t.w + 'px';
        if (t.off.x || t.off.y) t.el.style.transform = 'translate(' + t.off.x + 'px,' + t.off.y + 'px)';
      });
      stamps = d.stamps || [];
      shape = 'sparkle'; color = d.color || 'black'; penOn = !!d.pen;
      redrawStamps();
      apply(d.v);
      return true;
    } catch (e) { return false; }
  }

  // ---------- Pointer: pan, drag, resize, pinch ----------
  var ptrs = new Map(), z = 10;
  var moved = false, sx = 0, sy = 0, start = null, tile = null, base = null, cur = null, pinch = null, sizing = null;
  function tileOf(el) {
    var a = el.closest && el.closest('.tile');
    return a ? tiles[+a.dataset.index] : null;
  }
  function beginSingle(p) { sx = p.x; sy = p.y; start = { tx: v.tx, ty: v.ty, s: v.s }; }

  vp.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    stopAnim();
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 1) {
      moved = false; tile = null; sizing = null;
      beginSingle({ x: e.clientX, y: e.clientY });
      if (penOn) return;
      tile = tileOf(e.target);
      if (tile && e.target.closest('.grip')) {
        var ph = tile.ph;
        sizing = { w: tile.el.offsetWidth, ratio: ph.offsetWidth / ph.offsetHeight, c: e.target.closest('.grip').dataset.c };
        base = { x: tile.off.x, y: tile.off.y }; cur = base;
      } else if (tile) {
        base = { x: tile.off.x, y: tile.off.y }; cur = base;
      }
    } else if (ptrs.size === 2) {
      if (tile && moved) finishTile();
      tile = null; sizing = null; moved = true;
      var pts = Array.from(ptrs.values()), a = pts[0], b = pts[1];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, v: { tx: v.tx, ty: v.ty, s: v.s } };
    }
  });

  function finishTile() {
    if (!tile) return;
    tile.off = cur;
    tile.w = tile.el.offsetWidth;
    tile.el.classList.remove('lifted', 'resizing');
    save();
  }

  window.addEventListener('pointermove', function (e) {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size >= 2 && pinch) {
      var pts = Array.from(ptrs.values()), a = pts[0], b = pts[1];
      var d = Math.hypot(a.x - b.x, a.y - b.y) || 1, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      var ns = clamp(pinch.v.s * d / pinch.d);
      var wx = (pinch.mx - pinch.v.tx) / pinch.v.s, wy = (pinch.my - pinch.v.ty) / pinch.v.s;
      apply({ s: ns, tx: mx - wx * ns, ty: my - wy * ns });
      return;
    }
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (!moved && Math.abs(dx) + Math.abs(dy) > 5) {
      moved = true;
      if (tile) {
        tile.el.style.zIndex = String(++z);
        tile.el.classList.add(sizing ? 'resizing' : 'lifted');
      } else {
        vp.classList.add('panning');
      }
    }
    if (!moved) return;
    if (tile && sizing) {
      var hx = sizing.c.indexOf('e') >= 0 ? 1 : -1, hy = sizing.c.indexOf('s') >= 0 ? 1 : -1;
      var dd = (hx * dx + hy * dy * sizing.ratio) / 2 / start.s;
      var nw = Math.max(120, Math.min(1600, sizing.w + dd));
      var dw = nw - sizing.w, dh = dw / sizing.ratio;
      cur = { x: base.x - (hx < 0 ? dw : 0), y: base.y - (hy < 0 ? dh : 0) };
      tile.el.style.width = nw + 'px';
      tile.el.style.transform = 'translate(' + cur.x + 'px,' + cur.y + 'px)';
      tile.cap.setAttribute('data-size', Math.round(nw / tile.origW * 100) + '%');
    } else if (tile) {
      cur = { x: base.x + dx / start.s, y: base.y + dy / start.s };
      tile.el.style.transform = 'translate(' + cur.x + 'px,' + cur.y + 'px)';
    } else {
      apply({ s: start.s, tx: start.tx + dx, ty: start.ty + dy });
    }
  });

  function up(e) {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.delete(e.pointerId);
    if (tile && moved) finishTile();
    tile = null; sizing = null;
    if (ptrs.size === 1) {
      pinch = null;
      beginSingle(Array.from(ptrs.values())[0]);
    } else if (ptrs.size === 0) {
      pinch = null;
      vp.classList.remove('panning');
    }
  }
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);

  vp.addEventListener('wheel', function (e) {
    e.preventDefault();
    stopAnim();
    var f = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015));
    var r = vp.getBoundingClientRect();
    zoomAt(e.clientX - r.left, e.clientY - r.top, f);
  }, { passive: false });

  // Clicks: single click on a photo lifts it, double click opens, caption opens.
  document.addEventListener('click', function (e) {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; return; }
    if (e.target.closest('button') || e.target.closest('.top')) return;
    if (penOn) {
      e.preventDefault(); e.stopPropagation();
      var p = toWorld(e.clientX, e.clientY);
      var k = { x: Math.round(p.x), y: Math.round(p.y), s: shape, hex: sampleColor(e), r: Math.round(Math.random() * 30 - 15), k: Math.round(20 / v.s * 10) / 10 };
      stamps.push(k); drawStamp(k, true); updateTools(); save();
      return;
    }
    var ph = e.target.closest('.tile .ph');
    if (!ph || e.detail >= 2) return;
    e.preventDefault(); e.stopPropagation();
    var a = ph.closest('.tile');
    a.style.zIndex = String(++z);
    a.classList.add('pop');
    clearTimeout(a._pop);
    a._pop = setTimeout(function () { a.classList.remove('pop'); }, 230);
  }, true);
  document.addEventListener('dragstart', function (e) { e.preventDefault(); });

  // ---------- Toolbar ----------
  $('zoomIn').onclick = function () { zoomAnimated(1.4); };
  $('zoomOut').onclick = function () { zoomAnimated(1 / 1.4); };
  $('seeAll').onclick = function () { var s = size(); centerOn(clamp(Math.min(s.w / W, s.h / H) * 0.95), true); };
  $('center').onclick = function () { centerOn(1, true); };
  $('stamp').onclick = function () {
    penOn = !penOn;
    shape = 'sparkle';
    updateTools(); save();
  };
  function clearStamps(fade) {
    if (!stamps.length) return;
    var done = function () { stamps = []; ink.innerHTML = ''; vp.classList.remove('clearing'); updateTools(); save(); };
    if (fade && !reduce) { vp.classList.add('clearing'); setTimeout(done, 520); } else done();
  }
  $('clear').onclick = function () { clearStamps(false); };
  var resetEnd = null;
  $('reset').onclick = function () {
    clearStamps(true);
    var changed = tiles.filter(function (t) { return t.off.x || t.off.y || t.w !== t.origW; });
    var spread = changed.length > 1 ? Math.min(160, 25 * (changed.length - 1)) : 0;
    tiles.forEach(function (t) {
      var c = changed.indexOf(t) >= 0;
      t.el.classList.add('resetting');
      t.el.style.transitionDelay = c ? Math.round(Math.random() * spread) + 'ms' : '0ms';
      t.el.style.transform = '';
      t.el.style.width = t.origW + 'px';
      t.off = { x: 0, y: 0 }; t.w = t.origW;
    });
    clearTimeout(resetEnd);
    resetEnd = setTimeout(function () {
      tiles.forEach(function (t) { t.el.classList.remove('resetting'); t.el.style.transitionDelay = ''; t.el.style.zIndex = ''; });
    }, 1150 + spread);
    save();
  };

  // ---------- Start ----------
  if (!restore()) {
    centerOn(1);
    if (!reduce && tiles[0]) {
      setTimeout(function () {
        tiles[0].el.classList.add('nudge');
        setTimeout(function () { tiles[0].el.classList.remove('nudge'); }, 1200);
      }, 1400);
    }
  }
  updateTools();
})();
