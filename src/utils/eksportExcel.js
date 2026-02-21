import JSZip from 'jszip';

function escapeXml(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function colLetter(n) {
  let s = '';
  n += 1;
  while (n > 0) {
    s = String.fromCharCode(((n - 1) % 26) + 65) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function buildXlsx(headers, rows) {
  // Shared strings
  const strings = [];
  const stringIndex = (s) => {
    const idx = strings.indexOf(s);
    if (idx !== -1) return idx;
    strings.push(s);
    return strings.length - 1;
  };

  let totalStringRefs = 0;

  // Worksheet rows XML
  const buildRow = (rowIdx, cells) => {
    const cellsXml = cells.map((val, colIdx) => {
      const ref = `${colLetter(colIdx)}${rowIdx}`;
      const si = stringIndex(val);
      totalStringRefs++;
      return `<c r="${ref}" t="s"><v>${si}</v></c>`;
    }).join('');
    return `<row r="${rowIdx}">${cellsXml}</row>`;
  };

  const allRows = [
    buildRow(1, headers),
    ...rows.map((row, i) => buildRow(i + 2, row)),
  ];

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${allRows.join('')}</sheetData>
</worksheet>`;

  const sharedStringsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${totalStringRefs}" uniqueCount="${strings.length}">
${strings.map(s => `<si><t xml:space="preserve">${escapeXml(s)}</t></si>`).join('')}
</sst>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Wyniki" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const zip = new JSZip();
  zip.file('[Content_Types].xml', contentTypes);
  zip.file('_rels/.rels', rootRels);
  zip.file('xl/workbook.xml', workbookXml);
  zip.file('xl/_rels/workbook.xml.rels', workbookRels);
  zip.file('xl/worksheets/sheet1.xml', sheetXml);
  zip.file('xl/sharedStrings.xml', sharedStringsXml);

  return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export async function eksportujExcel(zawodnicy, event) {
  const nazwaEventu = event ? event.nazwa : 'Wyniki';

  const headers = ['Mce', 'Nr', 'Imię i Nazwisko', 'Kat.', 'Dystans', 'Klub/Szkoła [Kraj]', 'Z/M', 'Czas'];

  const rows = zawodnicy.map(z => [
    z.dnf ? 'DNF' : String(z.miejsceOgolne ?? ''),
    String(z.nrStartowy ?? ''),
    z.imieNazwisko ?? '',
    z.kategoria ?? '',
    z.dystans ?? '',
    z.klub ? `${z.klub} [${z.kraj || 'POL'}]` : (z.kraj || 'POL'),
    z.dnf ? 'DNF' : String(z.miejsceKategoria ?? ''),
    z.dnf ? 'DNF' : (z.czas || ''),
  ]);

  const blob = await buildXlsx(headers, rows);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wyniki_${nazwaEventu.replace(/\s+/g, '_')}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
