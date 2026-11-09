# Estudio de Miniaturas — cerebro de Claude

Este proyecto existe para una sola cosa: diseñar miniaturas de YouTube ultra realistas con Fran. Marca personal primero; también B2B, infoproductos y e-commerce. No se habla de otros temas acá.

## Antes de cualquier miniatura, leé

1. `conocimiento/packaging.md`: principios del SOP de My Consulting. Mandan sobre todo lo demás.
2. `conocimiento/metodologia.md`: qué se analiza de una referencia, reglas de conservación de identidad y reglas por nicho.
3. `historial.md`: lo que ya funcionó y lo que no (CTR reales, preferencias de Fran). Aplicalo.

## Flujo paso a paso (`/miniatura`)

1. **Brief.** Creá `proyectos/AAAA-MM-DD-<slug>/` y copiá `plantillas/brief.md` adentro. Preguntá solo lo que falte: nicho, título exacto, subtítulo, colores, camino (A replicar / B híbrido), etapa del canal (chico o con data).
2. **Referencia.** Fran deja la(s) miniatura(s) en la carpeta (`referencia.jpg`, `referencia-2.jpg`). Mirala y escribí el análisis en el brief con los 8 ejes de la metodología: layout, encuadre, iluminación, título, subtítulo, acabado, elementos, paleta. En Camino A, marcá qué cambios sutiles vas a hacer. En Camino B, qué elemento tomás de cada referencia.
3. **Fotos.** Fran deja `foto-1.jpg`, `foto-2.jpg`... Miralas. Si la emoción no es clara o la cara está borrosa, decilo y pedí otro frame antes de generar. Nunca se cambia la cara para "arreglar" la emoción.
4. **Control de elementos.** Contá los elementos (caras + título + subtítulo + flechas + logos + objetos). Si son más de 5, proponé qué sacar. Ideal 3.
5. **Prompt.** Escribí `prompt.txt` en la carpeta del proyecto con esta estructura, en inglés y con el texto de la miniatura entre comillas, exacto:
   - INPUT IMAGES: qué es cada imagen, en el mismo orden en que se pasan al script. La referencia va última y se marca como "STYLE REFERENCE ONLY, never copy its people".
   - IDENTITY PRESERVATION: rasgos, cabeza, pelo, anteojos, cuerpo, ropa, fondo, expresión y mirada idénticos. Sin filtros de belleza ni piel plástica.
   - ENHANCEMENT: exposición, nitidez, contraste, luz de relleno suave, reencuadre con caras grandes y aire abajo para el título.
   - VISUAL SPEC: el análisis de la referencia, medible (posiciones, proporciones, hex).
   - PACKAGING: colores saturados y vivos, máximo N elementos, emoción a destacar.
   - TEXT: título y subtítulo exactos, nítidos, sin tapar caras. Sin marca de agua ni logo salvo que se pida.
6. **Generar.**
   ```bash
   node scripts/generar.mjs --dir proyectos/<carpeta> --imagenes foto-1.jpg,foto-2.jpg,referencia.jpg
   ```
   Guarda `salida/v1.png`, `v2.png`... y copia el prompt usado al lado (`v1.prompt.txt`).
7. **QA.** Abrí el PNG y revisalo con el checklist de packaging y el de la metodología: identidad, texto exacto letra por letra, legibilidad a tamaño celular, caras sin tapar, cantidad de elementos. Si falla algo, corregí el prompt y regenerá antes de mostrarlo.
8. **Ajustes (`/ajuste`).** Para cambios puntuales, prompt nuevo (`ajuste.txt`) que pide solo ese cambio y mantiene todo lo demás. La miniatura actual va como primera imagen, después las fotos originales:
   ```bash
   node scripts/generar.mjs --dir proyectos/<carpeta> --prompt ajuste.txt --imagenes salida/v1.png,foto-1.jpg,foto-2.jpg
   ```
9. **Variante A/B (`/variante`).** Solo si el canal tiene data. Fase 1: otro concepto validado. Fase 2: un único cambio sutil sobre la ganadora (color, emoción, cifra, posición).
10. **Cierre.** Anotá en `historial.md` qué se entregó, qué camino, qué aprendiste de las correcciones de Fran. Cuando Fran pase el CTR, actualizalo ahí.

## Reglas

- Español argentino, directo, sin fluff.
- Nunca alterar la identidad de una persona: cara, cuerpo, ropa y fondo se respetan siempre.
- El título se escribe exacto. Si es largo (más de 4 palabras), proponé una versión más corta antes de generar.
- Sin marca de agua ni logo salvo que Fran lo pida.
- Las fotos de clientes no se suben a git (ver `.gitignore`).
- Cada corrección de Fran que sea una preferencia general va a `historial.md` en "Preferencias". Así aprendés.

## Setup

1. `cp .env.example .env` y poné `OPENAI_API_KEY`.
2. Node 18 o superior. No hay dependencias que instalar.
3. Modelo por defecto: `gpt-image-1`, calidad alta, `input_fidelity: high`, 1536x1024. Se cambia con `OPENAI_IMAGE_MODEL` en `.env`.
