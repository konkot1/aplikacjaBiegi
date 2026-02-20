export function czasDoSekund(czas) {
  if (!czas) return Infinity;
  const parts = czas.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return Infinity;
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
