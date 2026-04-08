'use client';

import { useState, useEffect, useRef } from 'react';

interface ExerciseResult {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  instructions: string[];
}

interface ExerciseSearchInputProps {
  value: string;
  onChange: (name: string, details?: any) => void;
  className?: string;
  placeholder?: string;
}

export function ExerciseSearchInput({
  value,
  onChange,
  className = '',
  placeholder = 'Buscar ejercicio...',
}: ExerciseSearchInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastSearched, setLastSearched] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 3 && query !== lastSearched) {
        setIsLoading(true);
        try {
          // Fix: use `query` param name as expected by the API route
          const res = await fetch(`/api/exercises?query=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data.results || []);
            setLastSearched(query);
          } else {
            console.error('API error', res.status);
            setResults([]);
          }
        } catch (err) {
          console.error('Fetch failed', err);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else if (query.length < 3) {
        setResults([]);
        setLastSearched('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, lastSearched]);

  const handleSelect = (item: ExerciseResult) => {
    setQuery(item.name);
    setIsOpen(false);
    onChange(item.name, {
      gifUrl: item.gifUrl,
      target: item.target,
      instructions: item.instructions,
      bodyPart: item.bodyPart,
      equipment: item.equipment,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    onChange(val);
  };

  const showDropdown = isOpen && (isLoading || query.length >= 3);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        className={`w-full ${className}`}
        placeholder={placeholder}
        autoComplete="off"
      />

      {showDropdown && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant/10 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-on-surface-variant text-sm font-bold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
              Buscando ejercicios...
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((item) => (
                <li
                  key={item.id}
                  className="hover:bg-surface-container-highest cursor-pointer transition-colors border-b border-outline-variant/5 last:border-b-0"
                  onMouseDown={(e) => {
                    // Use mousedown so it fires before onBlur/outside-click
                    e.preventDefault();
                    handleSelect(item);
                  }}
                >
                  <div className="flex items-center p-3 gap-4">
                    {(() => {
                      const gifToShow = item.gifUrl || (item.id.length === 4 ? `/api/exercises/image/${item.id}` : null);
                      return gifToShow ? (
                        <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                          <img
                            src={gifToShow}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-cover mix-blend-multiply"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex-shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline-variant text-xl">fitness_center</span>
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <p className="font-headline font-bold text-on-surface mb-1 capitalize truncate">{item.name}</p>
                      <div className="flex gap-2 text-[10px] uppercase tracking-widest font-bold flex-wrap">
                        {item.target && (
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">{item.target}</span>
                        )}
                        {item.equipment && (
                          <span className="text-on-surface-variant px-2 py-0.5 rounded border border-outline-variant/20">
                            {item.equipment}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : !isLoading && query.length >= 3 ? (
            <div className="p-4 text-center">
              <p className="text-on-surface-variant text-sm mb-1">Sin resultados en la base de datos.</p>
              <p className="text-primary text-xs font-bold">Se usará &ldquo;{query}&rdquo; como nombre personalizado.</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
