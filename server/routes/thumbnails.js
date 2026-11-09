import { Router } from 'express';
import {
  NICHES,
  SPEC_FIELDS,
  buildAnalysisSystemPrompt,
  buildGenerationPrompt,
  buildRefinePrompt,
} from '../lib/thumbnail-prompt.js';

const router = Router();

const OPENAI_URL = 'https://api.openai.com/v1';
const visionModel = () => process.env.OPENAI_VISION_MODEL || 'gpt-4.1';
const imageModel = () => process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

function dataUrlToBlob(dataUrl) {
  const match = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(dataUrl || '');
  if (!match) throw new Error('Imagen invalida: se espera un data URL base64');
  return new Blob([Buffer.from(match[2], 'base64')], { type: match[1] });
}

async function openaiError(res) {
  const body = await res.json().catch(() => ({}));
  return body?.error?.message || `OpenAI respondio ${res.status}`;
}

function errorMessage(err) {
  return err.cause?.message ? `${err.message}: ${err.cause.message}` : err.message;
}

function requireKey(_req, res, next) {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: 'Falta OPENAI_API_KEY en .env' });
  }
  next();
}

async function editImages({ images, prompt }) {
  const form = new FormData();
  form.append('model', imageModel());
  form.append('prompt', prompt);
  form.append('size', '1536x1024');
  form.append('quality', 'high');
  form.append('input_fidelity', 'high');
  form.append('output_format', 'png');
  images.forEach((dataUrl, i) => {
    const blob = dataUrlToBlob(dataUrl);
    form.append('image[]', blob, `input-${i + 1}.${blob.type.split('/')[1]}`);
  });

  const res = await fetch(`${OPENAI_URL}/images/edits`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form,
  });
  if (!res.ok) throw new Error(await openaiError(res));
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error('OpenAI no devolvio imagen');
  return `data:image/png;base64,${b64}`;
}

// GET /api/thumbnails/status
router.get('/status', (_req, res) => {
  res.json({
    data: {
      configured: Boolean(process.env.OPENAI_API_KEY),
      visionModel: visionModel(),
      imageModel: imageModel(),
      niches: Object.keys(NICHES),
      specFields: SPEC_FIELDS,
    },
  });
});

// POST /api/thumbnails/analyze  { reference: dataUrl, niche }
router.post('/analyze', requireKey, async (req, res) => {
  const { reference, niche } = req.body || {};
  if (!reference) return res.status(400).json({ error: 'Falta la imagen de referencia' });

  try {
    const r = await fetch(`${OPENAI_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: visionModel(),
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: await buildAnalysisSystemPrompt() },
          {
            role: 'user',
            content: [
              { type: 'text', text: `Analiza esta miniatura de referencia. Nicho del proyecto: ${niche || 'marca-personal'}.` },
              { type: 'image_url', image_url: { url: reference, detail: 'high' } },
            ],
          },
        ],
      }),
    });
    if (!r.ok) throw new Error(await openaiError(r));
    const json = await r.json();
    const spec = JSON.parse(json.choices?.[0]?.message?.content || '{}');
    res.json({ data: spec });
  } catch (err) {
    res.status(502).json({ error: errorMessage(err) });
  }
});

// POST /api/thumbnails/generate
// { photos: [{ dataUrl, label, position }], reference?, useReference, logo?, spec, niche, title, subtitle, colors, notes }
router.post('/generate', requireKey, async (req, res) => {
  const { photos = [], reference, useReference = true, logo, spec, niche, title, subtitle, colors, notes } = req.body || {};
  if (!photos.length) return res.status(400).json({ error: 'Subi al menos una foto' });
  if (!title) return res.status(400).json({ error: 'Falta el titulo' });

  const hasReference = Boolean(useReference && reference);
  const prompt = buildGenerationPrompt({
    spec,
    niche,
    photos,
    title,
    subtitle,
    colors,
    notes,
    hasLogo: Boolean(logo),
    hasReference,
  });
  const images = [...photos.map((p) => p.dataUrl), ...(logo ? [logo] : []), ...(hasReference ? [reference] : [])];

  try {
    const image = await editImages({ images, prompt });
    // TODO: Persist generations in Supabase (table thumbnails) for history per client.
    res.json({ data: { image, prompt, model: imageModel() } });
  } catch (err) {
    res.status(502).json({ error: errorMessage(err) });
  }
});

// POST /api/thumbnails/refine  { current: dataUrl, photos: [{ dataUrl }], feedback, title, subtitle }
router.post('/refine', requireKey, async (req, res) => {
  const { current, photos = [], feedback, title, subtitle } = req.body || {};
  if (!current || !feedback) return res.status(400).json({ error: 'Falta la miniatura actual o el cambio a aplicar' });

  const prompt = buildRefinePrompt({ feedback, title, subtitle });
  try {
    const image = await editImages({ images: [current, ...photos.map((p) => p.dataUrl)], prompt });
    res.json({ data: { image, prompt, model: imageModel() } });
  } catch (err) {
    res.status(502).json({ error: errorMessage(err) });
  }
});

export default router;
