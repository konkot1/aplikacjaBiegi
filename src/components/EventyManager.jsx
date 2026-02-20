import React, { useState } from 'react';

const PUSTY_EVENT = { nazwa: '', miejscowosc: '', data: '' };

export default function EventyManager({ eventy, setEventy, aktywnyEventId, setAktywnyEventId }) {
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState(PUSTY_EVENT);
  const [edytowanyId, setEdytowanyId] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nazwa.trim()) return;
    if (edytowanyId) {
      setEventy(eventy.map(ev => ev.id === edytowanyId ? { ...ev, ...form } : ev));
      setEdytowanyId(null);
    } else {
      const nowyEvent = { ...form, id: crypto.randomUUID() };
      setEventy([...eventy, nowyEvent]);
      if (eventy.length === 0) setAktywnyEventId(nowyEvent.id);
    }
    setForm(PUSTY_EVENT);
    setFormVisible(false);
  };

  const startEdycja = (ev) => {
    setForm({ nazwa: ev.nazwa, miejscowosc: ev.miejscowosc, data: ev.data });
    setEdytowanyId(ev.id);
    setFormVisible(true);
  };

  const usun = (id) => {
    const ev = eventy.find(e => e.id === id);
    if (!window.confirm(`Czy na pewno usunąć event "${ev?.nazwa}"?`)) return;
    setEventy(eventy.filter(e => e.id !== id));
    if (aktywnyEventId === id) setAktywnyEventId(eventy.filter(e => e.id !== id)[0]?.id || null);
  };

  const anuluj = () => {
    setForm(PUSTY_EVENT);
    setEdytowanyId(null);
    setFormVisible(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Eventy / Biegi</h2>
      
      {!formVisible && (
        <button
          onClick={() => setFormVisible(true)}
          className="mb-4 px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          + Dodaj event
        </button>
      )}

      {formVisible && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded bg-gray-50 space-y-3 max-w-md">
          <h3 className="font-semibold text-gray-700">{edytowanyId ? 'Edytuj event' : 'Nowy event'}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa eventu *</label>
            <input
              type="text"
              name="nazwa"
              value={form.nazwa}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="np. Mój Bieg 2025"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Miejscowość</label>
              <input
                type="text"
                name="miejscowosc"
                value={form.miejscowosc}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="np. Warszawa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
              {edytowanyId ? 'Zapisz zmiany' : 'Dodaj event'}
            </button>
            <button type="button" onClick={anuluj} className="px-4 py-1.5 border text-sm rounded hover:bg-gray-100">
              Anuluj
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {eventy.map(ev => (
          <div
            key={ev.id}
            className={`p-3 border rounded ${aktywnyEventId === ev.id ? 'border-blue-500 bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                  {ev.nazwa}
                  {aktywnyEventId === ev.id && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">AKTYWNY</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {ev.miejscowosc && `${ev.miejscowosc} `}{ev.data}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {aktywnyEventId !== ev.id && (
                  <button
                    onClick={() => setAktywnyEventId(ev.id)}
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Ustaw aktywny
                  </button>
                )}
                <button onClick={() => startEdycja(ev)} className="text-sm text-blue-600 hover:underline">Edytuj</button>
                <button onClick={() => usun(ev.id)} className="text-sm text-red-600 hover:underline">Usuń</button>
              </div>
            </div>
          </div>
        ))}
        {eventy.length === 0 && (
          <p className="text-gray-500 text-sm">Brak eventów. Dodaj pierwszy event.</p>
        )}
      </div>
    </div>
  );
}
