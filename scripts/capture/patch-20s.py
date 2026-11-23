#!/usr/bin/env python3
"""Replace real club details in the 20-second launch cut with demo ones.

The launch cut (public/media/launch-20s.mp4) was recorded against the app's
BPM Core fixture, so its Home screen shows the club name "BPM Core" and the
venue address. This script tracks the phone header across the video by
template matching, inpaints the title and address, and draws the demo
equivalents ("Thursday Shuttlers", "Northside Community Centre") in the
site's own fonts, scaled with the phone. Audio is copied untouched.

The organisers and stringers cuts were checked frame by frame and carry no
real club details, so they are left as they are.

Usage (from the repo root; needs ffmpeg, Python 3 with opencv-python-headless,
numpy, pillow and fonttools[woff]):
    python3 scripts/capture/patch-20s.py ORIGINAL.mp4 public/media/launch-20s.mp4
The ORIGINAL must be the unpatched launch cut (git show f9146ef:public/media/launch-20s.mp4).
Then regenerate the poster from frame 255 (the frame the original poster was taken from):
    ffmpeg -y -i public/media/launch-20s.mp4 -vf "select=eq(n\\,255)" -vsync 0 -frames:v 1 -c:v libwebp -quality 80 public/media/launch-20s-poster.webp
"""
import json
import os
import subprocess
import sys
import tempfile

import cv2
import numpy as np
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FONT_SRC = os.path.join(ROOT, 'app', 'fonts')

# The phone header in frame 0 (full scale): "BPM Core" title down to the location card.
REF_FRAME = 0
TEMPLATE = (1230, 80, 1460, 260)
MIN_SCORE = 0.6

# Coordinates are relative to TEMPLATE's top-left at scale 1; y is the text baseline.
OPS = [
    {'erase': (6, 4, 170, 37), 'lines': [
        {'text': 'Thursday Shuttlers', 'font': 'SG-700', 'size': 28, 'x': 10, 'y': 32.5}]},
    {'erase': (26, 132, 168, 176), 'thr': 12, 'lines': [
        {'text': 'Northside Community', 'font': 'Plex-400', 'size': 16, 'x': 30, 'y': 147.5, 'dotted': True},
        {'text': 'Centre', 'font': 'Plex-400', 'size': 16, 'x': 30, 'y': 168.5, 'dotted': True}]},
]


def static_fonts(tmp):
    out = {}
    for key, src, wght in [('SG-700', 'SpaceGrotesk.woff2', 700), ('Plex-400', 'IBMPlexSans.woff2', 400)]:
        f = TTFont(os.path.join(FONT_SRC, src))
        f.flavor = None
        if 'fvar' in f:
            f = instancer.instantiateVariableFont(f, {'wght': wght})
        path = os.path.join(tmp, key + '.ttf')
        f.save(path)
        out[key] = path
    return out


def read_frames(path):
    # ffmpeg rather than cv2.VideoCapture, which drops the last frames of these files.
    p = json.loads(subprocess.check_output(
        ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', path]))
    w, h = p['streams'][0]['width'], p['streams'][0]['height']
    dec = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', path, '-map', '0:v', '-vsync', 'passthrough',
                            '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
    size = w * h * 3
    while True:
        buf = dec.stdout.read(size)
        if len(buf) < size:
            dec.wait()
            return
        yield np.frombuffer(buf, np.uint8).reshape(h, w, 3).copy()


def track(path):
    """Best template match (score, scale, x, y) for every frame."""
    frames = read_frames(path)
    ref = None
    d = 0.5
    scales = np.arange(0.40, 1.31, 0.03)
    res, prev = [], None
    for n, frame in enumerate(frames):
        g = cv2.resize(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), None, fx=d, fy=d, interpolation=cv2.INTER_AREA)
        if n == REF_FRAME:
            x0, y0, x1, y1 = TEMPLATE
            ref = cv2.resize(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)[y0:y1, x0:x1], None, fx=d, fy=d, interpolation=cv2.INTER_AREA)
        cand = scales if prev is None else [s for s in scales if abs(s - prev) <= 0.13]
        best = (-1.0, 0.0, 0.0, 0.0)
        for pass_scales in (cand, scales):
            for s in pass_scales:
                t = cv2.resize(ref, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
                if t.shape[0] >= g.shape[0] or t.shape[1] >= g.shape[1] or t.shape[0] < 8:
                    continue
                _, mv, _, ml = cv2.minMaxLoc(cv2.matchTemplate(g, t, cv2.TM_CCOEFF_NORMED))
                if mv > best[0]:
                    best = (mv, s, ml[0] / d, ml[1] / d)
            if best[0] >= MIN_SCORE:
                break
        prev = best[1] if best[0] >= MIN_SCORE else None
        res.append(best)
    return res


def text_mask(roi, thr):
    g = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY).astype(np.int16)
    bg = int(np.median(np.concatenate([g[0], g[-1], g[:, 0], g[:, -1]])))
    m = ((g - bg) > thr).astype(np.uint8) * 255
    return cv2.dilate(m, np.ones((3, 3), np.uint8), iterations=2)


