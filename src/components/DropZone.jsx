import { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function DropZone({ onFilesSelected, disabled }) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // Reset so the same files can be re-selected
    e.target.value = '';
  }, [onFilesSelected]);

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer
        transition-all duration-300 group
        ${isDragging
          ? 'drag-active border-fab-400 bg-fab-500/10 scale-[1.02]'
          : 'border-surface-500 hover:border-fab-500/50 hover:bg-surface-700/50'
        }
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className={`transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-105'}`}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-600 flex items-center justify-center group-hover:bg-fab-500/20 transition-colors duration-300 animate-float-icon">
          <svg className={`w-8 h-8 transition-colors duration-300 ${isDragging ? 'text-fab-400' : 'text-gray-400 group-hover:text-fab-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <p className="text-gray-300 font-medium mb-1">
          {isDragging ? t('dropzone.dropHere') : t('dropzone.dragAndDrop')}
        </p>
        <p className="text-gray-500 text-sm">
          {t('dropzone.clickToSelect')}
        </p>
      </div>
    </div>
  );
}
