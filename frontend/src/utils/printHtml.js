/**
 * printHtml.js — generic "print anything" helper.
 *
 * printer.js (main process) only knows how to speak raw ESC/POS bytes to
 * a thermal receipt/label printer. For full A4 reports (sales reports,
 * inventory lists, customer lists, audit logs, shift history...) we
 * instead render clean printable HTML into a hidden iframe and use the
 * browser/OS print dialog — this lets the cashier pick any installed
 * printer (A4 laser/inkjet) and works completely offline.
 */

let printFrame = null;

function getFrame() {
  if (printFrame && document.body.contains(printFrame)) return printFrame;
  printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  document.body.appendChild(printFrame);
  return printFrame;
}

const BASE_STYLES = `
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Cairo', 'Tajawal', Arial, sans-serif; direction: rtl; color: #111827; padding: 0; margin: 0; }
  header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #1f7d61; padding-bottom: 10px; margin-bottom: 16px; }
  header h1 { margin: 0; font-size: 20px; color: #0a251f; }
  header p { margin: 2px 0 0; font-size: 12px; color: #6b7280; }
  header .meta { text-align: left; font-size: 11px; color: #6b7280; }
  h2.section-title { font-size: 14px; color: #164237; margin: 18px 0 8px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { border: 1px solid #d1d5db; padding: 6px 8px; text-align: center; }
  th { background: #eefaf6; color: #164237; font-weight: 700; }
  tr:nth-child(even) td { background: #f9fafb; }
  tfoot td { font-weight: 700; background: #f3f4f6; }
  .summary-cards { display: flex; gap: 10px; margin-bottom: 14px; }
  .summary-card { flex: 1; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 10px; }
  .summary-card .label { font-size: 11px; color: #6b7280; }
  .summary-card .value { font-size: 16px; font-weight: 800; color: #164237; }
  footer { margin-top: 24px; font-size: 10px; color: #9ca3af; text-align: center; }
`;

/**
 * @param {object} opts
 * @param {string} opts.title - report title shown in the header
 * @param {string} [opts.subtitle]
 * @param {{label:string, value:string}[]} [opts.summaryCards]
 * @param {{key:string,label:string}[]} opts.columns
 * @param {object[]} opts.rows
 * @param {{label:string,value:string}[]} [opts.totalsRow] - optional tfoot row (rendered as-is)
 */
export function printTableReport({ title, subtitle, summaryCards = [], columns, rows, footNote }) {
  const now = new Date();
  const printedAt = now.toLocaleString('ar-EG');

  const summaryHtml = summaryCards.length
    ? `<div class="summary-cards">${summaryCards
        .map((c) => `<div class="summary-card"><div class="label">${escapeHtml(c.label)}</div><div class="value">${escapeHtml(c.value)}</div></div>`)
        .join('')}</div>`
    : '';

  const theadHtml = `<tr>${columns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join('')}</tr>`;
  const tbodyHtml = rows
    .map((row) => `<tr>${columns.map((c) => `<td>${escapeHtml(formatValue(row[c.key]))}</td>`).join('')}</tr>`)
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>${BASE_STYLES}</style>
      </head>
      <body>
        <header>
          <div>
            <h1>El-RESALA | الرسالة</h1>
            <p>${escapeHtml(title)}${subtitle ? ' — ' + escapeHtml(subtitle) : ''}</p>
          </div>
          <div class="meta">
            <p>تاريخ الطباعة: ${escapeHtml(printedAt)}</p>
          </div>
        </header>
        ${summaryHtml}
        <table>
          <thead>${theadHtml}</thead>
          <tbody>${tbodyHtml || `<tr><td colspan="${columns.length}">لا توجد بيانات</td></tr>`}</tbody>
        </table>
        <footer>${footNote ? escapeHtml(footNote) + ' — ' : ''}نظام الرسالة (El-RESALA POS) — تقرير آلي</footer>
      </body>
    </html>
  `;

  const frame = getFrame();
  const doc = frame.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  // Give the iframe a tick to lay out before invoking the print dialog.
  setTimeout(() => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
  }, 150);
}

function formatValue(value) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') return value.toLocaleString('ar-EG', { maximumFractionDigits: 2 });
  return String(value);
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}
