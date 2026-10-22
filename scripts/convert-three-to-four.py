# -*- coding: utf-8 -*-
# 2026-10-22 用户定：bedding 三件套（classifySet='three'）全量改四件套口径（被套+床笠+2枕套）。
# 转换 materials-map.ts / products-materials.ts / short-titles.ts / materials-short-bullets.ts 中
# 相关 ASIN 的 title/bullets/description/descriptionHtml/短标题/短卖点：
#   1) 3 Piece/3-Piece/3 Pcs/Set of 3 → 4 Piece/4-Piece/4 Pcs/Set of 4
#   2) 内容物清单插入 fitted sheet（美式床型按全店四件套真实规格表；
#      1688 cm 家族按被套短边 ≤180→99x191 / ≤210→152x203 / 以上→198x203 cm）
#   3) "sheets are not included" 类文案改为床笠已包含
#   4) products-materials.ts 里缎面 1688 家族的陈旧"仅被套"基础描述（运行时被 MATERIALS_MAP 覆盖、
#      不上前台）同步改写为四件套口径，避免原始数据自相矛盾
# 幂等：已含 fitted sheet 的文本跳过插入。保留原文件 CRLF/LF 行尾。
# 用法：python scripts/convert-three-to-four.py [--apply]
import json, re, sys

APPLY = '--apply' in sys.argv
ROOT = 'src/data/'

PREFIXES = ('duvset-', 'linen3-', '1688-916370884976', 'percale-', '1688-1048207560416', '1688-1061371343572')
def is_three(asin):
    a = asin.lower()
    if a.endswith('-duvet'):
        return False
    return any(a.startswith(p) for p in PREFIXES)

FITTED_IN = {'TWIN': '39 x 75 in', 'FULL': '54 x 75 in', 'QUEEN': '60 x 80 in', 'KING': '78 x 80 in'}
def fitted_cm(w):
    return '99 x 191 cm' if w <= 180 else ('152 x 203 cm' if w <= 210 else '198 x 203 cm')

def size_of(asin):
    last = asin.split('-')[-1].upper()
    return last if last in FITTED_IN else None

def is_cm_family(asin):
    return size_of(asin) is None

def cm_width_of(text, default=200):
    m = re.search(r'duvet cover[^.]{0,40}?(\d+)\s*x\s*(\d+)\s*cm', text, re.I)
    return min(int(m.group(1)), int(m.group(2))) if m else default

PIECE_REPLACEMENTS = [
    ('3-PIECE', '4-PIECE'), ('3-Piece', '4-Piece'), ('3-piece', '4-piece'),
    ('3 PIECES', '4 PIECES'), ('3 Pieces', '4 Pieces'), ('3 pieces', '4 pieces'),
    ('3 PIECE', '4 PIECE'), ('3 Piece', '4 Piece'), ('3 piece', '4 piece'),
    ('3 PCS', '4 PCS'), ('3 Pcs', '4 Pcs'), ('3 pcs', '4 pcs'),
    ('Set of 3', 'Set of 4'), ('set of 3', 'set of 4'),
]

