/**
 * agent.js — El-RESALA POS print-agent.
 * -----------------------------------------------------------------------
 * Runs on a single PC inside the shop (the same PC the thermal receipt
 * and label printers are wired/networked to). Its only job: poll the
 * cloud backend for pending print jobs and send the actual bytes to the
 * local printer — the piece of the original Electron app that a browser
 * on the internet can never do directly (a browser cannot open a raw
 * TCP socket to a LAN printer).
 *
 * Start it with: node agent.js   (or `npm start` from this folder)
 * Keep it running in the background on the shop's till PC — e.g. via
 * pm2, a Windows Scheduled Task, or NSSM, so it survives reboots.
 */

require('dotenv').config();
const printer = require('./printer');

const BACKEND_URL = process.env.BACKEND_URL;
const AGENT_API_KEY = process.env.AGENT_API_KEY;
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS) || 3000;

const RECEIPT_PRINTER_IP = process.env.RECEIPT_PRINTER_IP || '192.168.1.50';
const RECEIPT_PRINTER_PORT = Number(process.env.RECEIPT_PRINTER_PORT) || 9100;
const LABEL_PRINTER_IP = process.env.LABEL_PRINTER_IP || '192.168.1.52';
const LABEL_PRINTER_PORT = Number(process.env.LABEL_PRINTER_PORT) || 9100;

if (!BACKEND_URL || !AGENT_API_KEY) {
  console.error('BACKEND_URL and AGENT_API_KEY must be set in print-agent/.env — see .env.example.');
  process.exit(1);
}

async function fetchPendingJobs() {
  const res = await fetch(`${BACKEND_URL}/api/print/pending`, {
    headers: { 'x-agent-key': AGENT_API_KEY },
  });
  if (!res.ok) throw new Error(`Failed to fetch pending jobs: HTTP ${res.status}`);
  return res.json();
}

async function reportCompletion(jobId, success, error) {
  await fetch(`${BACKEND_URL}/api/print/${jobId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-agent-key': AGENT_API_KEY },
    body: JSON.stringify({ success, error: error ? String(error.message || error) : null }),
  });
}

async function handleJob(job) {
  const { id, job_type: jobType, payload } = job;
  console.log(`[print-agent] handling job #${id} (${jobType})`);

  try {
    switch (jobType) {
      case 'sale_receipt': {
        const buffer = printer.buildSaleReceipt(payload);
        await printer.sendToNetworkPrinter(RECEIPT_PRINTER_IP, RECEIPT_PRINTER_PORT, buffer);
        break;
      }
      case 'repair_intake': {
        const buffer = printer.buildRepairIntakeReceipt(payload);
        await printer.sendToNetworkPrinter(RECEIPT_PRINTER_IP, RECEIPT_PRINTER_PORT, buffer);
        break;
      }
      case 'shift_report': {
        const buffer = printer.buildShiftReport(payload);
        await printer.sendToNetworkPrinter(RECEIPT_PRINTER_IP, RECEIPT_PRINTER_PORT, buffer);
        break;
      }
      case 'drawer_kick': {
        const buffer = printer.buildDrawerKick();
        await printer.sendToNetworkPrinter(RECEIPT_PRINTER_IP, RECEIPT_PRINTER_PORT, buffer);
        break;
      }
      case 'label': {
        const buffer = printer.buildTsplLabel(payload.size, payload.data);
        await printer.sendToNetworkPrinter(LABEL_PRINTER_IP, LABEL_PRINTER_PORT, buffer);
        break;
      }
      default:
        throw new Error(`Unknown job type: ${jobType}`);
    }

    await reportCompletion(id, true, null);
    console.log(`[print-agent] job #${id} printed successfully`);
  } catch (err) {
    console.error(`[print-agent] job #${id} failed:`, err.message || err);
    await reportCompletion(id, false, err);
  }
}

async function pollLoop() {
  try {
    const jobs = await fetchPendingJobs();
    for (const job of jobs) {
      // eslint-disable-next-line no-await-in-loop
      await handleJob(job);
    }
  } catch (err) {
    console.error('[print-agent] poll error:', err.message || err);
  } finally {
    setTimeout(pollLoop, POLL_INTERVAL_MS);
  }
}

console.log(`[print-agent] starting — polling ${BACKEND_URL} every ${POLL_INTERVAL_MS}ms`);
console.log(`[print-agent] receipt printer: ${RECEIPT_PRINTER_IP}:${RECEIPT_PRINTER_PORT}`);
console.log(`[print-agent] label printer: ${LABEL_PRINTER_IP}:${LABEL_PRINTER_PORT}`);
pollLoop();
