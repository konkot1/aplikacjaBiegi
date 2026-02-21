export function czasDoSekund(czas) {
  if (!czas) return Infinity;
  const [main, cc = '0'] = czas.split('.');
  const parts = main.split(':').map(Number);
  let totalCs = 0;
  if (parts.length === 3) {
    totalCs = parts[0] * 360000 + parts[1] * 6000 + parts[2] * 100;
  } else if (parts.length === 2) {
    totalCs = parts[0] * 6000 + parts[1] * 100;
  }
  totalCs += parseInt(cc.substring(0, 2).padEnd(2, '0'), 10);
  return totalCs;
}

export function sortujZawodnikow(zawodnicy) {
  return [...zawodnicy].sort((a, b) => {
    if (a.dnf && b.dnf) return 0;
    if (a.dnf) return 1;
    if (b.dnf) return -1;
    return czasDoSekund(a.czas) - czasDoSekund(b.czas);
  });
}

export function obliczMiejsca(zawodnicy) {
  const posortowani = sortujZawodnikow(zawodnicy);
  
  // Count category places
  const kategoriaLiczniki = {};
  
  return posortowani.map((z, idx) => {
    if (z.dnf) {
      return { ...z, miejsceOgolne: null, miejsceKategoria: null };
    }
    
    const miejsce = idx + 1 - posortowani.slice(0, idx).filter(x => x.dnf).length;
    
    const katKey = z.kategoria;
    if (!kategoriaLiczniki[katKey]) kategoriaLiczniki[katKey] = 0;
    kategoriaLiczniki[katKey]++;
    
    return { ...z, miejsceOgolne: miejsce, miejsceKategoria: kategoriaLiczniki[katKey] };
  });
}