def transform(text, asin):
    if not text:
        return text
    size = size_of(asin)
    fit = FITTED_IN.get(size) if size else fitted_cm(cm_width_of(text))
    t = text
    for old, new in PIECE_REPLACEMENTS:
        t = t.replace(old, new)
    if '1688-916370884976' in asin.lower():
        t = t.replace('Comforter Set 4 Pcs', 'Bedding Set 4 Pcs')
    if not re.search(r'fitted sheet', t, re.I):
        pats = [
            # 1 duvet cover measuring DIM and 2 [matching] pillowcases/pillow shams measuring
            (r'\b1 duvet cover measuring (\d+\s*x\s*\d+\s*(?:in|cm)?) and 2 (matching )?(pillowcases|pillow shams) measuring',
             lambda m: '1 duvet cover measuring %s, 1 fitted sheet measuring %s, and 2 %s%s measuring' % (m.group(1), fit, m.group(2) or '', m.group(3))),
            # one duvet cover measuring DIM and two pillowcases measuring
            (r'\bone duvet cover measuring (\d+\s*x\s*\d+\s*in) and two pillowcases measuring',
             lambda m: 'one duvet cover measuring %s, one fitted sheet measuring %s, and two pillowcases measuring' % (m.group(1), fit)),
            # 1 Duvet Cover (DIM) and 2 Pillowcases (
            (r'\b1 Duvet Cover \((\d+\s*x\s*\d+\s*in)\) and 2 Pillowcases \(',
             lambda m: '1 Duvet Cover (%s), 1 Fitted Sheet (%s), and 2 Pillowcases (' % (m.group(1), fit)),
            # 1 duvet cover (DIM) and 2 pillowcases (（小写括号版）
            (r'\b1 duvet cover \((\d+\s*x\s*\d+\s*in)\) and 2 pillowcases \(',
             lambda m: '1 duvet cover (%s), 1 fitted sheet (%s), and 2 pillowcases (' % (m.group(1), fit)),
            # 1 Duvet Cover measuring DIM and 2 Pillowcases/Pillow Shams measuring（Title Case 版）
            (r'\b1 Duvet Cover measuring (\d+\s*x\s*\d+\s*in) and 2 (Pillowcases|Pillow Shams) measuring',
             lambda m: '1 Duvet Cover measuring %s, 1 Fitted Sheet measuring %s, and 2 %s measuring' % (m.group(1), fit, m.group(2))),
            # Duvet Cover x 1 (DIM) + Pillowcases x 2 (
            (r'\bDuvet Cover x 1 \((\d+\s*x\s*\d+\s*in)\) \+ Pillowcases x 2 \(',
             lambda m: 'Duvet Cover x 1 (%s) + Fitted Sheet x 1 (%s) + Pillowcases x 2 (' % (m.group(1), fit)),
            # 1 Duvet Cover: DIM[,] and 2 Pillowcases/Pillow Shams:
            (r'\b1 Duvet Cover: (\d+\s*x\s*\d+\s*in),? and 2 (Pillowcases|Pillow Shams): ',
             lambda m: '1 Duvet Cover: %s, 1 Fitted Sheet: %s, and 2 %s: ' % (m.group(1), fit, m.group(2))),
            # Duvet Cover x 1: DIM; Pillowcase x 2:
            (r'\bDuvet Cover x 1: (\d+\s*x\s*\d+\s*in); Pillowcase x 2: ',
             lambda m: 'Duvet Cover x 1: %s; Fitted Sheet x 1: %s; Pillowcase x 2: ' % (m.group(1), fit)),
            # Duvet Cover x 1: DIM and Pillowcase x 2:
            (r'\bDuvet Cover x 1: (\d+\s*x\s*\d+\s*in) and Pillowcase x 2: ',
             lambda m: 'Duvet Cover x 1: %s, Fitted Sheet x 1: %s, and Pillowcase x 2: ' % (m.group(1), fit)),
            # 1 duvet cover (DIMcm) and 2 matching pillowcases（缎面 cm 家族）
            (r'\b1 duvet cover \((\d+)\s*x\s*(\d+)\s*cm\) and 2 matching pillowcases',
             lambda m: '1 duvet cover (%s x %scm), 1 fitted sheet (%s), and 2 matching pillowcases' % (m.group(1), m.group(2), fitted_cm(min(int(m.group(1)), int(m.group(2)))))),
            # 标题带尺寸：1 Duvet Cover DIM And/and 2 Pillowcases/Pillow Shams
            (r'\b1 Duvet Cover (\d+\s*x\s*\d+\s*in),? ([Aa]nd) 2 (Pillowcases|Pillow Shams)\b',
             lambda m: '1 Duvet Cover %s, 1 Fitted Sheet %s %s 2 %s' % (m.group(1), fit, m.group(2), m.group(3))),
            # 标题带尺寸无连词：1 Duvet Cover DIM 2 Pillow Shams
            (r'\b1 Duvet Cover (\d+\s*x\s*\d+\s*in) 2 (Pillowcases|Pillow Shams)\b',
             lambda m: '1 Duvet Cover %s, 1 Fitted Sheet %s, 2 %s' % (m.group(1), fit, m.group(2))),
        ]
        for rx, fn in pats:
            t = re.sub(rx, fn, t)
        if not re.search(r'fitted sheet', t, re.I):
            fallbacks = [
                ('1 Duvet Cover And 2 Pillowcases', '1 Duvet Cover, 1 Fitted Sheet And 2 Pillowcases'),
                ('1 Duvet Cover and 2 Pillowcases', '1 Duvet Cover, 1 Fitted Sheet and 2 Pillowcases'),
                ('1 duvet cover and 2 pillowcases', '1 duvet cover, 1 fitted sheet, and 2 pillowcases'),
                ('With 2 Pillow Shams', 'With Fitted Sheet And 2 Pillow Shams'),
                ('with 2 Pillow Shams', 'with Fitted Sheet and 2 Pillow Shams'),
                ('With 2 Pillowcases', 'With Fitted Sheet And 2 Pillowcases'),
                ('with 2 Pillowcases', 'with Fitted Sheet and 2 Pillowcases'),
                ('Duvet Cover and 2 Pillowcases', 'Duvet Cover, Fitted Sheet and 2 Pillowcases'),
            ]
            for old, new in fallbacks:
                if old in t:
                    t = t.replace(old, new)
                    break
    # 缎面 1688 家族陈旧"仅被套"基础描述（products-materials 底稿，运行时被 MATERIALS_MAP 覆盖）改写
    if is_cm_family(asin) and not re.search(r'fitted sheet', t, re.I):
        fitcm = fitted_cm(cm_width_of(t))
        duvet_only = [
            (r'This bedding set comes with 1 duvet cover measuring (\d+)\s*x\s*(\d+)\s*cm\.',
             lambda m: 'This bedding set comes with 1 duvet cover measuring %s x %scm, 1 fitted sheet measuring %s, and 2 pillowcases.' % (m.group(1), m.group(2), fitted_cm(min(int(m.group(1)), int(m.group(2)))))),
            (r'This listing includes 1 duvet cover measuring (\d+\s*x\s*\d+\s*cm)\.',
             lambda m: 'This listing includes 1 duvet cover measuring %s, 1 fitted sheet measuring %s, and 2 pillowcases.' % (m.group(1), fitcm)),
            (r'This listing includes 1 duvet cover, (\d+\s*x\s*\d+\s*cm)\.',
             lambda m: 'This listing includes 1 duvet cover (%s), 1 fitted sheet (%s), and 2 pillowcases.' % (m.group(1), fitcm)),
            (r'This listing includes one duvet cover\.',
             lambda m: 'This listing includes 1 duvet cover, 1 fitted sheet (%s), and 2 pillowcases.' % fitcm),
            (r'The package includes one duvet cover only\.',
             lambda m: 'The package includes 1 duvet cover, 1 fitted sheet (%s), and 2 pillowcases.' % fitcm),
            (r'Duvet Cover x 1: (\d+\s*x\s*\d+\s*cm), offering a single ready-to-use cover for your bed\.',
             lambda m: 'Duvet Cover x 1: %s, Fitted Sheet x 1: %s, Pillowcase x 2, giving you a complete coordinated set.' % (m.group(1), fitcm)),
            (r'This item includes one duvet cover, listed as Duvet Cover x 1: (\d+\s*x\s*\d+\s*cm)\.',
             lambda m: 'This item includes Duvet Cover x 1: %s, Fitted Sheet x 1: %s, and Pillowcase x 2.' % (m.group(1), fitcm)),
            (r'1 x Duvet Cover, measuring (\d+\s*x\s*\d+\s*cm), so you receive one duvet cover in the specified size\.',
             lambda m: '1 x Duvet Cover measuring %s, 1 x Fitted Sheet measuring %s, and 2 x Pillowcases, so you receive a complete coordinated set.' % (m.group(1), fitcm)),
            (r'This set includes 1 x Duvet Cover measuring (\d+\s*x\s*\d+\s*cm)\.',
             lambda m: 'This set includes 1 x Duvet Cover measuring %s, 1 x Fitted Sheet measuring %s, and 2 x Pillowcases.' % (m.group(1), fitcm)),
            (r'This set includes 1 x Duvet Cover, measuring (\d+\s*x\s*\d+\s*cm)\.',
             lambda m: 'This set includes 1 x Duvet Cover measuring %s, 1 x Fitted Sheet measuring %s, and 2 x Pillowcases.' % (m.group(1), fitcm)),
            (r'This set includes 1 Duvet Cover, (\d+\s*x\s*\d+\s*cm)\.',
             lambda m: 'This set includes 1 Duvet Cover (%s), 1 Fitted Sheet (%s), and 2 Pillowcases.' % (m.group(1), fitcm)),
            (r'1 x Duvet Cover: (\d+\s*x\s*\d+\s*cm)\.',
             lambda m: '1 x Duvet Cover: %s, 1 x Fitted Sheet: %s, Pillowcase x 2.' % (m.group(1), fitcm)),
            (r'1 x Duvet Cover, (\d+\s*x\s*\d+\s*cm)\.',
             lambda m: '1 x Duvet Cover (%s), 1 x Fitted Sheet (%s), Pillowcase x 2.' % (m.group(1), fitcm)),
            (r'Quilt Cover x 1: (\d+\s*x\s*\d+\s*cm)\.',
             lambda m: 'Quilt Cover x 1: %s, Fitted Sheet x 1: %s, Pillowcase x 2.' % (m.group(1), fitcm)),
            (r'Duvet Cover x 1: (\d+\s*x\s*\d+\s*cm)\.',
             lambda m: 'Duvet Cover x 1: %s, Fitted Sheet x 1: %s, Pillowcase x 2.' % (m.group(1), fitcm)),
            (r'\b1 Duvet Cover: (\d+\s*x\s*\d+\s*cm)\.',
             lambda m: '1 Duvet Cover: %s, 1 Fitted Sheet: %s, 2 Pillowcases.' % (m.group(1), fitcm)),
            (r'This listing includes the duvet cover shown, with the size listed above for easy reference before purchase\.',
             lambda m: 'This listing includes the duvet cover, fitted sheet (%s), and two pillowcases, with sizes listed above for easy reference before purchase.' % fitcm),
        ]
        for rx, fn in duvet_only:
            t = re.sub(rx, fn, t)
    if is_cm_family(asin):
        only_fixes = [
            ('Please note that this listing includes only the duvet cover, allowing you to coordinate it with your favorite sheets and pillows. ', ''),
            ('Please note that this listing includes only the duvet cover, allowing you to coordinate it with your favorite sheets and pillows.', ''),
            ('Please note that this listing includes the duvet cover only; duvet insert and pillow shams are not included.', 'Please note that the duvet insert is not included.'),
            ('Please note that this listing includes the duvet cover only; other items shown in the image are not included.', 'Please note that the duvet insert is not included; other items shown in the image are not included.'),
            ('This listing includes the duvet cover only; other items shown in the image are not included.', 'The duvet insert is not included; other items shown in the image are not included.'),
            ('This listing includes the duvet cover only; pillow shams and other bedding accessories are not included.', 'The duvet insert is not included; other bedding accessories shown are not included.'),
            ('Duvet inserts, pillowcases, flat sheets and decorative accessories are not included.', 'Duvet inserts and decorative accessories are not included.'),
            ('Comforter insert and pillowcases are not included.', 'Comforter insert is not included.'),
            ('Please note that a comforter insert, pillows, and pillowcases are not included.', 'Please note that a comforter insert and pillows are not included.'),
            ('Please note that pillowcases, sheets, and comforter are not included.', 'Please note that the comforter insert is not included.'),
            ('Please note that the listing covers the duvet cover component only, so check your comforter dimensions before ordering.', 'Please note that the duvet insert is not included; check your comforter dimensions before ordering.'),
        ]
        for old, new in only_fixes:
            t = t.replace(old, new)
    t = t.replace('Duvet inserts and sheets are not included.', 'Duvet insert is not included.')
    return t

