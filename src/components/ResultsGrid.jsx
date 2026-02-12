import JSZip from 'jszip';
import ImageCard from './ImageCard';
import { formatFileSize, getExtension } from '../utils/compressor';

export default function ResultsGrid({ images, onClear, onRemoveImage }) {
  const completedImages = images.filter((img) => img.status === 'done');
  const hasResults = completedImages.length > 0;

  const totalOriginal = completedImages.reduce((acc, img) => acc + img.file.size, 0);
  const totalCompressed = completedImages.reduce((acc, img) => acc + img.result.blob.size, 0);
  const totalSavingsPercent = totalOriginal > 0
    ? ((1 - totalCompressed / totalOriginal) * 100).toFixed(1)
    : 0;

  const handleDownloadAll = async () => {
    if (completedImages.length === 0) return;

    if (completedImages.length === 1) {
      // Single file — download directly
      const img = completedImages[0];
      const url = URL.createObjectURL(img.result.blob);
      const a = document.createElement('a');
      const baseName = img.file.name.replace(/\.[^.]+$/, '');
      const ext = getExtension(img.result.blob.type);
      a.href = url;
      a.download = `${baseName}_compressed.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    // Multiple files — create ZIP
    const zip = new JSZip();
    completedImages.forEach((img) => {
      const baseName = img.file.name.replace(/\.[^.]+$/, '');
      const ext = getExtension(img.result.blob.type);
      zip.file(`${baseName}_compressed.${ext}`, img.result.blob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fabacademy_images_compressed.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (images.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      {hasResults && (
        <div className="animate-fade-in-up bg-surface-800/80 backdrop-blur-xl border border-surface-600/50 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Imágenes</p>
                <p className="text-white font-bold text-lg">{completedImages.length}</p>
              </div>
              <div className="w-px h-8 bg-surface-600 hidden sm:block" />
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Original</p>
                <p className="text-gray-300 font-semibold">{formatFileSize(totalOriginal)}</p>
              </div>
              <div>
                <svg className="w-4 h-4 text-fab-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Comprimido</p>
                <p className="text-fab-400 font-bold">{formatFileSize(totalCompressed)}</p>
              </div>
              <div className="w-px h-8 bg-surface-600 hidden sm:block" />
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Ahorro</p>
                <p className={`font-bold text-lg ${parseFloat(totalSavingsPercent) > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {totalSavingsPercent}%
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={onClear}
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl text-sm font-medium bg-surface-700 text-gray-400 hover:text-white hover:bg-surface-600 transition-all duration-200 active:scale-[0.97]"
              >
                Limpiar
              </button>
              <button
                onClick={handleDownloadAll}
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl text-sm font-medium bg-gradient-to-r from-fab-500 to-fab-600 text-white hover:from-fab-400 hover:to-fab-500 shadow-lg shadow-fab-500/25 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {completedImages.length > 1 ? 'Descargar ZIP' : 'Descargar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <ImageCard key={img.id} item={img} index={i} onRemove={onRemoveImage} />
        ))}
      </div>
    </div>
  );
}
