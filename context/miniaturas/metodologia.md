# Metodología de miniaturas ultra realistas

Base de conocimiento del Estudio de Miniaturas. El backend la carga como contexto del análisis de referencias (`server/lib/thumbnail-prompt.js`). Editala para ajustar cómo se analizan y generan las miniaturas: los cambios se aplican en el próximo request, sin reiniciar.

## Principio rector

La miniatura mejora la foto, no la reemplaza. La persona tiene que verse exactamente como es: misma cara, misma ropa, mismo fondo. Lo que cambia es la luz, la nitidez, la composición y la capa gráfica (títulos, divisores, elementos).

## Qué se analiza de una referencia

1. **Layout.** Cuántas personas o paneles, cómo se dividen (split vertical, una sola persona, antes/después), proporción que ocupa cada panel, divisor (grosor, color).
2. **Encuadre.** Tamaño de la cara en el cuadro, altura de los ojos, cuánto aire queda abajo para el título, dirección de la mirada.
3. **Iluminación.** Temperatura (cálida/fría), contraste, luz de relleno en la cara, separación del fondo, viñeteado.
4. **Título.** Posición, tamaño relativo al ancho, tipografía (peso, condensada o no, mayúsculas), contenedor (rectángulo, esquinas, borde, glow), sombra, color del texto y del contenedor.
5. **Subtítulo.** Posición respecto del título, contenedor, tipografía (cursiva, peso), colores.
6. **Acabado.** Degradé oscuro abajo, glow, grano, saturación, viñeta.
7. **Elementos.** Flechas, íconos, logos, números, emojis, stickers. Qué cumple una función y qué es decoración.
8. **Paleta.** Colores dominantes de la capa gráfica (no de las fotos).

## Reglas de conservación (nunca se negocian)

- Rasgos faciales, forma de la cabeza, pelo, barba, anteojos, cuerpo y proporciones idénticos a la foto original.
- Misma ropa, mismos accesorios, mismo fondo de cada persona.
- Misma expresión y dirección de la mirada.
- Nada de filtros de belleza, piel plástica, dientes artificialmente blancos ni ojos agrandados.
- Textura de piel y tonos naturales.

## Qué sí se mejora

- Exposición, nitidez, contraste y rango dinámico.
- Luz de relleno suave sobre la cara, acabado similar a la referencia.
- Reencuadre para que la cara quede grande y protagonista, dejando espacio para el título.
- Limpieza de ruido y compresión.

## Texto

- El título se escribe exactamente como se indica, carácter por carácter. Sin traducir, sin agregar palabras.
- Máximo 2 bloques de texto (título + subtítulo). Si el título supera 4 palabras, pedir versión más corta.
- Formato numérico tipo resultado: `$20K - $135K`, `0 a 10.000`, `x3 en 60 días`.

## Por nicho

- **Marca personal / testimonios:** caras grandes, emoción genuina, resultado numérico en el título, subtítulo con el rubro.
- **B2B / servicios:** sobrio, contraste alto, una idea por miniatura, colores corporativos.
- **Infoproductos:** promesa concreta, contraste fuerte, número o transformación visible.
- **E-commerce:** producto nítido y protagonista, persona usándolo si hay, beneficio en 2-3 palabras.

## Checklist antes de entregar

- [ ] ¿Se reconoce a cada persona sin dudar?
- [ ] ¿El título se lee en un celular a tamaño miniatura?
- [ ] ¿El texto está escrito exacto, sin errores?
- [ ] ¿Las caras quedan libres de texto y elementos?
- [ ] ¿Sin marcas de agua ni logos que no se pidieron?
