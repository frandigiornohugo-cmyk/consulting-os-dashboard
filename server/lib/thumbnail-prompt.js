import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const METHODOLOGY_PATH = path.join(__dirname, '..', '..', 'context', 'miniaturas', 'metodologia.md');

export const NICHES = {
  'marca-personal': 'Personal brand / client testimonial. Big expressive faces, genuine emotion, result-driven numeric headline.',
  b2b: 'B2B / professional services. Sober, high contrast, one clear idea, corporate feel.',
  infoproducto: 'Info product / course. Concrete promise, strong contrast, visible transformation or number.',
  ecommerce: 'E-commerce. Product sharp and prominent, person using it if present, benefit in 2-3 words.',
};

const POSITION_EN = { izquierda: 'on the left side', derecha: 'on the right side', centro: 'in the center' };

export const SPEC_FIELDS = [
  'layout',
  'encuadre',
  'iluminacion',
  'titulo_estilo',
  'subtitulo_estilo',
  'acabado',
  'elementos',
  'paleta',
];

export async function loadMethodology() {
  try {
    return await fs.readFile(METHODOLOGY_PATH, 'utf8');
  } catch {
    return '';
  }
}

export async function buildAnalysisSystemPrompt() {
  const methodology = await loadMethodology();
  return [
    'Sos un director de arte especializado en miniaturas de YouTube ultra realistas (marca personal, B2B, infoproductos, e-commerce).',
    'Analizás una miniatura de referencia y devolvés una especificación visual precisa y replicable para que un modelo de imagen la reproduzca con otras personas.',
    'Describí solo la estructura visual: no describas la identidad de las personas de la referencia.',
    'Respondé SOLO un objeto JSON con estas claves (todas strings en español, concretas y medibles: posiciones, proporciones, colores en hex cuando se pueda):',
    SPEC_FIELDS.map((f) => `- ${f}`).join('\n'),
    'Además incluí "resumen" (una línea) y "texto_detectado" (el texto exacto que aparece en la referencia).',
    methodology ? `\nMetodología a respetar:\n${methodology}` : '',
  ].join('\n');
}

export function buildGenerationPrompt({ spec = {}, niche, photos = [], title, subtitle, colors, notes, hasLogo, hasReference }) {
  const photoLines = photos.map((p, i) => `- Image ${i + 1}: ${p.label || `person ${i + 1}`}. Place it ${POSITION_EN[p.position] || 'as the layout requires'}.`);
  let next = photos.length + 1;
  const logoLine = hasLogo ? `- Image ${next++}: brand logo. Place it small in a corner, unaltered.` : null;
  const refLine = hasReference
    ? `- Image ${next}: STYLE REFERENCE ONLY. Copy its layout, typography, title container, lighting mood and finish. Never copy its people, faces, clothes or backgrounds.`
    : null;

  const specLines = SPEC_FIELDS.filter((k) => spec[k]).map((k) => `- ${k}: ${spec[k]}`);

  return [
    'Create a photorealistic YouTube thumbnail, horizontal 16:9.',
    '',
    'INPUT IMAGES',
    ...photoLines,
    logoLine,
    refLine,
    '',
    'IDENTITY PRESERVATION (mandatory)',
    '- Keep every person exactly as in their photo: identical facial features, head shape, hair, facial hair, glasses, body and proportions.',
    '- Keep the same clothing, accessories and background of each person.',
    '- Keep the same expression and gaze direction.',
    '- No beauty filters, no plastic skin, no whitened teeth, no enlarged eyes. Preserve natural skin texture and tones.',
    '',
    'ENHANCEMENT',
    '- Improve exposure, sharpness, contrast and dynamic range. Remove noise and compression artifacts.',
    '- Add soft flattering fill light on the faces, keeping the original light direction.',
    '- Reframe so faces are large and centered in their panel, leaving room at the bottom for the title.',
    '',
    specLines.length ? 'VISUAL SPEC (from reference analysis)' : null,
    ...specLines,
    '',
    'TEXT (render exactly, character by character, no extra words, no translation)',
    `- Main title: "${title}"`,
    subtitle ? `- Subtitle: "${subtitle}"` : '- No subtitle.',
    colors ? `- Graphic colors: ${colors}.` : null,
    '- Text must be crisp, perfectly spelled, readable at small size, and never cover the faces.',
    '',
    niche && NICHES[niche] ? `NICHE: ${NICHES[niche]}` : null,
    hasLogo ? null : '- No watermark, no logo, no extra text anywhere.',
    notes ? `\nEXTRA NOTES: ${notes}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n');
}

export function buildRefinePrompt({ feedback, title, subtitle }) {
  return [
    'Image 1 is the current YouTube thumbnail. The following images are the original photos of the people, use them only to keep identity exact.',
    `Apply only this change: ${feedback}`,
    'Keep everything else identical: layout, faces, clothing, backgrounds, colors and typography.',
    `The title must still read exactly "${title}"${subtitle ? ` and the subtitle exactly "${subtitle}"` : ''}.`,
    'No beauty filters. No watermark.',
  ].join('\n');
}
