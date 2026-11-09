# Estudio de Miniaturas

Proyecto aparte de Claude Code dedicado solo a miniaturas de YouTube.

## Cómo abrirlo

```bash
cp -r estudio-miniaturas ~/estudio-miniaturas   # sacalo del repo del dashboard si querés tenerlo suelto
cd ~/estudio-miniaturas
cp .env.example .env                            # poné tu OPENAI_API_KEY
claude
```

Dentro de Claude Code:

- `/miniatura <cliente o tema>`: arranca una miniatura nueva paso a paso.
- `/ajuste <cambio>`: corrige la última versión sin tocar lo demás.
- `/variante fase 1|fase 2`: variante A/B según el SOP.

## Qué hay

- `CLAUDE.md`: el flujo y las reglas que Claude sigue.
- `conocimiento/packaging.md`: principios del SOP de My Consulting.
- `conocimiento/metodologia.md`: análisis de referencias y conservación de identidad. El dashboard también la usa.
- `historial.md`: memoria de preferencias y resultados (CTR). Se actualiza en cada miniatura.
- `plantillas/brief.md`: brief por miniatura.
- `proyectos/`: una carpeta por miniatura (no se sube a git).
- `scripts/generar.mjs`: llama a OpenAI y guarda `salida/vN.png`.
