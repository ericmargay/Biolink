# Eric Margay — Biolink

Un jardín digital open source que reúne proyectos, CV, experiencia en Machine Learning, ingeniería de datos y sistemas embebidos.

**Sitio:** [ericmargay.github.io/Biolink](https://ericmargay.github.io/Biolink/)

## Lo especial

- Tres avatares animados hechos con CSS: medusa, bot y orbe.
- Fondo generativo en Canvas que responde al cursor.
- Soundtrack interactivo procesado con Web Audio API y activado al tocar el avatar. Toda la pantalla funciona como un pad XY: arriba conserva la señal limpia; abajo incrementa el efecto; izquierda aplica distorsión y derecha saturación.
- Personalizador con paletas, color libre, densidad, velocidad, grano y reacciones al cursor.
- Preferencias locales mediante `localStorage`.
- Tarjetas externas y colecciones desplegables para proyectos, certificaciones, recomendaciones o cualquier categoría nueva.
- Once logotipos sociales de demostración reutilizados desde el sprite local `icons/icons.svg`; se pueden quitar, reordenar o reemplazar desde `data.json`.
- Diseño accesible, responsive y respetuoso de `prefers-reduced-motion`.
- Sin frameworks, dependencias, cookies ni proceso de compilación.

## Editar el contenido

Los textos, redes, destinos y colecciones viven en `data.json`. La apariencia está en `css/styles.css` y la interacción en `js/app.js`.

Una tarjeta puede tener `url` para abrir un enlace, o `collection` para mostrar una subsección dentro del sitio. Cada colección admite título, introducción y cualquier número de elementos. Esto permite convertir la plantilla en un perfil para música, diseño, investigación, educación o productos sin tocar JavaScript.

## Probar localmente

```bash
python3 -m http.server 4173
```

Después abre `http://localhost:4173/`.

## Publicar en GitHub Pages

En **Settings → Pages**, selecciona **Deploy from a branch**, la rama `main` y la carpeta raíz. No se necesitan secretos ni servicios externos.

## Licencia

[MIT](LICENSE)