report = {'fitted_missing': [], 'piece_left': [], 'changed': 0, 'entries': 0}

def check(tag, asin, before, after, need_fitted):
    if before != after:
        report['changed'] += 1
    if need_fitted and not re.search(r'fitted sheet', after, re.I):
        report['fitted_missing'].append(tag + ' ' + asin)
    if re.search(r'\b3[- ]piece|\b3 pcs\b|set of 3', after, re.I):
        report['piece_left'].append(tag + ' ' + asin)

def read(path):
    return open(path, 'rb').read().decode('utf-8')

def write(path, text):
    open(path, 'wb').write(text.encode('utf-8'))
    print('WROTE', path)

# ---------- materials-map.ts（每条目单行 JSON）----------
path = ROOT + 'materials-map.ts'
src = read(path)
out = src
for m in re.finditer(r'^  "([^"]+)": \{', src, re.M):
    asin = m.group(1)
    if not is_three(asin):
        continue
    report['entries'] += 1
    line_end = src.index('\n', m.start())
    block = src[m.start():line_end]
    new_block = block
    for f in ('title', 'bullets'):
        fm = re.search(r'"' + f + r'":"((?:[^"\\]|\\.)*)"', new_block)
        if not fm:
            continue
        val = json.loads('"' + fm.group(1) + '"')
        new_val = transform(val, asin)
        check(f, asin, val, new_val, f == 'bullets')
        new_block = new_block[:fm.start(1)] + json.dumps(new_val, ensure_ascii=False)[1:-1] + new_block[fm.end(1):]
    out = out.replace(block, new_block, 1)
