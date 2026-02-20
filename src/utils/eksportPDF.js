import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function eksportujPDF(zawodnicy, event) {
  const doc = new jsPDF();
  
  const nazwaEventu = event ? event.nazwa : 'Wyniki';
  const miejscowosc = event ? event.miejscowosc : '';
  const data = event ? event.data : '';
  
  doc.setFontSize(16);
  doc.text(nazwaEventu, 14, 15);
  
  doc.setFontSize(11);
  if (miejscowosc) doc.text(`Miejscowość: ${miejscowosc}`, 14, 23);
  if (data) doc.text(`Data: ${data}`, 14, 30);
  doc.text('Wyniki wg czasu', 14, 37);
  
  const wiersze = zawodnicy.map(z => [
    z.dnf ? 'DNF' : (z.miejsceOgolne || ''),
    z.nrStartowy,
    z.imieNazwisko,
    z.kategoria,
    z.klub ? `${z.klub} [${z.kraj || 'POL'}]` : (z.kraj || 'POL'),
    z.dnf ? 'DNF' : (z.miejsceKategoria || ''),
    z.dnf ? 'DNF' : (z.czas || ''),
  ]);
  
  autoTable(doc, {
    startY: 42,
    head: [['Mce', 'Nr', 'Imię i Nazwisko', 'Kat.', 'Klub/Szkoła [Kraj]', 'Z/M', 'Czas']],
    body: wiersze,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });
  
  doc.save(`wyniki_${nazwaEventu.replace(/\s+/g, '_')}.pdf`);
}
