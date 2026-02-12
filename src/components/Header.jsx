export default function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header className="flex items-center justify-between py-8 md:py-12">
      <div className="flex-1" />

      {/* Center logo + title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fab-400 to-fab-600 flex items-center justify-center shadow-lg shadow-fab-500/30">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-fab-300 to-fab-500 bg-clip-text text-transparent">
            FabCompress
          </h1>
        </div>
        <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
          Comprime y optimiza tus imágenes directamente en el navegador para tu documentación del FabAcademy
        </p>
      </div>

      <div className="flex-1 flex justify-end">
        <div className="relative group/toggle">
          <button
            onClick={onToggleDarkMode}
            className="relative w-11 h-11 rounded-xl bg-surface-700 hover:bg-surface-600 border border-surface-500/50 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {/* Sun icon */}
            <svg
              className={`w-5 h-5 absolute transition-all duration-300 ${
                darkMode
                  ? 'opacity-0 rotate-90 scale-0'
                  : 'opacity-100 rotate-0 scale-100 text-amber-500'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {/* Moon icon */}
            <svg
              className={`w-5 h-5 absolute transition-all duration-300 ${
                darkMode
                  ? 'opacity-100 rotate-0 scale-100 text-fab-400'
                  : 'opacity-0 -rotate-90 scale-0'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          {/* Hover tooltip */}
          <span className="absolute -bottom-8 right-0 px-2 py-1 rounded-md bg-surface-700 border border-surface-500/50 text-[10px] text-gray-400 whitespace-nowrap opacity-0 group-hover/toggle:opacity-100 transition-opacity duration-200 pointer-events-none">
            {darkMode ? 'Modo claro' : 'Modo oscuro'}
          </span>
        </div>
      </div>
    </header>
  );
}
