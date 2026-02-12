# FabCompress

**Compresión de imágenes 100% local (en tu navegador)**

Herramienta web que permite comprimir y optimizar imágenes directamente en el navegador, sin enviar ningún archivo a servidores externos. Diseñada como herramienta para la red de [Fab Academy](https://fabacademy.org) para optimizar imágenes de documentación.

---

## Características

- **Compresión local** — Todo el procesamiento ocurre en tu navegador. Tus imágenes nunca salen de tu dispositivo
- **Procesamiento por lotes** — Arrastra o selecciona múltiples imágenes a la vez
- **Formatos de salida** — JPEG, WebP y PNG
- **Control de calidad** — Ajusta la calidad de compresión de 10% a 100% con presets predefinidos
- **Redimensionamiento** — Define dimensiones máximas preservando la relación de aspecto
- **Previsualización** — Compara las imágenes originales con las comprimidas
- **Descarga individual o en ZIP** — Descarga cada imagen o todas juntas en un archivo ZIP
- **Modo claro / oscuro** — Interfaz con soporte para ambos temas
- **Diseño responsivo** — Funciona en escritorio, tablet y móvil

---

## Inicio rápido

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd compresor

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Build de producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

Para previsualizar el build:

```bash
npm run preview
```

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| [React 19](https://react.dev/) | Librería de UI |
| [Vite 7](https://vite.dev/) | Build tool y dev server |
| [Tailwind CSS 4](https://tailwindcss.com/) | Framework de estilos |
| [JSZip](https://stuk.github.io/jszip/) | Generación de archivos ZIP |
| [Canvas API](https://developer.mozilla.org/es/docs/Web/API/Canvas_API) | Compresión y redimensionamiento de imágenes |

---

## Estructura del proyecto

```
compresor/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/          # Recursos (íconos, imágenes)
│   ├── components/
│   │   ├── Controls.jsx     # Panel de ajustes de compresión
│   │   ├── DropZone.jsx     # Zona de arrastre de imágenes
│   │   ├── Header.jsx       # Encabezado con toggle de tema
│   │   ├── ImageCard.jsx    # Tarjeta de previsualización por imagen
│   │   └── ResultsGrid.jsx  # Cuadrícula de resultados
│   ├── utils/
│   │   └── compressor.js    # Lógica de compresión con Canvas API
│   ├── App.jsx          # Componente principal
│   ├── index.css        # Estilos globales y variables de tema
│   └── main.jsx         # Punto de entrada
├── index.html           # HTML principal
├── vite.config.js       # Configuración de Vite
└── package.json
```

---

## Uso

1. **Selecciona imágenes** — Arrastra archivos a la zona de carga o haz clic para seleccionarlos
2. **Configura los ajustes** — Elige formato, calidad y dimensiones máximas
3. **Comprime** — Haz clic en el botón de comprimir
4. **Descarga** — Descarga imágenes individuales o todas en un ZIP

---

## Autor

Desarrollado por **Rafael Pérez Aguirre** — [@Mozta](https://github.com/Mozta)

## Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).
