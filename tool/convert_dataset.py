import os
import json
import zipfile
import xml.etree.ElementTree as ET

def convert_excel_to_json():
    excel_path = 'imposter_master_dataset_v2_840_entries.xlsx'
    output_dir = os.path.join('assets', 'data')
    output_path = os.path.join(output_dir, 'imposter_dataset.json')

    os.makedirs(output_dir, exist_ok=True)

    with zipfile.ZipFile(excel_path) as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                text = ''.join([t.text or '' for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')])
                shared_strings.append(text)

        tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        rows = []
        for row in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
            cells = []
            for c in row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                t = c.attrib.get('t')
                v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                val = v.text if v is not None else ''
                if t == 's' and val:
                    val = shared_strings[int(val)]
                cells.append(val)
            rows.append(cells)

    entries = []
    # Header: ['ID', 'Category', 'Main Word', 'Imposter Word', 'Imposter Category', 'Relationship Type', 'Shared Context / Clue', 'Difficulty', 'Pair Group', 'Pattern Risk']
    for r in rows[1:]:
        if len(r) >= 4 and r[2].strip() and r[3].strip():
            entries.append({
                'id': int(r[0]) if r[0].isdigit() else r[0],
                'category': r[1].strip(),
                'mainWord': r[2].strip(),
                'imposterWord': r[3].strip(),
                'imposterCategory': r[4].strip() if len(r) > 4 else '',
                'relationshipType': r[5].strip() if len(r) > 5 else '',
                'hint': r[6].strip() if len(r) > 6 else '',
                'difficulty': r[7].strip() if len(r) > 7 else 'Medium',
                'pairGroup': r[8].strip() if len(r) > 8 else '',
                'patternRisk': r[9].strip() if len(r) > 9 else '',
            })

    print(f'Successfully extracted {len(entries)} entries.')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(entries, f, ensure_ascii=False, indent=2)

    print(f'Saved JSON dataset to {output_path}')

if __name__ == '__main__':
    convert_excel_to_json()