def text_color(roi):
    g = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    ys, xs = np.where(g >= np.percentile(g, 99.3))
    c = np.median(roi[ys, xs], axis=0)
    return int(c[2]), int(c[1]), int(c[0])


def patch(frame, tx, ty, s, fonts):
    h, w = frame.shape[:2]
    for op in OPS:
        x0, y0, x1, y1 = op['erase']
        X0, Y0 = max(0, int(tx + x0 * s)), max(0, int(ty + y0 * s))
        X1, Y1 = min(w, int(np.ceil(tx + x1 * s))), min(h, int(np.ceil(ty + y1 * s)))
        if X1 - X0 < 4 or Y1 - Y0 < 4:
            continue
        roi = frame[Y0:Y1, X0:X1].copy()
        col = text_color(roi)
        frame[Y0:Y1, X0:X1] = cv2.inpaint(roi, text_mask(roi, op.get('thr', 28)), max(3, int(4 * s)), cv2.INPAINT_TELEA)
        pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        draw = ImageDraw.Draw(pil)
        for line in op['lines']:
            font = ImageFont.truetype(fonts[line['font']], max(6, round(line['size'] * s)))
            lx, ly = tx + line['x'] * s, ty + line['y'] * s
            draw.text((lx, ly), line['text'], font=font, fill=col, anchor='ls')
            if line.get('dotted'):
                tw = draw.textlength(line['text'], font=font)
                uy = ly + max(1, round(3 * s))
                step = max(2, round(2 * s))
                dim = tuple(int(c * 0.75) for c in col)
                for xx in np.arange(lx, lx + tw, step * 2):
                    draw.line([(xx, uy), (min(xx + step - 1, lx + tw), uy)], fill=dim, width=1)
        frame[:] = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)
    return frame


def main(src, dst):
    probe = json.loads(subprocess.check_output(
        ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate',
         '-of', 'json', src]))['streams'][0]
    w, h, fps = probe['width'], probe['height'], probe['r_frame_rate']
    with tempfile.TemporaryDirectory() as tmp:
        fonts = static_fonts(tmp)
        hits = track(src)
        patched = [n for n, b in enumerate(hits) if b[0] >= MIN_SCORE]
        print(f'patching {len(patched)} frames: {patched[:3]}...{patched[-3:]}', file=sys.stderr)
        out = os.path.join(tmp, 'out.mp4')
        enc = subprocess.Popen([
            'ffmpeg', '-loglevel', 'error', '-y',
            '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{w}x{h}', '-r', fps, '-i', '-',
            '-i', src, '-map', '0:v', '-map', '1:a', '-c:a', 'copy',
            '-c:v', 'libx264', '-crf', '22', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
            out], stdin=subprocess.PIPE)
        for n, frame in enumerate(read_frames(src)):
            score, s, x, y = hits[n]
            if score >= MIN_SCORE:
                patch(frame, x, y, s, fonts)
            enc.stdin.write(frame.tobytes())
        enc.stdin.close()
        if enc.wait() != 0:
            sys.exit('ffmpeg failed')
        os.replace(out, dst)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
