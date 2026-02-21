import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function normalizujPolskie(str) {
  if (!str) return '';
  return String(str)
    .replace(/ą/g, 'a').replace(/Ą/g, 'A')
    .replace(/ć/g, 'c').replace(/Ć/g, 'C')
    .replace(/ę/g, 'e').replace(/Ę/g, 'E')
    .replace(/ł/g, 'l').replace(/Ł/g, 'L')
    .replace(/ń/g, 'n').replace(/Ń/g, 'N')
    .replace(/ó/g, 'o').replace(/Ó/g, 'O')
    .replace(/ś/g, 's').replace(/Ś/g, 'S')
    .replace(/ź/g, 'z').replace(/Ź/g, 'Z')
    .replace(/ż/g, 'z').replace(/Ż/g, 'Z');
}

export function eksportujPDF(zawodnicy, event) {
  const doc = new jsPDF();
  
  const nazwaEventu = event ? event.nazwa : 'Wyniki';
  const miejscowosc = event ? event.miejscowosc : '';
  const data = event ? event.data : '';
  
  doc.setFontSize(16);
  doc.text(normalizujPolskie(nazwaEventu), 14, 15);
  
  doc.setFontSize(11);
  if (miejscowosc) doc.text(`Miejscowosc: ${normalizujPolskie(miejscowosc)}`, 14, 23);
  if (data) doc.text(`Data: ${data}`, 14, 30);
  doc.text('Wyniki wg czasu', 14, 37);
  
  const wiersze = zawodnicy.map(z => [
    z.dnf ? 'DNF' : (z.miejsceOgolne || ''),
    z.nrStartowy,
    normalizujPolskie(z.imieNazwisko),
    normalizujPolskie(z.kategoria),
    normalizujPolskie(z.dystans || ''),
    z.klub ? `${normalizujPolskie(z.klub)} [${z.kraj || 'POL'}]` : (z.kraj || 'POL'),
    z.dnf ? 'DNF' : (z.miejsceKategoria || ''),
    z.dnf ? 'DNF' : (z.czas || ''),
  ]);
  
  autoTable(doc, {
    startY: 42,
    head: [['Mce', 'Nr', 'Imie i Nazwisko', 'Kat.', 'Dystans', 'Klub/Szkola [Kraj]', 'Z/M', 'Czas']],
    body: wiersze,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });
  
  doc.save(`wyniki_${nazwaEventu.replace(/\s+/g, '_')}.pdf`);
}
