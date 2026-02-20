import React from 'react';

const zakladki = [
  { id: 'wyniki', label: 'Wyniki' },
  { id: 'zawodnicy', label: 'Zawodnicy' },
  { id: 'kategorie', label: 'Kategorie' },
  { id: 'dystanse', label: 'Dystanse' },
  { id: 'kluby', label: 'Kluby' },
  { id: 'kraje', label: 'Kraje' },
  { id: 'eventy', label: 'Eventy' },
  { id: 'importexport', label: 'Import/Export' },
];

export default function Navbar({ aktywnaZakladka, setAktywnaZakladka, ciemnyTryb, setCiemnyTryb }) {
  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-gray-800 dark:to-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-14 gap-1 overflow-x-auto">
          <span className="font-bold text-lg mr-4 whitespace-nowrap">🏃 Biegi</span>
          {zakladki.map(z => (
            <button
              key={z.id}
              onClick={() => setAktywnaZakladka(z.id)}
              className={`px-3 py-2 rounded text-sm font-medium whitespace-nowrap transition-colors ${
                aktywnaZakladka === z.id
                  ? 'bg-white/20 text-white font-bold'
                  : 'hover:bg-blue-600'
              }`}
            >
              {z.label}
            </button>
          ))}
          <button
            onClick={() => setCiemnyTryb(prev => !prev)}
            className="ml-auto px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-lg"
            title={ciemnyTryb ? 'Tryb jasny' : 'Tryb ciemny'}
          >
            {ciemnyTryb ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}

