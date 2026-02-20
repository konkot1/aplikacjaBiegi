import React, { useState } from 'react';

export default function KategorieManager({ kategorie, setKategorie }) {
  const [nowa, setNowa] = useState('');
  const [edytowanaIdx, setEdytowanaIdx] = useState(null);
  const [edytowanaWartość, setEdytowanaWartość] = useState('');

  const dodaj = () => {
    const trimmed = nowa.trim();
    if (!trimmed) return;
    if (kategorie.includes(trimmed)) {
      alert('Taka kategoria już istnieje');
      return;
    }
    setKategorie([...kategorie, trimmed]);
    setNowa('');
  };

  const usun = (idx) => {
    if (!window.confirm(`Czy na pewno usunąć kategorię "${kategorie[idx]}"?`)) return;
    setKategorie(kategorie.filter((_, i) => i !== idx));
  };

  const startEdycja = (idx) => {
    setEdytowanaIdx(idx);
    setEdytowanaWartość(kategorie[idx]);
  };

  const zapiszEdycje = () => {
    const trimmed = edytowanaWartość.trim();
    if (!trimmed) return;
    const updated = [...kategorie];
    updated[edytowanaIdx] = trimmed;
    setKategorie(updated);
    setEdytowanaIdx(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Kategorie wiekowe</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={nowa}
          onChange={e => setNowa(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && dodaj()}
          className="border rounded px-3 py-1.5 text-sm flex-1 max-w-xs"
          placeholder="np. M30-39"
        />
        <button
          onClick={dodaj}
          className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Dodaj kategorię
        </button>
      </div>
      <div className="space-y-1">
        {kategorie.map((k, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 border rounded bg-white hover:bg-gray-50">
            {edytowanaIdx === idx ? (
              <>
                <input
                  type="text"
                  value={edytowanaWartość}
                  onChange={e => setEdytowanaWartość(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && zapiszEdycje()}
                  className="border rounded px-2 py-1 text-sm flex-1"
                  autoFocus
                />
                <button onClick={zapiszEdycje} className="text-sm text-green-600 hover:underline">Zapisz</button>
                <button onClick={() => setEdytowanaIdx(null)} className="text-sm text-gray-500 hover:underline">Anuluj</button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm">{k}</span>
                <button onClick={() => startEdycja(idx)} className="text-sm text-blue-600 hover:underline">Edytuj</button>
                <button onClick={() => usun(idx)} className="text-sm text-red-600 hover:underline">Usuń</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
