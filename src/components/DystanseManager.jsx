import React, { useState } from 'react';

export default function DystanseManager({ dystanse, setDystanse }) {
  const [nowy, setNowy] = useState('');
  const [edytowanyIdx, setEdytowanyIdx] = useState(null);
  const [edytowanaWartość, setEdytowanaWartość] = useState('');

  const dodaj = () => {
    const trimmed = nowy.trim();
    if (!trimmed) return;
    if (dystanse.includes(trimmed)) {
      alert('Taki dystans już istnieje');
      return;
    }
    setDystanse([...dystanse, trimmed]);
    setNowy('');
  };

  const usun = (idx) => {
    if (!window.confirm(`Czy na pewno usunąć dystans "${dystanse[idx]}"?`)) return;
    setDystanse(dystanse.filter((_, i) => i !== idx));
  };

  const startEdycja = (idx) => {
    setEdytowanyIdx(idx);
    setEdytowanaWartość(dystanse[idx]);
  };

  const zapiszEdycje = () => {
    const trimmed = edytowanaWartość.trim();
    if (!trimmed) return;
    const updated = [...dystanse];
    updated[edytowanyIdx] = trimmed;
    setDystanse(updated);
    setEdytowanyIdx(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Dystanse</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={nowy}
          onChange={e => setNowy(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && dodaj()}
          className="border rounded px-3 py-1.5 text-sm flex-1 max-w-xs"
          placeholder="np. 5 km"
        />
        <button
          onClick={dodaj}
          className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Dodaj dystans
        </button>
      </div>
      <div className="space-y-1">
        {dystanse.map((d, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 border rounded bg-white hover:bg-gray-50">
            {edytowanyIdx === idx ? (
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
                <button onClick={() => setEdytowanyIdx(null)} className="text-sm text-gray-500 hover:underline">Anuluj</button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm">{d}</span>
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
