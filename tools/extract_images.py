#!/usr/bin/env python3
"""
Pecah foto base64 di content/data.json menjadi file gambar WebP terpisah (assets/img/).
Hasilnya data.json kecil (puluhan KB) sehingga halaman terbuka cepat.

Pemakaian (dari folder proyek):
    python tools/extract_images.py                      # memproses content/data.json
    python tools/extract_images.py path/ke/data.json    # file lain

Butuh Pillow:  pip install pillow
Aman dijalankan berulang: foto yang sudah berupa path (assets/img/...) dibiarkan.
"""
import base64, hashlib, io, json, os, re, sys
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else 'content/data.json'
OUT_DIR = 'assets/img'
MAX_SIDE = 1280          # sisi terpanjang foto biasa
MAX_SIDE_HERO = 1920     # foto latar hero
MAX_SIDE_LOGO = 512      # logo
QUALITY = 78

os.makedirs(OUT_DIR, exist_ok=True)
stats = {'n': 0, 'before': 0, 'after': 0}
cache = {}

def convert(data_url, key):
    m = re.match(r'data:image/[\w.+-]+;base64,(.*)', data_url, re.S)
    if not m: return data_url
    raw = base64.b64decode(m.group(1))
    h = hashlib.sha1(raw).hexdigest()[:10]
    if (h, key) in cache: return cache[(h, key)]
    im = Image.open(io.BytesIO(raw)); im.load()
    side = MAX_SIDE_LOGO if key == 'logo' else MAX_SIDE_HERO if key == 'heroBg' else MAX_SIDE
    if max(im.size) > side:
        k = side / max(im.size); im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    has_alpha = im.mode in ('RGBA', 'LA', 'P') and ('transparency' in im.info or im.mode in ('RGBA', 'LA'))
    im = im.convert('RGBA' if has_alpha else 'RGB')
    name = f'{h}.webp'
    path = os.path.join(OUT_DIR, name)
    im.save(path, 'WEBP', quality=62 if key == 'heroBg' else QUALITY, method=6)   # hero tertutup lapisan navy: kualitas boleh lebih rendah
    stats['n'] += 1; stats['before'] += len(raw); stats['after'] += os.path.getsize(path)
    cache[(h, key)] = f'{OUT_DIR}/{name}'
    return cache[(h, key)]

def walk(o, key=''):
    if isinstance(o, str):
        return convert(o, key) if o.startswith('data:image') else o
    if isinstance(o, list): return [walk(x, key) for x in o]
    if isinstance(o, dict): return {k: walk(v, k) for k, v in o.items()}
    return o

with open(SRC, encoding='utf8') as f: data = json.load(f)
before = os.path.getsize(SRC)
data = walk(data)
with open(SRC, 'w', encoding='utf8') as f: json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
print(f'{stats["n"]} foto dipecah: {stats["before"]//1024} KB -> {stats["after"]//1024} KB (WebP)')
print(f'{SRC}: {before//1024} KB -> {os.path.getsize(SRC)//1024} KB')
