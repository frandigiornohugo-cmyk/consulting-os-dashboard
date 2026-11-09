import { useEffect, useState } from 'react';
import { Image as ImageIcon, Loader2, Plus, Sparkles, Download, RotateCcw, Check, Trash2 } from 'lucide-react';
import ContentCard from '../components/ContentCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { ImageDrop } from '../components/ImageDrop.jsx';

const STEPS = ['Referencia', 'Fotos', 'Texto', 'Miniatura'];

const NICHE_LABELS = {
  'marca-personal': 'Marca personal',
  b2b: 'B2B',
  infoproducto: 'Infoproducto',
  ecommerce: 'E-commerce',
};

const SPEC_LABELS = {
  layout: 'Layout',
  encuadre: 'Encuadre',
  iluminacion: 'Iluminacion',
  titulo_estilo: 'Estilo del titulo',
  subtitulo_estilo: 'Estilo del subtitulo',
  acabado: 'Acabado',
  elementos: 'Elementos',
  paleta: 'Paleta',
};

const POSITIONS = ['izquierda', 'derecha', 'centro'];

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-white/25 focus:outline-none';

async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Error ${res.status}`);
  return json.data;
}

function Button({ children, onClick, disabled, loading, variant = 'primary', icon: Icon }) {
  const styles =
    variant === 'primary'
      ? 'bg-white text-neutral-900 hover:bg-neutral-200'
      : 'border border-white/10 text-neutral-300 hover:border-white/20 hover:text-white';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${styles}`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">{label}</span>
      {children}
    </label>
  );
}