if APPLY and out != src:
    write(path, out)

# ---------- products-materials.ts（多行条目，大括号配平定位）----------
path = ROOT + 'products-materials.ts'
src = read(path)
out = src
for m in re.finditer(r'^    "asin": "([^"]+)",\r?$', src, re.M):
    asin = m.group(1)
    if not is_three(asin):
        continue
    report['entries'] += 1
    # 条目起点 = asin 前最近的 "id": " 所在对象的 '{'
    id_pos = src.rfind('"id": "', 0, m.start())
    brace_pos = src.rfind('{', 0, id_pos)
    # 大括号配平找条目终点（字符串感知）
    depth = 0; k = brace_pos; in_str = False; esc = False
    while k < len(src):
        c = src[k]
        if in_str:
            if esc:
                esc = False
            elif c == '\\':
                esc = True
            elif c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    break
        k += 1
    block = src[brace_pos:k + 1]
    assert '"asin": "%s"' % asin in block, 'block mismatch for ' + asin
    new_block = block
    for f in ('title', 'description', 'descriptionHtml'):
        fm = re.search(r'"' + f + r'": "((?:[^"\\]|\\.)*)"', new_block)
        if not fm:
            continue
        val = json.loads('"' + fm.group(1) + '"')
        new_val = transform(val, asin)
        check(f, asin, val, new_val, f in ('description', 'descriptionHtml'))
        new_block = new_block[:fm.start(1)] + json.dumps(new_val, ensure_ascii=False)[1:-1] + new_block[fm.end(1):]
    out = out.replace(block, new_block, 1)
