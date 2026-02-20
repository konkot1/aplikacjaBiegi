import React, { useState, useEffect } from 'react';

const PUSTY_ZAWODNIK = {
  nrStartowy: '',
  imieNazwisko: '',
  kategoria: '',
  plec: 'M',
  dystans: '',
  klub: '',
  kraj: 'POL',
  czas: '',
  dnf: false,
};

export default function ZawodnikForm({ zawodnik, onSave, onCancel, kategorie, dystanse, kluby, kraje }) {
  const [form, setForm] = useState(PUSTY_ZAWODNIK);

  useEffect(() => {
    if (zawodnik) {
      setForm({ ...PUSTY_ZAWODNIK, ...zawodnik });
    } else {
      setForm(PUSTY_ZAWODNIK);
    }
  }, [zawodnik]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.imieNazwisko.trim()) {
      alert('Imię i nazwisko jest wymagane');
      return;
    }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nr startowy</label>
          <input
            type="number"
            name="nrStartowy"
            value={form.nrStartowy}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
            placeholder="np. 1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Płeć</label>
          <select
            name="plec"
            value={form.plec}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            <option value="M">M</option>
            <option value="K">K</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Imię i Nazwisko *</label>
        <input
          type="text"
          name="imieNazwisko"
          value={form.imieNazwisko}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 text-sm"
          placeholder="np. Jan Kowalski"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategoria wiekowa</label>
          <select
            name="kategoria"
            value={form.kategoria}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            <option value="">— wybierz —</option>
            {kategorie.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dystans</label>
          <select
            name="dystans"
            value={form.dystans}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            <option value="">— wybierz —</option>
            {dystanse.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Klub/Szkoła</label>
          <input
            type="text"
            name="klub"
            value={form.klub}
            onChange={handleChange}
            list="kluby-list"
            className="w-full border rounded px-2 py-1 text-sm"
            placeholder="wpisz lub wybierz"
          />
          <datalist id="kluby-list">
            {kluby.map(k => <option key={k} value={k} />)}
          </datalist>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kraj</label>
          <select
            name="kraj"
            value={form.kraj}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {kraje.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Czas (HH:MM:SS lub MM:SS)</label>
          <input
            type="text"
            name="czas"
            value={form.czas}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 text-sm font-mono"
            placeholder="np. 0:34:46"
            disabled={form.dnf}
          />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            name="dnf"
            id="dnf"
            checked={form.dnf}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label htmlFor="dnf" className="text-sm font-medium text-gray-700">DNF (nie ukończył)</label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
        >
          Anuluj
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {zawodnik ? 'Zapisz zmiany' : 'Dodaj zawodnika'}
        </button>
      </div>
    </form>
  );
}
