import * as XLSX from 'xlsx';

export function eksportujExcel(zawodnicy, event) {
  const nazwaEventu = event ? event.nazwa : 'Wyniki';
  
  const wiersze = zawodnicy.map(z => ({
    'Mce': z.dnf ? 'DNF' : (z.miejsceOgolne || ''),
    'Nr': z.nrStartowy,
    'Imię i Nazwisko': z.imieNazwisko,
    'Kat.': z.kategoria,
    'Klub/Szkoła [Kraj]': z.klub ? `${z.klub} [${z.kraj || 'POL'}]` : (z.kraj || 'POL'),
    'Z/M': z.dnf ? 'DNF' : (z.miejsceKategoria || ''),
    'Czas': z.dnf ? 'DNF' : (z.czas || ''),
  }));
  
  const ws = XLSX.utils.json_to_sheet(wiersze);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Wyniki');
  XLSX.writeFile(wb, `wyniki_${nazwaEventu.replace(/\s+/g, '_')}.xlsx`);
}
