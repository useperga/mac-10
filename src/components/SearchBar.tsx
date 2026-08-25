import React from 'react';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Takım ara (Galatasaray, Fenerbahçe...)',
}) => {
  return (
    <div id="search-bar-container" className="w-full relative select-none">
      <label htmlFor="team-search-input" className="sr-only">
        Takım ve yayıncı ara
      </label>
      <div className="relative flex items-center">
        {/* Arama İkonu */}
        <div
          className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"
          aria-hidden="true"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          id="team-search-input"
          type="text"
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          aria-label="Takım veya yayıncı kanal adına göre filtrele"
        />

        {/* Temizle Butonu */}
        {value.length > 0 && (
          <button
            id="search-clear-btn"
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label="Aramayı temizle"
            title="Aramayı temizle"
          >
            <div className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
