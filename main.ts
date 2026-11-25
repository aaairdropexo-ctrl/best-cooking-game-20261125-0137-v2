// Simmer & Serve — Midnight Noodle Bar: entrypoint.
//
// Copies game/ and screenshots/ into the output directory and writes
// dossier.json with buildDossier from the kit's vendor library, so the
// sealed gate can check the entry byte for byte. Node 22, stdlib only.
// Deterministic: the same repository always writes the same bytes.
import { copyFileSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

function copyTreeSorted(srcDir: string, destDir: string): void {
  mkdirSync(destDir, { recursive: true });
  const entries = readdirSync(srcDir).sort();
  for (const name of entries) {
    const src = join(srcDir, name);
    const dest = join(destDir, name);
    const st = statSync(src);
    if (st.isDirectory()) {
      copyTreeSorted(src, dest);
    } else if (st.isFile()) {
      copyFileSync(src, dest);
    }
  }
}

function main(): void {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  copyTreeSorted(join(repoRoot, 'game'), join(outDir, 'game'));
  copyTreeSorted(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'));
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 48 * 1024 * 1024,
    game_path_max_bytes: 1000
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);
}

main();
