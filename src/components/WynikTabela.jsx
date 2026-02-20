import React, { useState, useMemo } from 'react';
import { obliczMiejsca } from '../utils/sortowanie';

export default function WynikTabela({ zawodnicy, dystanse, kategorie, kluby, kraje, aktywnyEvent, stoperBiega, stoperSekund, onStopZawodnik }) {
  const [filtryDystans, setFiltryDystans] = useState('');
  const [filtryKategoria, setFiltryKategoria] = useState('');
  const [filtryKraj, setFiltryKraj] = useState('');
  const [filtryKlub, setFiltryKlub] = useState('');

  const zawodnicyEventu = useMemo(() => {
    if (!aktywnyEvent) return [];
    return zawodnicy.filter(z => z.eventId === aktywnyEvent.id);
  }, [zawodnicy, aktywnyEvent]);

  const zawodnicyZMiejscami = useMemo(() => {
    let filtered = zawodnicyEventu;
    if (filtryDystans) filtered = filtered.filter(z => z.dystans === filtryDystans);
    return obliczMiejsca(filtered);
  }, [zawodnicyEventu, filtryDystans]);

  const zawodnicyFiltered = useMemo(() => {
    let filtered = zawodnicyZMiejscami;
    if (filtryKategoria) filtered = filtered.filter(z => z.kategoria === filtryKategoria);
    if (filtryKraj) filtered = filtered.filter(z => z.kraj === filtryKraj);
    if (filtryKlub) filtered = filtered.filter(z => z.klub === filtryKlub);
    return filtered;
  }, [zawodnicyZMiejscami, filtryKategoria, filtryKraj, filtryKlub]);

  const medalStyle = (miejsce) => {
    if (miejsce === 1) return 'bg-yellow-100 font-bold';
    if (miejsce === 2) return 'bg-gray-100 font-bold';
    if (miejsce === 3) return 'bg-orange-100 font-bold';
    return '';
  };

  return (
    <div className="dark:text-white">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
          {aktywnyEvent ? aktywnyEvent.nazwa : 'Brak aktywnego eventu'}
        </h2>
        {aktywnyEvent && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {aktywnyEvent.miejscowosc} | {aktywnyEvent.data}
          </p>
        )}
      </div>

      {/* Filtry */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filtryDystans}
          onChange={e => setFiltryDystans(e.target.value)}
          className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="">Wszystkie dystanse</option>
          {dystanse.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={filtryKategoria}
          onChange={e => setFiltryKategoria(e.target.value)}
          className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="">Wszystkie kategorie</option>
          {kategorie.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <select
          value={filtryKraj}
          onChange={e => setFiltryKraj(e.target.value)}
          className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="">Wszystkie kraje</option>
          {kraje.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        <select
          value={filtryKlub}
          onChange={e => setFiltryKlub(e.target.value)}
          className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="">Wszystkie kluby</option>
          {kluby.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
        {(filtryDystans || filtryKategoria || filtryKraj || filtryKlub) && (
          <button
            onClick={() => { setFiltryDystans(''); setFiltryKategoria(''); setFiltryKraj(''); setFiltryKlub(''); }}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Wyczyść filtry
          </button>
        )}
      </div>

      {!aktywnyEvent ? (
        <div className="text-gray-500 dark:text-gray-400 text-center py-10">Ustaw aktywny event w zakładce Eventy</div>
      ) : zawodnicyFiltered.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-center py-10">Brak zawodników dla wybranych filtrów</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="px-3 py-2 text-left">Mce</th>
                <th className="px-3 py-2 text-left">Nr</th>
                <th className="px-3 py-2 text-left">Imię i Nazwisko</th>
                <th className="px-3 py-2 text-left">Kat.</th>
                <th className="px-3 py-2 text-left">Klub/Szkoła [Kraj]</th>
                <th className="px-3 py-2 text-left">Z/M</th>
                <th className="px-3 py-2 text-left">Czas</th>
                <th className="px-3 py-2 text-left">STOP</th>
              </tr>
            </thead>
            <tbody>
              {zawodnicyFiltered.map((z, idx) => (
                <tr
                  key={z.id}
                  className={`border-b dark:border-gray-600 ${z.dnf ? 'text-gray-400 italic' : medalStyle(z.miejsceOgolne)} ${!z.dnf && !medalStyle(z.miejsceOgolne) && idx % 2 === 1 ? 'bg-gray-50 dark:bg-gray-700' : 'dark:bg-gray-800'}`}
                >
                  <td className="px-3 py-1.5">{z.dnf ? '—' : z.miejsceOgolne}</td>
                  <td className="px-3 py-1.5">{z.nrStartowy}</td>
                  <td className="px-3 py-1.5">{z.imieNazwisko}</td>
                  <td className="px-3 py-1.5">{z.kategoria}</td>
                  <td className="px-3 py-1.5">
                    {z.klub ? `${z.klub} [${z.kraj || 'POL'}]` : (z.kraj || 'POL')}
                  </td>
                  <td className="px-3 py-1.5">{z.dnf ? '—' : z.miejsceKategoria}</td>
                  <td className="px-3 py-1.5 font-mono">{z.dnf ? 'DNF' : (z.czas || '—')}</td>
                  <td className="px-3 py-1.5">
                    {!z.dnf && (
                      z.czas ? (
                        <span className="text-green-600 text-xs font-mono">✅ {z.czas}</span>
                      ) : (
                        <button
                          disabled={!stoperBiega}
                          onClick={() => onStopZawodnik && onStopZawodnik(z.id, stoperSekund)}
                          className="px-2 py-0.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs rounded"
                        >
                          STOP
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Łącznie: {zawodnicyFiltered.length} zawodników</p>
        </div>
      )}
    </div>
  );
}