export default function Thumbnails() {
  const [status, setStatus] = useState(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const [niche, setNiche] = useState('marca-personal');
  const [reference, setReference] = useState(null);
  const [spec, setSpec] = useState(null);

  const [photos, setPhotos] = useState([
    { dataUrl: null, label: 'Cliente 1', position: 'izquierda' },
    { dataUrl: null, label: 'Cliente 2', position: 'derecha' },
  ]);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [colors, setColors] = useState('');
  const [notes, setNotes] = useState('');
  const [logo, setLogo] = useState(null);
  const [useReference, setUseReference] = useState(true);

  const [versions, setVersions] = useState([]);
  const [active, setActive] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    fetch('/api/thumbnails/status')
      .then((r) => r.json())
      .then((j) => setStatus(j.data))
      .catch(() => setStatus({ configured: false }));
  }, []);

  const readyPhotos = photos.filter((p) => p.dataUrl);
  const current = versions[active];

  async function run(key, fn) {
    setError('');
    setLoading(key);
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading('');
    }
  }

  const analyze = () =>
    run('analyze', async () => {
      setSpec(await post('/api/thumbnails/analyze', { reference, niche }));
    });

  const generate = () =>
    run('generate', async () => {
      const data = await post('/api/thumbnails/generate', {
        photos: readyPhotos,
        reference,
        useReference,
        logo,
        spec,
        niche,
        title,
        subtitle,
        colors,
        notes,
      });
      setVersions((v) => [...v, { ...data, note: 'Generacion' }]);
      setActive(versions.length);
      setStep(3);
    });

  const refine = () =>
    run('refine', async () => {
      const data = await post('/api/thumbnails/refine', {
        current: current.image,
        photos: readyPhotos,
        feedback,
        title,
        subtitle,
      });
      setVersions((v) => [...v, { ...data, note: feedback }]);
      setActive(versions.length);
      setFeedback('');
    });

  function updatePhoto(i, patch) {
    setPhotos((ps) => ps.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  if (status && !status.configured) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader />
        <ContentCard>
          <EmptyState
            icon={ImageIcon}
            title="Conecta OpenAI para generar miniaturas"
            description="Agrega OPENAI_API_KEY en el archivo .env del servidor y reinicia con npm run dev."
          />
        </ContentCard>
      </div>
    );
  }

  const canNext = [Boolean(reference), readyPhotos.length > 0, Boolean(title.trim()), true][step];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader models={status} />

      <ol className="grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => (i <= step || (i === 3 && versions.length)) && setStep(i)}
              className={[
                'flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors sm:text-sm',
                i === step ? 'border-white/25 bg-white/[0.06] text-white' : 'border-white/5 text-neutral-500',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px]',
                  i < step ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-neutral-400',
                ].join(' ')}
              >
                {i < step ? <Check size={12} /> : i + 1}
              </span>
              <span className="truncate">{s}</span>
            </button>
          </li>
        ))}
      </ol>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>
      )}

      {step === 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ContentCard title="1. Miniatura de referencia">
            <div className="space-y-4">
              <Field label="Nicho">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(NICHE_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setNiche(key)}
                      className={[
                        'rounded-full border px-3 py-1 text-xs transition-colors',
                        niche === key ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 text-neutral-500 hover:text-neutral-300',
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </Field>
              <ImageDrop
                value={reference}
                onChange={(v) => {
                  setReference(v);
                  setSpec(null);
                }}
                label="Subi la miniatura que queres replicar"
                hint="PNG, JPG o WEBP"
              />
              <Button icon={Sparkles} onClick={analyze} disabled={!reference} loading={loading === 'analyze'}>
                Analizar referencia
              </Button>
            </div>
          </ContentCard>

          <ContentCard title="Analisis de la referencia">
            {spec ? (
              <div className="space-y-3">
                {spec.resumen && <p className="text-sm text-neutral-400">{spec.resumen}</p>}
                {(status?.specFields || Object.keys(SPEC_LABELS)).map((key) => (
                  <Field key={key} label={SPEC_LABELS[key] || key}>
                    <textarea
                      rows={2}
                      value={spec[key] || ''}
                      onChange={(e) => setSpec({ ...spec, [key]: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                ))}
                <p className="text-xs text-neutral-600">Edita cualquier campo antes de seguir. Esto es lo que va a respetar la generacion.</p>
              </div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="Sin analisis todavia"
                description="Subi la referencia y analizala. Es opcional: si la salteas, la referencia se usa solo como guia visual."
              />
            )}
          </ContentCard>
        </div>
      )}

      {step === 1 && (
        <ContentCard
          title="2. Fotos de las personas"
          action={
            photos.length < 3 && (
              <Button
                variant="secondary"
                icon={Plus}
                onClick={() => setPhotos([...photos, { dataUrl: null, label: `Cliente ${photos.length + 1}`, position: 'centro' }])}
              >
                Agregar foto
              </Button>
            )
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p, i) => (
              <div key={i} className="space-y-3">
                <ImageDrop
                  value={p.dataUrl}
                  onChange={(v) => updatePhoto(i, { dataUrl: v })}
                  label={`Foto ${i + 1}`}
                  hint="Frame del video, cara visible y nitida"
                  aspect="aspect-[4/3]"
                />
                <input value={p.label} onChange={(e) => updatePhoto(i, { label: e.target.value })} className={inputClass} placeholder="Quien es" />
                <div className="flex gap-2">
                  <select value={p.position} onChange={(e) => updatePhoto(i, { position: e.target.value })} className={inputClass}>
                    {POSITIONS.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                      className="rounded-lg border border-white/10 px-3 text-neutral-500 hover:text-rose-400"
                      aria-label="Quitar foto"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      )}

      {step === 2 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <ContentCard title="3. Texto y colores">
            <div className="space-y-4">
              <Field label="Titulo (exacto)">
                <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="$20K - $135K" />
              </Field>
              <Field label="Subtitulo">
                <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputClass} placeholder="Ecommerce" />
              </Field>
              <Field label="Colores">
                <input value={colors} onChange={(e) => setColors(e.target.value)} className={inputClass} placeholder="Rojo neon con glow, letras blancas" />
              </Field>
              <Field label="Indicaciones extra">
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={inputClass}
                  placeholder="Caras centradas, buena luz original a cada uno, linea en el medio que divida"
                />
              </Field>
            </div>
          </ContentCard>
          <ContentCard title="Opciones">
            <div className="space-y-4">
              <label className="flex items-start gap-3 text-sm text-neutral-300">
                <input type="checkbox" checked={useReference} onChange={(e) => setUseReference(e.target.checked)} className="mt-1" />
                <span>
                  Enviar la referencia como guia visual
                  <span className="block text-xs text-neutral-600">Mejora la fidelidad al estilo. Se le indica al modelo que no copie a las personas.</span>
                </span>
              </label>
              <Field label="Logo (opcional, si no se sube va sin logo ni marca de agua)">
                <ImageDrop value={logo} onChange={setLogo} label="Subir logo" aspect="aspect-[3/1]" />
              </Field>
            </div>
          </ContentCard>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-6 lg:grid-cols-3">
          <ContentCard title="4. Miniatura" className="lg:col-span-2">
            {current ? (
              <div className="space-y-4">
                <img src={current.image} alt="Miniatura generada" className="w-full rounded-lg" />
                <div className="flex flex-wrap gap-2">
                  <a
                    href={current.image}
                    download={`miniatura-v${active + 1}.png`}
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200"
                  >
                    <Download size={16} /> Descargar
                  </a>
                  <Button variant="secondary" icon={RotateCcw} onClick={generate} loading={loading === 'generate'}>
                    Generar otra version
                  </Button>
                  <Button variant="secondary" onClick={() => setShowPrompt(!showPrompt)}>
                    {showPrompt ? 'Ocultar prompt' : 'Ver prompt'}
                  </Button>
                </div>
                {showPrompt && (
                  <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-white/5 bg-black/40 p-3 text-xs text-neutral-400">
                    {current.prompt}
                  </pre>
                )}
              </div>
            ) : (
              <EmptyState icon={ImageIcon} title="Sin miniatura" description="Genera la primera version desde el paso 3." />
            )}
          </ContentCard>

          <div className="space-y-6">
            <ContentCard title="Ajustes">
              <div className="space-y-3">
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className={inputClass}
                  placeholder="Ej: titulo un 20% mas grande, mas glow en el rojo"
                />
                <Button icon={Sparkles} onClick={refine} disabled={!current || !feedback.trim()} loading={loading === 'refine'}>
                  Aplicar cambio
                </Button>
              </div>
            </ContentCard>
            {versions.length > 0 && (
              <ContentCard title="Versiones">
                <div className="grid grid-cols-2 gap-2">
                  {versions.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActive(i)}
                      className={`overflow-hidden rounded-md border ${i === active ? 'border-white/40' : 'border-white/5'}`}
                      title={v.note}
                    >
                      <img src={v.image} alt={`Version ${i + 1}`} className="aspect-video w-full object-cover" />
                    </button>
                  ))}
                </div>
              </ContentCard>
            )}
          </div>
        </div>
      )}

      {step < 3 && (
        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setStep(step - 1)} disabled={step === 0}>
            Atras
          </Button>
          {step < 2 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canNext}>
              Siguiente
            </Button>
          ) : (
            <Button icon={Sparkles} onClick={generate} disabled={!canNext || !readyPhotos.length} loading={loading === 'generate'}>
              Generar miniatura
            </Button>
          )}
        </div>
      )}

      {loading === 'generate' && (
        <p className="text-center text-xs text-neutral-600">Generando en alta calidad. Puede tardar hasta 1-2 minutos.</p>
      )}
    </div>
  );
}

function PageHeader({ models }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight metallic-text">Estudio de Miniaturas</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Referencia, fotos y texto. Miniaturas ultra realistas que respetan a cada persona.
        {models?.imageModel && <span className="ml-1 text-neutral-700">Motor: {models.imageModel}</span>}
      </p>
    </div>
  );
}
