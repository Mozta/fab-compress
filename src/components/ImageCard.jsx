import { useState, useEffect, useRef } from 'react';
import { formatFileSize } from '../utils/compressor';
import { useLanguage } from '../i18n/LanguageContext';

export default function ImageCard({ item, index, onRemove }) {
  const { t } = useLanguage();
  const { file, result, status } = item;
  const isProcessing = status === 'processing';
  const isDone = status === 'done';
  const isError = status === 'error';
  const isPending = status === 'pending';

  const savings = isDone ? ((1 - result.blob.size / file.size) * 100).toFixed(1) : 0;
  const savingsPositive = isDone && result.blob.size < file.size;

  // Manage object URL lifecycle to prevent memory leaks
  const [previewUrl, setPreviewUrl] = useState(null);
  const urlRef = useRef(null);

  useEffect(() => {
    // Revoke previous URL
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
    }
    const source = isDone ? result.blob : file;
    const url = URL.createObjectURL(source);
    urlRef.current = url;
    setPreviewUrl(url);

    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [file, isDone, result]);

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const ext = result.blob.type.split('/')[1] === 'jpeg' ? 'jpg' : result.blob.type.split('/')[1];
    a.href = url;
    a.download = `${baseName}_compressed.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="animate-fade-in-up bg-surface-800/80 backdrop-blur-xl border border-surface-600/50 rounded-2xl overflow-hidden hover:border-fab-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-fab-500/5 group/card relative"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Remove button */}
      {!isProcessing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(item.id);
          }}
          className="absolute top-2 left-2 z-10 w-7 h-7 rounded-full bg-surface-900/70 backdrop-blur-md border border-surface-500/40 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-200 opacity-0 group-hover/card:opacity-100 active:scale-90"
          aria-label={t('imageCard.removeAria')}
          title={t('imageCard.removeTitle')}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Image preview */}
      <div className="relative aspect-video bg-surface-900 overflow-hidden">
        {previewUrl && (
          <img
            src={previewUrl}
            alt={file.name}
            className="w-full h-full object-contain"
          />
        )}

        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-surface-900/70 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <svg className="animate-spin w-8 h-8 text-fab-400 mx-auto mb-2" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-gray-300 text-sm">{t('imageCard.compressing')}</span>
            </div>
          </div>
        )}

        {/* Savings badge */}
        {isDone && (
          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md ${
            savingsPositive
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {savingsPositive ? `−${savings}%` : `+${Math.abs(savings)}%`}
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="p-4">
        <h3 className="text-white text-sm font-medium truncate mb-3" title={file.name}>
          {file.name}
        </h3>

        {/* Pending state: show original size */}
        {isPending && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">{formatFileSize(file.size)}</span>
            <span className="text-gray-500 text-xs">• {t('imageCard.readyToCompress')}</span>
          </div>
        )}

        {isProcessing && (
          <div className="h-1.5 rounded-full overflow-hidden bg-surface-600">
            <div className="h-full shimmer-bar rounded-full w-full" />
          </div>
        )}

        {isError && (
          <p className="text-red-400 text-xs">{t('imageCard.compressionError')}</p>
        )}

        {isDone && (
          <>
            {/* Size comparison */}
            <div className="flex items-center gap-2 text-sm mb-3">
              <span className="text-gray-400">{formatFileSize(file.size)}</span>
              <svg className="w-4 h-4 text-fab-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="text-white font-semibold">{formatFileSize(result.blob.size)}</span>
            </div>

            {/* Dimensions */}
            <div className="text-xs text-gray-500 mb-4">
              {result.originalWidth}×{result.originalHeight} → {result.width}×{result.height}
            </div>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-fab-500/15 text-fab-400 border border-fab-500/30 hover:bg-fab-500/25 hover:text-fab-300 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t('imageCard.download')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