if APPLY and out != src:
    write(path, out)

# ---------- short-titles.ts ----------
path = ROOT + 'short-titles.ts'
src = read(path)
out = src
for m in re.finditer(r'^  "([^"]+)": "((?:[^"\\]|\\.)*)",?\r?$', src, re.M):
    asin = m.group(1)
    if not is_three(asin):
        continue
    report['entries'] += 1
    val = json.loads('"' + m.group(2) + '"')
    new_val = transform(val, asin)
    check('short-title', asin, val, new_val, False)
    trailing = ',' if m.group(0).rstrip().endswith(',') else ''
    out = out.replace(m.group(0), '  "%s": %s%s' % (asin, json.dumps(new_val, ensure_ascii=False), trailing), 1)
if APPLY and out != src:
    write(path, out)

# ---------- materials-short-bullets.ts ----------
path = ROOT + 'materials-short-bullets.ts'
src = read(path)
out = src
for m in re.finditer(r'^  "([^"]+)": \[\r?\n((?:.*\r?\n)*?)  \],?\r?$', src, re.M):
    asin = m.group(1)
    if not is_three(asin):
        continue
    report['entries'] += 1
    block = m.group(0)
    new_block = block
    for sm in re.finditer(r'"((?:[^"\\]|\\.)*)"', block):
        val = json.loads('"' + sm.group(1) + '"')
        new_val = transform(val, asin)
        if val != new_val:
            check('short-bullet', asin, val, new_val, False)
            new_block = new_block.replace('"%s"' % sm.group(1), json.dumps(new_val, ensure_ascii=False), 1)
    out = out.replace(block, new_block, 1)
if APPLY and out != src:
    write(path, out)

print('entries touched:', report['entries'], '| fields changed:', report['changed'])
print('fitted-sheet insertion MISSING in:')
for x in report['fitted_missing']:
    print('  ', x)
print('piece-count leftover in:')
for x in report['piece_left']:
    print('  ', x)
