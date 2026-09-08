import * as XLSX from 'xlsx';

/**
 * exportExcel.js — one shared helper so every screen in the app (POS
 * history, inventory, customers, wallets, reports, audit log, shift
 * history...) exports to a real .xlsx workbook the same way, instead of
 * each view re-implementing its own CSV/Excel logic.
 *
 * @param {string} filename - without extension, e.g. "تقرير-المبيعات"
 * @param {Array<{ name: string, columns: {key:string,label:string}[], rows: object[] }>} sheets
 */
export function exportToExcel(filename, sheets) {
  const wb = XLSX.utils.book_new();

  for (const sheet of sheets) {
    const headerRow = sheet.columns.map((c) => c.label);
    const dataRows = sheet.rows.map((row) => sheet.columns.map((c) => formatCell(row[c.key])));
    const aoa = [headerRow, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Reasonable auto column widths so numbers/Arabic text aren't clipped.
    ws['!cols'] = sheet.columns.map((c) => ({
      wch: Math.max(c.label.length + 4, 12),
    }));

    // Right-to-left sheet view — matches the app's Arabic-first data.
    ws['!views'] = [{ RTL: true }];

    XLSX.utils.book_append_sheet(wb, ws, sanitizeSheetName(sheet.name));
  }

  XLSX.writeFile(wb, `${filename}.xlsx`, { bookSST: true });
}

/** A single-table convenience wrapper for the common case. */
export function exportSingleSheet(filename, sheetName, columns, rows) {
  exportToExcel(filename, [{ name: sheetName, columns, rows }]);
}

function formatCell(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return value;
  return String(value);
}

function sanitizeSheetName(name) {
  // Excel sheet names: max 31 chars, no : \ / ? * [ ]
  return name.replace(/[:\\/?*[\]]/g, ' ').slice(0, 31);
}
