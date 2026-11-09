#!/usr/bin/env node
// Uso: node scripts/generar.mjs --dir proyectos/<carpeta> --imagenes foto-1.jpg,foto-2.jpg,referencia.jpg [--prompt prompt.txt] [--n 1]
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

async function loadEnv() {
  try {
    const raw = await fs.readFile(path.join(ROOT, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (m && !process.env[m[1]] && m[2]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {}
}

function parseArgs(argv) {
  const args = { prompt: 'prompt.txt', n: '1' };
  for (let i = 0; i < argv.length; i += 2) args[argv[i].replace(/^--/, '')] = argv[i + 1];
  return args;
}

function fail(msg) {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

async function nextVersion(outDir) {
  const files = await fs.readdir(outDir).catch(() => []);
  const nums = files.map((f) => /^v(\d+)\.png$/.exec(f)?.[1]).filter(Boolean).map(Number);
  return nums.length ? Math.max(...nums) + 1 : 1;
}

await loadEnv();
const args = parseArgs(process.argv.slice(2));
if (!args.dir || !args.imagenes) fail('faltan --dir y --imagenes');
if (!process.env.OPENAI_API_KEY) fail('falta OPENAI_API_KEY en estudio-miniaturas/.env');

const dir = path.resolve(ROOT, args.dir);
const prompt = await fs.readFile(path.join(dir, args.prompt), 'utf8').catch(() => fail(`no existe ${args.prompt} en ${args.dir}`));
const imageNames = args.imagenes.split(',').map((s) => s.trim()).filter(Boolean);
if (imageNames.length > 16) fail('maximo 16 imagenes');

const form = new FormData();
form.append('model', process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1');
form.append('prompt', prompt);
form.append('size', process.env.OPENAI_IMAGE_SIZE || '1536x1024');
form.append('quality', 'high');
form.append('input_fidelity', 'high');
form.append('output_format', 'png');
form.append('n', String(Math.min(Math.max(Number(args.n) || 1, 1), 4)));

for (const name of imageNames) {
  const file = path.join(dir, name);
  const type = MIME[path.extname(name).toLowerCase()];
  if (!type) fail(`formato no soportado: ${name}`);
  const buf = await fs.readFile(file).catch(() => fail(`no existe ${name} en ${args.dir}`));
  form.append('image[]', new Blob([buf], { type }), path.basename(name));
}

console.log(`Generando con ${imageNames.length} imagen(es) en calidad alta. Puede tardar 1-2 minutos...`);
let res;
try {
  res = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form,
  });
} catch (err) {
  fail(`no se pudo conectar con OpenAI (${err.cause?.message || err.message})`);
}
const json = await res.json().catch(() => ({}));
if (!res.ok) fail(json?.error?.message || `OpenAI respondio ${res.status}`);

const outDir = path.join(dir, 'salida');
await fs.mkdir(outDir, { recursive: true });
let v = await nextVersion(outDir);
for (const item of json.data || []) {
  const out = path.join(outDir, `v${v}.png`);
  await fs.writeFile(out, Buffer.from(item.b64_json, 'base64'));
  await fs.writeFile(path.join(outDir, `v${v}.prompt.txt`), `# imagenes: ${imageNames.join(', ')}\n\n${prompt}`);
  console.log(`Listo: ${path.relative(ROOT, out)}`);
  v += 1;
}
