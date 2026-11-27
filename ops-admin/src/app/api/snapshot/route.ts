import { execFile } from 'child_process';
import { NextResponse } from 'next/server';
import { loadSnapshot } from '@/lib/snapshot';

/** 重新从 vertex 仓库导入快照（子进程跑 scripts/import-vertex.mjs） */
export async function POST() {
  const result = await new Promise<{ ok: boolean; log: string }>((resolve) => {
    execFile(
      process.execPath,
      ['scripts/import-vertex.mjs'],
      { cwd: process.cwd(), timeout: 120_000 },
      (err, stdout, stderr) => {
        resolve({ ok: !err, log: (stdout || '') + (stderr || '') });
      }
    );
  });
  if (!result.ok) {
    return NextResponse.json({ error: '导入失败', log: result.log }, { status: 500 });
  }
  const snap = loadSnapshot(true);
  return NextResponse.json({ ok: true, importedAt: snap.importedAt, stats: snap.stats });
}
