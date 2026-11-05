/**
 * _rylvetha-label.js — rylvetha 桌垫产品标签生成（2026-11-02）
 * 长方形横版标签，贴纯色外包装：左 logo（原图提取后二值化为纯黑白）、
 * 右侧产品名/尺寸/属性三行排版，纯黑 #000 + 纯白底（2026-11-02 用户定：纯黑白，7×4cm）。
 * 先生成 1 张确认效果，确认后批量 3 张。
 * 用法: node scripts/_rylvetha-label.js
 * 输出: C:/Users/12021/Desktop/rylvetha-labels/label-deskpad-27.5x11.8.png
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
sharp.cache({ files: 0 });

const LOGO = 'E:/微信/xwechat_files/wxid_na48u1r9pwya22_fc25/temp/RWTemp/2026-11/0c5ab64a46490d3f6be1630626b7de5d/a4b0f5e1708f99d7f9884c8081b07482.jpg';
const OUT_DIR = 'C:/Users/12021/Desktop/rylvetha-labels';
const CHARCOAL = '#000000';
const TAUPE = '#000000';

// 物理尺寸 7 × 4 cm（横版），600 DPI 出图（打印软件按 dpi 元数据自动排成 7×4cm）
const DPI = 600;
const W = Math.round(7 / 2.54 * DPI);  // 1654
const H = Math.round(4 / 2.54 * DPI);  // 945

// 标签内容（3 张批量）
const ITEMS = [
  { name: 'DESK PAD', size: '27.5 × 11.8 in', attrs: 'REVERSIBLE FAUX LEATHER · NON-SLIP', file: 'label-deskpad-27.5x11.8.png' },
  { name: 'DESK PAD', size: '31.5 × 15.7 in', attrs: 'REVERSIBLE FAUX LEATHER · NON-SLIP', file: 'label-deskpad-31.5x15.7.png' },
  { name: 'DESK PAD', size: '35.4 × 17.7 in', attrs: 'REVERSIBLE FAUX LEATHER · WATERPROOF', file: 'label-deskpad-35.4x17.7.png' },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

(async () => {
  // 纯黑白标签：白底
  const BG = '#FFFFFF';

  // logo 块：裁白边 → 灰度 → 对比度拉伸（底色→纯白、logo→纯黑，保留平滑抗锯齿边缘，不用 threshold 避免锯齿）→ 缩放
  const k = W / 2000; // 版式缩放系数（以 2000 宽设计稿为基准）
  const logoZoneCX = Math.round(W * 0.225);
  const logoBuf = await sharp(LOGO).trim({ threshold: 12 })
    .greyscale()
    .linear(2.4, -290) // 亮度 ≤120 → 纯黑，≥246 → 纯白，中间过渡带平滑
    .resize({ width: Math.round(540 * k), height: Math.round(500 * k), fit: 'inside', kernel: 'lanczos3' })
    .png().toBuffer();
  const logoMeta = await sharp(logoBuf).metadata();
  const logoX = Math.round(logoZoneCX - logoMeta.width / 2);
  const logoY = Math.round((H - logoMeta.height) / 2);

  const dividerX = Math.round(830 * k);
  const textCX = Math.round((dividerX + W - 90 * k) / 2 + 20 * k);
  const y = (v) => Math.round(v * H / 1100);
  const sp = (v) => Math.max(1, Math.round(v * k));

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const ITEM of ITEMS) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="${sp(30)}" y="${sp(30)}" width="${W - sp(60)}" height="${H - sp(60)}" fill="none" stroke="${CHARCOAL}" stroke-width="${sp(3)}"/>
  <rect x="${sp(46)}" y="${sp(46)}" width="${W - sp(92)}" height="${H - sp(92)}" fill="none" stroke="${CHARCOAL}" stroke-width="1"/>
  <line x1="${dividerX}" y1="${y(230)}" x2="${dividerX}" y2="${H - y(230)}" stroke="${CHARCOAL}" stroke-width="${sp(1.5)}"/>
  <text x="${textCX}" y="${y(455)}" font-family="Futura, 'Century Gothic', 'Trebuchet MS', sans-serif" font-size="${sp(112)}" font-weight="500" letter-spacing="${sp(15)}" fill="${CHARCOAL}" text-anchor="middle">${esc(ITEM.name)}</text>
  <line x1="${textCX - sp(150)}" y1="${y(512)}" x2="${textCX + sp(150)}" y2="${y(512)}" stroke="${TAUPE}" stroke-width="${sp(2)}"/>
  <text x="${textCX}" y="${y(640)}" font-family="Futura, 'Century Gothic', 'Trebuchet MS', sans-serif" font-size="${sp(74)}" letter-spacing="${sp(6)}" fill="${CHARCOAL}" text-anchor="middle">${esc(ITEM.size)}</text>
  <text x="${textCX}" y="${y(780)}" font-family="Futura, 'Century Gothic', 'Trebuchet MS', sans-serif" font-size="${sp(40)}" letter-spacing="${sp(8)}" fill="${TAUPE}" text-anchor="middle">${esc(ITEM.attrs)}</text>
</svg>`;

    const out = path.join(OUT_DIR, ITEM.file);
    const buf = await sharp(Buffer.from(svg))
      .composite([{ input: logoBuf, left: logoX, top: logoY }])
      .png()
      .withMetadata({ density: DPI })
      .toBuffer();
    let finalOut = out;
    try {
      fs.writeFileSync(out, buf);
    } catch (e) {
      // 文件被看图软件占用时改名输出
      finalOut = out.replace(/\.png$/, '-v2.png');
      fs.writeFileSync(finalOut, buf);
      console.log('原文件被占用，已另存为新文件');
    }
    console.log('已生成:', finalOut, `(${W}x${H}px @ ${DPI}dpi = 7x4cm)`);
  }
})().catch((e) => { console.error('失败:', e); process.exit(1); });
