import { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import DropZone from './components/DropZone';
import Controls from './components/Controls';
import ResultsGrid from './components/ResultsGrid';
import { compressImage } from './utils/compressor';

let nextId = 0;

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('fabcompress-theme');
    return saved ? saved === 'dark' : true; // default to dark
  });
  const [images, setImages] = useState([]);
  const [settings, setSettings] = useState({
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1920,
    format: 'image/jpeg',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('fabcompress-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const handleFilesSelected = useCallback((files) => {
    const newImages = files.map((file) => ({
      id: nextId++,
      file,
      result: null,
      status: 'pending', // pending | processing | done | error
    }));
    setImages((prev) => [...newImages, ...prev]);
  }, []);

  const handleRemoveImage = useCallback((id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const handleCompress = useCallback(async () => {
    setIsProcessing(true);

    // Get current images that need compression (pending or already done — re-compress all)
    setImages((prev) =>
      prev.map((img) => ({ ...img, status: 'processing', result: null }))
    );

    // Process sequentially to avoid memory issues with large batches
    const currentImages = [...images.map((img) => ({ ...img }))];
    const total = currentImages.length;
    setProgress({ current: 0, total });

    for (let i = 0; i < currentImages.length; i++) {
      const img = currentImages[i];
      setProgress({ current: i + 1, total });
      try {
        const result = await compressImage(img.file, {
          quality: settings.quality / 100,
          maxWidth: settings.maxWidth,
          maxHeight: settings.maxHeight,
          format: settings.format,
        });

        setImages((prev) =>
          prev.map((item) =>
            item.id === img.id ? { ...item, status: 'done', result } : item
          )
        );
      } catch (error) {
        console.error('Compression failed for', img.file.name, error);
        setImages((prev) =>
          prev.map((item) =>
            item.id === img.id ? { ...item, status: 'error' } : item
          )
        );
      }
    }

    setIsProcessing(false);
    setProgress({ current: 0, total: 0 });
  }, [images, settings]);

  const handleClear = useCallback(() => {
    setImages([]);
  }, []);

  const pendingOrDoneCount = images.length;

  return (
    <div className="min-h-screen bg-surface-900 text-white">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-fab-500/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-fab-600/5 rounded-full blur-3xl animate-float-medium" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-fab-400/5 rounded-full blur-3xl animate-float-fast" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 pb-12">
        <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main area */}
          <div className="space-y-6">
            <DropZone onFilesSelected={handleFilesSelected} disabled={isProcessing} />
            <ResultsGrid images={images} onClear={handleClear} onRemoveImage={handleRemoveImage} />
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <Controls
              settings={settings}
              onSettingsChange={setSettings}
              onCompress={handleCompress}
              imageCount={pendingOrDoneCount}
              isProcessing={isProcessing}
              progress={progress}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600 text-xs space-y-2">
          <p>FabCompress — Compresión 100% local en tu navegador</p>
          <p>Tus imágenes nunca salen de tu dispositivo 🔒</p>
          <p className="mt-3">
            Herramienta creada para{' '}
            <a
              href="https://fabacademy.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fab-500 hover:text-fab-400 underline underline-offset-2 transition-colors"
            >
              Fab Academy
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
