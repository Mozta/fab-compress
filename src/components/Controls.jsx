import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Controls({ settings, onSettingsChange, onCompress, imageCount, isProcessing, progress }) {
  const { t } = useLanguage();
  const [showDimHint, setShowDimHint] = useState(false);

  const handleChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const QUALITY_PRESETS = [
    { label: t('controls.presetLow'), value: 80, description: t('controls.presetLowDesc') },
    { label: t('controls.presetHigh'), value: 60, description: t('controls.presetHighDesc') },
    { label: t('controls.presetExtreme'), value: 40, description: t('controls.presetExtremeDesc') },
  ];

  const activePreset = QUALITY_PRESETS.find((p) => p.value === settings.quality);

  const compressLabel = imageCount > 0
    ? `${t('controls.compress')} (${imageCount} ${imageCount > 1 ? t('controls.images') : t('controls.image')})`
    : t('controls.compress');

  return (
    <div className="bg-surface-800/80 backdrop-blur-xl border border-surface-600/50 rounded-2xl p-6 space-y-5">
      <h2 className="text-white font-semibold text-lg flex items-center gap-2">
        <svg className="w-5 h-5 text-fab-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {t('controls.settings')}
      </h2>

      {/* Quality presets */}
      <div>
        <label className="text-gray-300 text-sm font-medium block mb-2">{t('controls.qualityPreset')}</label>
        <div className="grid grid-cols-3 gap-1.5">
          {QUALITY_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleChange('quality', preset.value)}
              className={`
                py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 text-center leading-tight
                ${settings.quality === preset.value
                  ? 'bg-fab-500/20 text-fab-400 border border-fab-500/40 shadow-sm shadow-fab-500/10'
                  : 'bg-surface-700 text-gray-400 hover:text-white hover:bg-surface-600 border border-transparent'
                }
              `}
              title={preset.description}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quality slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-gray-300 text-sm font-medium">{t('controls.quality')}</label>
          <span className="text-fab-400 font-mono text-sm font-bold">{settings.quality}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={settings.quality}
          onChange={(e) => handleChange('quality', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{t('controls.moreCompression')}</span>
          <span>{t('controls.moreQuality')}</span>
        </div>
      </div>

      {/* Max dimensions */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <label className="text-gray-300 text-sm font-medium">{t('controls.maxDimensions')}</label>
          <button
            className="text-gray-500 hover:text-fab-400 transition-colors relative"
            onMouseEnter={() => setShowDimHint(true)}
            onMouseLeave={() => setShowDimHint(false)}
            onClick={() => setShowDimHint((v) => !v)}
            aria-label={t('controls.dimInfoAria')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Tooltip */}
        {showDimHint && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-fab-500/10 border border-fab-500/20 text-xs text-fab-300 leading-relaxed animate-fade-in-up" style={{ animationDuration: '200ms' }}>
            {t('controls.dimHint')}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">{t('controls.maxWidth')}</label>
            <input
              type="number"
              min="100"
              max="6000"
              step="100"
              value={settings.maxWidth}
              onChange={(e) => handleChange('maxWidth', parseInt(e.target.value) || 1920)}
              className="w-full bg-surface-700 border border-surface-500 text-white rounded-lg px-3 py-2 text-sm focus:border-fab-400 focus:outline-none focus:ring-1 focus:ring-fab-400/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">{t('controls.maxHeight')}</label>
            <input
              type="number"
              min="100"
              max="6000"
              step="100"
              value={settings.maxHeight}
              onChange={(e) => handleChange('maxHeight', parseInt(e.target.value) || 1920)}
              className="w-full bg-surface-700 border border-surface-500 text-white rounded-lg px-3 py-2 text-sm focus:border-fab-400 focus:outline-none focus:ring-1 focus:ring-fab-400/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Output format */}
      <div>
        <label className="text-gray-300 text-sm font-medium block mb-2">{t('controls.outputFormat')}</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'image/jpeg', label: 'JPEG' },
            { value: 'image/webp', label: 'WebP' },
            { value: 'image/png', label: 'PNG' },
          ].map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => handleChange('format', fmt.value)}
              className={`
                py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                ${settings.format === fmt.value
                  ? 'bg-fab-500 text-white shadow-lg shadow-fab-500/30'
                  : 'bg-surface-700 text-gray-400 hover:text-white hover:bg-surface-600'
                }
              `}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compress button */}
      <button
        onClick={onCompress}
        disabled={imageCount === 0 || isProcessing}
        className={`
          w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300
          ${imageCount === 0 || isProcessing
            ? 'bg-surface-700 text-gray-500 cursor-not-allowed disabled-btn'
            : 'bg-gradient-to-r from-fab-500 to-fab-600 text-white hover:from-fab-400 hover:to-fab-500 shadow-lg shadow-fab-500/25 hover:shadow-fab-400/40 hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {t('controls.compressing')} {progress.total > 0 ? `${progress.current}/${progress.total}` : '...'}
          </span>
        ) : (
          compressLabel
        )}
      </button>
    </div>
  );
}
