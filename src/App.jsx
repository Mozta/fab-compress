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
      {/* Advanced textured background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(246, 9, 68, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(246, 9, 68, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />
        
        {/* Diagonal grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(246, 9, 68, 0.4) 40px, rgba(246, 9, 68, 0.4) 41px),
              repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(246, 9, 68, 0.4) 40px, rgba(246, 9, 68, 0.4) 41px)
            `
          }}
        />

        {/* Gradient mesh layers */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-fab-500/[0.08] via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-fab-600/[0.08] via-transparent to-transparent" />
        
        {/* Large geometric shapes */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-fab-500/[0.12] rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 -left-60 w-[500px] h-[500px] bg-fab-600/[0.15] rounded-full blur-3xl animate-float-medium" />
        <div className="absolute -bottom-32 right-1/4 w-[450px] h-[450px] bg-fab-400/[0.12] rounded-full blur-3xl animate-float-fast" />
        
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay'
          }}
        />
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
        <footer className="mt-16 text-center text-gray-400 text-xs space-y-2">
          <p>FabCompress — Compresión 100% local en tu navegador</p>
          <p>Tus imágenes nunca salen de tu dispositivo</p>
          <p className="mt-3">
            Desarrollada con ❤️ by{' '}
            <a
              href="https://github.com/Mozta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fab-500 hover:text-fab-400 underline underline-offset-2 transition-colors font-medium"
            >
              Mozta
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
