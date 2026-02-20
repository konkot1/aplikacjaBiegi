import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WynikTabela from './components/WynikTabela';
import ZawodnikForm from './components/ZawodnikForm';
import KategorieManager from './components/KategorieManager';
import DystanseManager from './components/DystanseManager';
import KlubyManager from './components/KlubyManager';
import KrajeManager from './components/KrajeManager';
import EventyManager from './components/EventyManager';
import ImportExport from './components/ImportExport';
import Modal from './components/Modal';
import Stoper from './components/Stoper';

const DOMYSLNE_DANE = {
  kategorie: ['M16-19','M20-29','M30-39','M40-49','M50-59','M60-69','M70+','K16-19','K20-29','K30-39','K40-49','K50-59','K60-69','K70+'],
  kraje: ['POL','GER','CZE','SVK','LTU','LAT','EST','UKR','GBR','FRA','ITA','ESP','USA'],
  dystanse: ['5 km','10 km','Półmaraton (21 km)','Maraton (42 km)'],
  kluby: [],
  eventy: [{ id: 'event-1', nazwa: 'Mój Bieg 2025', miejscowosc: 'Warszawa', data: '2025-01-01' }],
  aktywnyEventId: 'event-1',
  zawodnicy: [],
};

const KLUCZ_LS = 'aplikacja-biegi-v1';

