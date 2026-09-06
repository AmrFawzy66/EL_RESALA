/**
 * printJobs.js
 * -----------------------------------------------------------------------
 * The cloud backend has no direct network path to the shop's LAN thermal
 * or label printers — a browser or a server on the internet cannot open
 * a raw TCP socket to a printer sitting behind the shop's router. So
 * printing is split in two:
 *
 *   1. This service just writes a row describing WHAT to print into the
 *      `print_jobs` table (job_type + a plain JSON payload — the same
 *      shape of data the old Electron printer.js functions took).
 *   2. The on-site print-agent (see /print-agent) polls
 *      GET /api/print/pending every couple of seconds, and when it sees
 *      a new job it builds the actual ESC/POS or TSPL byte buffer
 *      (reusing the exact same buildSaleReceipt/buildRepairIntakeReceipt/
 *      buildShiftReport/buildDrawerKick/buildTsplLabel logic that used
 *      to live in Electron's main process) and writes it to the printer
 *      over a local TCP socket.
 *
 * This keeps 100% of the original receipt/label layout logic intact —
 * it just moves the "send it to the actual printer" step onto a small
 * process physically on the shop's network.
 */

async function enqueue(pool, jobType, payload) {
  const { rows } = await pool.query(
    `INSERT INTO print_jobs (job_type, payload) VALUES ($1, $2) RETURNING id`,
    [jobType, payload]
  );
  return rows[0].id;
}

module.exports = { enqueue };
