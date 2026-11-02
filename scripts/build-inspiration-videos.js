// 把 /inspiration 的 8 套 before/after 图生成社媒擦除动画 mp4（1080x1440, Reels/TikTok/Pinterest）
// 时间轴（5.5s 无缝循环）：before 定格 0.7s → 左扫擦除 1.2s → after 定格 1.6s → 右扫回 1.2s → before 定格 0.8s
// 用法: node scripts/build-inspiration-videos.js <ffmpeg路径> [只生成第N套]
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG = process.argv[2];
const ONLY = process.argv[3] ? parseInt(process.argv[3], 10) : null;
if (!FFMPEG) { console.error('需要 ffmpeg 路径参数'); process.exit(1); }

const SRC = path.join(__dirname, '..', 'public', 'images', 'inspiration');
const OUT = 'C:/Users/12021/Desktop/大片图/inspiration-videos';
fs.mkdirSync(OUT, { recursive: true });

for (let n = 1; n <= 8; n++) {
  if (ONLY && n !== ONLY) continue;
  const before = path.join(SRC, `scene-${n}-before.webp`);
  const after = path.join(SRC, `scene-${n}-after.webp`);
  const out = path.join(OUT, `scene-${n}-wipe.mp4`);
  const filter =
    '[0:v]scale=1080:1440,fps=30,format=yuv420p,setsar=1[b0];' +
    '[1:v]scale=1080:1440,fps=30,format=yuv420p,setsar=1[a0];' +
    '[2:v]scale=1080:1440,fps=30,format=yuv420p,setsar=1[b1];' +
    '[b0][a0]xfade=transition=wipeleft:duration=1.2:offset=0.7[v1];' +
    '[v1][b1]xfade=transition=wiperight:duration=1.2:offset=3.5,format=yuv420p[v]';
  execFileSync(FFMPEG, [
    '-y',
    '-loop', '1', '-t', '1.9', '-i', before,
    '-loop', '1', '-t', '4.0', '-i', after,
    '-loop', '1', '-t', '2.0', '-i', before,
    '-filter_complex', filter,
    '-map', '[v]',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
    '-movflags', '+faststart',
    out,
  ], { stdio: 'pipe' });
  const mb = (fs.statSync(out).size / 1048576).toFixed(1);
  console.log(`scene-${n}-wipe.mp4  ${mb}MB`);
}
console.log('done ->', OUT);
