/**
 * printerConfig.js — shared network-printer settings.
 *
 * Previously every screen (POS.jsx, Maintenance.jsx) hardcoded its own
 * printer IP inline. That's fragile: changing a printer meant hunting
 * through source files. Settings.jsx now writes here, and every print
 * call site reads from here, with the old hardcoded values kept only as
 * the very first default.
 */

const STORAGE_KEY = 'elresala.printerConfig.v1';

const DEFAULTS = {
  receiptIp: '192.168.1.50',
  receiptPort: 9100,
  labelIp: '192.168.1.52',
  labelPort: 9100,
};

export function getPrinterConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function savePrinterConfig(partial) {
  const merged = { ...getPrinterConfig(), ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
}
