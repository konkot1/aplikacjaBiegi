import React, { useRef } from 'react';
import { eksportujPDF } from '../utils/eksportPDF';
import { eksportujExcel } from '../utils/eksportExcel';
import { obliczMiejsca } from '../utils/sortowanie';

export default function ImportExport({ state, setState, aktywnyEvent, zawodnicy }) {
  const fileRef = useRef();

  const exportTXT = () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aplikacja_biegi_backup.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTXT = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (window.confirm('Czy na pewno nadpisać wszystkie dane?')) {
          setState(data);
        }
      } catch {
        alert('Błąd: nieprawidłowy format pliku');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const zawodnicyEventu = aktywnyEvent
    ? obliczMiejsca(zawodnicy.filter(z => z.eventId === aktywnyEvent.id))
    : [];

  const handlePDF = () => {
    if (!aktywnyEvent) { alert('Brak aktywnego eventu'); return; }
    eksportujPDF(zawodnicyEventu, aktywnyEvent);
  };

  const handleExcel = () => {
    if (!aktywnyEvent) { alert('Brak aktywnego eventu'); return; }
    eksportujExcel(zawodnicyEventu, aktywnyEvent);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Import / Export</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded p-4 bg-white">
          <h3 className="font-semibold text-gray-700 mb-3">📁 Backup danych</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">Eksportuj wszystkie dane aplikacji do pliku .txt (JSON)</p>
              <button
                onClick={exportTXT}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Eksportuj do .txt
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Importuj dane z pliku .txt (nadpisuje wszystkie dane)</p>
              <button
                onClick={() => fileRef.current.click()}
                className="px-4 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
              >
                Importuj z .txt
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.json"
                onChange={importTXT}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="border rounded p-4 bg-white">
          <h3 className="font-semibold text-gray-700 mb-3">📊 Eksport wyników</h3>
          <p className="text-sm text-gray-500 mb-3">
            Aktywny event: <strong>{aktywnyEvent ? aktywnyEvent.nazwa : '— brak —'}</strong>
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">Eksportuj tabelę wyników aktywnego eventu do PDF</p>
              <button
                onClick={handlePDF}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Eksportuj do PDF
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Eksportuj tabelę wyników do Excel (.xlsx)</p>
              <button
                onClick={handleExcel}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Eksportuj do Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