function ladujDane() {
  try {
    const raw = localStorage.getItem(KLUCZ_LS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DOMYSLNE_DANE;
}

function formatCzas(sekundy) {
  const h = Math.floor(sekundy / 3600);
  const m = Math.floor((sekundy % 3600) / 60);
  const s = sekundy % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function App() {
  const [zakladka, setZakladka] = useState('wyniki');
  const [state, setState] = useState(ladujDane);
  const [ciemnyTryb, setCiemnyTryb] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [stoperSekund, setStoperSekund] = useState(0);
  const [stoperBiega, setStoperBiega] = useState(() => localStorage.getItem('stoper-running') === 'true');

  // Destructure state
  const { kategorie, kraje, dystanse, kluby, eventy, aktywnyEventId, zawodnicy } = state;

  // Save to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(KLUCZ_LS, JSON.stringify(state));
    } catch (e) {
      console.error('localStorage error:', e);
    }
  }, [state]);

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', ciemnyTryb);
    localStorage.setItem('darkMode', String(ciemnyTryb));
  }, [ciemnyTryb]);

  // Helper setters
  const setKategorie = (v) => setState(s => ({ ...s, kategorie: typeof v === 'function' ? v(s.kategorie) : v }));
  const setKraje = (v) => setState(s => ({ ...s, kraje: typeof v === 'function' ? v(s.kraje) : v }));
  const setDystanse = (v) => setState(s => ({ ...s, dystanse: typeof v === 'function' ? v(s.dystanse) : v }));
  const setKluby = (v) => setState(s => ({ ...s, kluby: typeof v === 'function' ? v(s.kluby) : v }));
  const setEventy = (v) => setState(s => ({ ...s, eventy: typeof v === 'function' ? v(s.eventy) : v }));
  const setAktywnyEventId = (id) => setState(s => ({ ...s, aktywnyEventId: id }));
  const setZawodnicy = (v) => setState(s => ({ ...s, zawodnicy: typeof v === 'function' ? v(s.zawodnicy) : v }));

  const aktywnyEvent = eventy.find(e => e.id === aktywnyEventId) || null;

  // Modal state for athlete form
  const [modalOpen, setModalOpen] = useState(false);
  const [edytowanyZawodnik, setEdytowanyZawodnik] = useState(null);

  const otworzDodaj = () => {
    setEdytowanyZawodnik(null);
    setModalOpen(true);
  };

  const otworzEdycje = (z) => {
    setEdytowanyZawodnik(z);
    setModalOpen(true);
  };

  const zamknijModal = () => {
    setModalOpen(false);
    setEdytowanyZawodnik(null);
  };

  const zapiszZawodnika = (dane) => {
    if (edytowanyZawodnik) {
      setZawodnicy(prev => prev.map(z => z.id === edytowanyZawodnik.id ? { ...z, ...dane } : z));
    } else {
      const nowyZawodnik = {
        ...dane,
        id: crypto.randomUUID(),
        eventId: aktywnyEventId,
      };
      setZawodnicy(prev => [...prev, nowyZawodnik]);
    }
    zamknijModal();
  };

  const usunZawodnika = (id) => {
    const z = zawodnicy.find(zaw => zaw.id === id);
    if (!window.confirm(`Czy na pewno usunąć zawodnika "${z?.imieNazwisko}"?`)) return;
    setZawodnicy(prev => prev.filter(zaw => zaw.id !== id));
  };

  const zapiszCzasZawodnika = (zawodnikId, sekundy) => {
    setZawodnicy(prev => prev.map(z => z.id === zawodnikId ? { ...z, czas: formatCzas(sekundy) } : z));
  };

  const zawodnicyEventu = zawodnicy.filter(z => z.eventId === aktywnyEventId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:bg-gray-900 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Navbar aktywnaZakladka={zakladka} setAktywnaZakladka={setZakladka} ciemnyTryb={ciemnyTryb} setCiemnyTryb={setCiemnyTryb} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Stoper onTick={(sek) => setStoperSekund(sek)} onRunningChange={(r) => setStoperBiega(r)} />
        {zakladka === 'wyniki' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <WynikTabela
              zawodnicy={zawodnicy}
              dystanse={dystanse}
              kategorie={kategorie}
              kluby={kluby}
              kraje={kraje}
              aktywnyEvent={aktywnyEvent}
              stoperBiega={stoperBiega}
              stoperSekund={stoperSekund}
              onStopZawodnik={zapiszCzasZawodnika}
            />
          </div>
        )}

        {zakladka === 'zawodnicy' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Zawodnicy
                {aktywnyEvent && <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">— {aktywnyEvent.nazwa}</span>}
              </h2>
              <button
                onClick={otworzDodaj}
                disabled={!aktywnyEvent}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Dodaj zawodnika
              </button>
            </div>
            {!aktywnyEvent && (
              <div className="text-orange-600 text-sm mb-4">⚠️ Brak aktywnego eventu. Przejdź do zakładki Eventy i ustaw aktywny event.</div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse bg-white dark:bg-gray-800 rounded shadow">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                    <th className="px-3 py-2 text-left">Nr</th>
                    <th className="px-3 py-2 text-left">Imię i Nazwisko</th>
                    <th className="px-3 py-2 text-left">Kat.</th>
                    <th className="px-3 py-2 text-left">Płeć</th>
                    <th className="px-3 py-2 text-left">Dystans</th>
                    <th className="px-3 py-2 text-left">Klub</th>
                    <th className="px-3 py-2 text-left">Kraj</th>
                    <th className="px-3 py-2 text-left">Czas</th>
                    <th className="px-3 py-2 text-left">DNF</th>
                    <th className="px-3 py-2 text-left">STOP</th>
                    <th className="px-3 py-2 text-left">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {zawodnicyEventu.map((z, idx) => (
                    <tr key={z.id} className={`border-b dark:border-gray-600 ${idx % 2 === 1 ? 'bg-gray-50 dark:bg-gray-700' : 'dark:bg-gray-800'} hover:bg-blue-50 dark:hover:bg-gray-600`}>
                      <td className="px-3 py-1.5 dark:text-gray-200">{z.nrStartowy}</td>
                      <td className="px-3 py-1.5 font-medium dark:text-gray-200">{z.imieNazwisko}</td>
                      <td className="px-3 py-1.5 dark:text-gray-200">{z.kategoria}</td>
                      <td className="px-3 py-1.5 dark:text-gray-200">{z.plec}</td>
                      <td className="px-3 py-1.5 dark:text-gray-200">{z.dystans}</td>
                      <td className="px-3 py-1.5 dark:text-gray-200">{z.klub}</td>
                      <td className="px-3 py-1.5 dark:text-gray-200">{z.kraj}</td>
                      <td className="px-3 py-1.5 font-mono dark:text-gray-200">{z.dnf ? 'DNF' : z.czas}</td>
                      <td className="px-3 py-1.5 dark:text-gray-200">{z.dnf ? '✓' : ''}</td>
                      <td className="px-3 py-1.5">
                        {!z.dnf && (
                          z.czas ? (
                            <span className="text-green-600 text-xs font-mono">✅ {z.czas}</span>
                          ) : (
                            <button
                              disabled={!stoperBiega}
                              onClick={() => zapiszCzasZawodnika(z.id, stoperSekund)}
                              className="px-2 py-0.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs rounded"
                            >
                              STOP
                            </button>
                          )
                        )}
                      </td>
                      <td className="px-3 py-1.5">
                        <div className="flex gap-2">
                          <button onClick={() => otworzEdycje(z)} className="text-blue-600 hover:underline text-xs">Edytuj</button>
                          <button onClick={() => usunZawodnika(z.id)} className="text-red-600 hover:underline text-xs">Usuń</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {zawodnicyEventu.length === 0 && (
                    <tr>
                      <td colSpan={11} className="px-3 py-8 text-center text-gray-400">
                        Brak zawodników. Kliknij "+ Dodaj zawodnika" aby dodać pierwszego.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {zakladka === 'kategorie' && (
          <KategorieManager kategorie={kategorie} setKategorie={setKategorie} />
        )}

        {zakladka === 'dystanse' && (
          <DystanseManager dystanse={dystanse} setDystanse={setDystanse} />
        )}

        {zakladka === 'kluby' && (
          <KlubyManager kluby={kluby} setKluby={setKluby} />
        )}

        {zakladka === 'kraje' && (
          <KrajeManager kraje={kraje} setKraje={setKraje} />
        )}

        {zakladka === 'eventy' && (
          <EventyManager
            eventy={eventy}
            setEventy={setEventy}
            aktywnyEventId={aktywnyEventId}
            setAktywnyEventId={setAktywnyEventId}
          />
        )}

        {zakladka === 'importexport' && (
          <ImportExport
            state={state}
            setState={setState}
            aktywnyEvent={aktywnyEvent}
            zawodnicy={zawodnicy}
          />
        )}
      </main>

      <Modal
        isOpen={modalOpen}
        onClose={zamknijModal}
        title={edytowanyZawodnik ? 'Edytuj zawodnika' : 'Dodaj zawodnika'}
      >
        <ZawodnikForm
          zawodnik={edytowanyZawodnik}
          onSave={zapiszZawodnika}
          onCancel={zamknijModal}
          kategorie={kategorie}
          dystanse={dystanse}
          kluby={kluby}
          kraje={kraje}
        />
      </Modal>
    </div>
  );
}
