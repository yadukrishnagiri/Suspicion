const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, '..', 'temp_xlsx', 'xl', 'worksheets', 'sheet1.xml');
const s = fs.readFileSync(xmlPath, 'utf8');
const rows = s.match(/<x:row[^>]*>([\s\S]*?)<\/x:row>/g);
const records = [];

function unescapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  const cells = {};
  const cMatches = row.match(/<x:c\s+r="([A-Z]+)\d+"[^>]*>(?:<x:v>([\s\S]*?)<\/x:v>)?<\/x:c>/g) || [];
  for (const c of cMatches) {
    const colMatch = c.match(/r="([A-Z]+)\d+"/);
    const valMatch = c.match(/<x:v>([\s\S]*?)<\/x:v>/);
    if (colMatch && valMatch) {
      cells[colMatch[1]] = unescapeXml(valMatch[1]);
    }
  }
  if (cells['C'] && cells['D']) {
    records.push({
      id: parseInt(cells['A'] || '0', 10),
      category: cells['B'] || '',
      mainWord: cells['C'] || '',
      imposterWord: cells['D'] || '',
      imposterCategory: cells['E'] || '',
      relationshipType: cells['F'] || '',
      imposterHint: cells['G'] || '',
      difficulty: cells['H'] || '',
      pairGroup: parseInt(cells['I'] || '0', 10),
      patternRisk: cells['J'] || '',
      vocabularyLevel: cells['K'] || ''
    });
  }
}

console.log('Total records parsed:', records.length);
console.log('Sample record 0:', records[0]);
console.log('Sample record 50:', records[50]);
const categories = [...new Set(records.map(r => r.category))];
console.log('Categories:', categories);

const outDir = path.join(__dirname, '..', 'src', 'data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, 'imposter_words.json'), JSON.stringify(records, null, 2));
console.log('Saved to src/data/imposter_words.json successfully!');
