/**
 * printer.js
 * -----------------------------------------------------------------------
 * Direct, silent hardware printing for El-RESALA POS — identical byte
 * layout logic to the original Electron main-process printer.js. Only
 * the caller changed (the print-agent polls jobs from the cloud backend
 * instead of receiving them over Electron IPC); every receipt/label
 * looks exactly the same as before.
 *
 * Two independent drivers:
 *   1. ESC/POS  — 80mm/58mm thermal receipt printers (sales, repair
 *      intake claims, Z-reports). Talks raw bytes over a TCP/IP socket.
 *   2. TSPL     — thermal barcode label printers (38x25mm / 50x30mm
 *      stickers) for device IMEI tags and repair ticket stickers.
 */

const net = require('net');
const iconv = require('iconv-lite');

const ESC = 0x1b;
const GS = 0x1d;

const CMD = {
  INIT: Buffer.from([ESC, 0x40]),
  ALIGN_LEFT: Buffer.from([ESC, 0x61, 0x00]),
  ALIGN_CENTER: Buffer.from([ESC, 0x61, 0x01]),
  ALIGN_RIGHT: Buffer.from([ESC, 0x61, 0x02]),
  BOLD_ON: Buffer.from([ESC, 0x45, 0x01]),
  BOLD_OFF: Buffer.from([ESC, 0x45, 0x00]),
  DOUBLE_SIZE_ON: Buffer.from([GS, 0x21, 0x11]),
  DOUBLE_SIZE_OFF: Buffer.from([GS, 0x21, 0x00]),
  LINE_FEED: Buffer.from([0x0a]),
  DRAWER_KICK: Buffer.from([0x1b, 0x70, 0x00, 0x19, 0xfa]),
  PAPER_CUT: Buffer.from([0x1d, 0x56, 0x41, 0x00]),
};

function encodeArabic(text) {
  return iconv.encode(text, 'CP864');
}

function textLine(text, { align = 'left', bold = false, doubleSize = false } = {}) {
  const parts = [];
  parts.push(align === 'center' ? CMD.ALIGN_CENTER : align === 'right' ? CMD.ALIGN_RIGHT : CMD.ALIGN_LEFT);
  if (bold) parts.push(CMD.BOLD_ON);
  if (doubleSize) parts.push(CMD.DOUBLE_SIZE_ON);
  parts.push(encodeArabic(text));
  parts.push(CMD.LINE_FEED);
  if (doubleSize) parts.push(CMD.DOUBLE_SIZE_OFF);
  if (bold) parts.push(CMD.BOLD_OFF);
  return Buffer.concat(parts);
}

function divider(char = '-', width = 32) {
  return textLine(char.repeat(width));
}

function buildSaleReceipt(sale) {
  const chunks = [CMD.INIT];

  chunks.push(textLine('El-RESALA | الرسالة', { align: 'center', bold: true, doubleSize: true }));
  chunks.push(textLine('لصيانة وبيع الهواتف المحمولة', { align: 'center' }));
  chunks.push(divider());

  chunks.push(textLine(`فاتورة رقم: ${sale.code}`, { align: 'right', bold: true }));
  chunks.push(textLine(`التاريخ: ${sale.createdAt}`, { align: 'right' }));
  chunks.push(textLine(`الكاشير: ${sale.cashierName}`, { align: 'right' }));
  if (sale.customerName) {
    chunks.push(textLine(`العميل: ${sale.customerName}`, { align: 'right' }));
  }
  chunks.push(divider());

  for (const item of sale.items) {
    chunks.push(textLine(`${item.name}`, { align: 'right' }));
    chunks.push(
      textLine(
        `${item.qty} × ${item.unitPrice.toFixed(2)} = ${(item.qty * item.unitPrice).toFixed(2)} ج.م`,
        { align: 'right' }
      )
    );
  }
  chunks.push(divider());

  chunks.push(textLine(`الإجمالي الفرعي: ${sale.subtotal.toFixed(2)} ج.م`, { align: 'right' }));
  if (sale.discount > 0) {
    chunks.push(textLine(`الخصم: ${sale.discount.toFixed(2)} ج.م`, { align: 'right' }));
  }
  chunks.push(textLine(`الإجمالي: ${sale.total.toFixed(2)} ج.م`, { align: 'right', bold: true, doubleSize: true }));
  chunks.push(textLine(`المدفوع الآن: ${sale.paidNow.toFixed(2)} ج.م`, { align: 'right' }));
  if (sale.debtRemaining > 0) {
    chunks.push(textLine(`المتبقي (دين): ${sale.debtRemaining.toFixed(2)} ج.م`, { align: 'right', bold: true }));
  }
  chunks.push(textLine(`طريقة الدفع: ${sale.paymentMethod}`, { align: 'right' }));
  chunks.push(divider());
  chunks.push(textLine('شكراً لثقتكم في الرسالة', { align: 'center', bold: true }));
  chunks.push(textLine(' '));
  chunks.push(textLine(' '));
  chunks.push(CMD.PAPER_CUT);

  return Buffer.concat(chunks);
}

function buildRepairIntakeReceipt(ticket) {
  const chunks = [CMD.INIT];

  chunks.push(textLine('El-RESALA | الرسالة', { align: 'center', bold: true, doubleSize: true }));
  chunks.push(textLine('إيصال استلام جهاز للصيانة', { align: 'center' }));
  chunks.push(divider());

  chunks.push(textLine(`رقم التذكرة: ${ticket.code}`, { align: 'right', bold: true, doubleSize: true }));
  chunks.push(textLine(`التاريخ: ${ticket.createdAt}`, { align: 'right' }));
  chunks.push(textLine(`العميل: ${ticket.customerName}`, { align: 'right' }));
  chunks.push(textLine(`الهاتف: ${ticket.customerPhone}`, { align: 'right' }));
  chunks.push(divider());
  chunks.push(textLine(`الجهاز: ${ticket.device}`, { align: 'right' }));
  if (ticket.imei) chunks.push(textLine(`IMEI: ${ticket.imei}`, { align: 'right' }));
  chunks.push(textLine(`العطل المبلغ عنه: ${ticket.problem}`, { align: 'right' }));
  if (ticket.estimatedCost) {
    chunks.push(textLine(`التكلفة التقديرية: ${ticket.estimatedCost.toFixed(2)} ج.م`, { align: 'right' }));
  }
  if (ticket.advancePaid) {
    chunks.push(textLine(`العربون المدفوع: ${ticket.advancePaid.toFixed(2)} ج.م`, { align: 'right' }));
  }
  chunks.push(divider());
  chunks.push(textLine('يرجى الاحتفاظ بهذا الإيصال لاستلام الجهاز', { align: 'center' }));
  chunks.push(textLine(' '));
  chunks.push(textLine(' '));
  chunks.push(CMD.PAPER_CUT);

  return Buffer.concat(chunks);
}

function buildShiftReport(shift) {
  const chunks = [CMD.INIT];

  chunks.push(textLine('El-RESALA | الرسالة', { align: 'center', bold: true, doubleSize: true }));
  chunks.push(textLine('تقرير إغلاق الوردية (Z-Report)', { align: 'center', bold: true }));
  chunks.push(divider());

  chunks.push(textLine(`الكاشير: ${shift.cashierName}`, { align: 'right' }));
  chunks.push(textLine(`فتح الوردية: ${shift.openedAt}`, { align: 'right' }));
  chunks.push(textLine(`إغلاق الوردية: ${shift.closedAt}`, { align: 'right' }));
  chunks.push(divider());

  chunks.push(textLine(`رصيد بداية الوردية: ${shift.startFloat.toFixed(2)} ج.م`, { align: 'right' }));
  chunks.push(textLine(`عدد الفواتير: ${shift.salesCount}`, { align: 'right' }));
  chunks.push(textLine(`إجمالي المبيعات: ${shift.salesTotal.toFixed(2)} ج.م`, { align: 'right', bold: true }));
  chunks.push(textLine(`إيداعات نقدية أخرى: ${shift.cashIn.toFixed(2)} ج.م`, { align: 'right' }));
  chunks.push(textLine(`سحوبات نقدية: ${shift.cashOut.toFixed(2)} ج.م`, { align: 'right' }));
  if (shift.walletFees) {
    chunks.push(textLine(`أرباح خدمة المحافظ: ${shift.walletFees.toFixed(2)} ج.م`, { align: 'right' }));
  }
  chunks.push(divider());

  chunks.push(textLine(`الرصيد المتوقع بالخزينة: ${shift.expectedBalance.toFixed(2)} ج.م`, { align: 'right', bold: true, doubleSize: true }));
  chunks.push(textLine(`الرصيد المعدود فعلياً: ${shift.endCounted.toFixed(2)} ج.م`, { align: 'right', bold: true }));
  const varianceLabel = shift.variance === 0 ? 'مطابق تماماً' : shift.variance > 0 ? 'زيادة' : 'عجز';
  chunks.push(textLine(`الفرق: ${Math.abs(shift.variance).toFixed(2)} ج.م (${varianceLabel})`, { align: 'right', bold: true }));
  chunks.push(divider());

  chunks.push(textLine('توقيع الكاشير: ______________', { align: 'right' }));
  chunks.push(textLine(' '));
  chunks.push(textLine('نظام الرسالة (El-RESALA POS)', { align: 'center' }));
  chunks.push(textLine(' '));
  chunks.push(textLine(' '));
  chunks.push(CMD.PAPER_CUT);

  return Buffer.concat(chunks);
}

function buildDrawerKick() {
  return Buffer.concat([CMD.INIT, CMD.DRAWER_KICK]);
}

const LABEL_SIZES = {
  '38x25': { widthMm: 38, heightMm: 25, gapMm: 2 },
  '50x30': { widthMm: 50, heightMm: 30, gapMm: 2 },
};

function buildTsplLabel(size, data) {
  const dims = LABEL_SIZES[size] || LABEL_SIZES['38x25'];
  const lines = [
    `SIZE ${dims.widthMm} mm, ${dims.heightMm} mm`,
    `GAP ${dims.gapMm} mm, 0 mm`,
    'DIRECTION 1',
    'CLS',
    `TEXT 10,10,"3",0,1,1,"${escapeTspl(data.title || 'El-RESALA')}"`,
    `BARCODE 10,40,"128",60,1,0,2,2,"${escapeTspl(data.code)}"`,
    `TEXT 10,110,"2",0,1,1,"${escapeTspl(data.subtitle || data.code)}"`,
    'PRINT 1,1',
  ];
  return Buffer.from(lines.join('\r\n') + '\r\n', 'ascii');
}

function escapeTspl(value) {
  return String(value ?? '').replace(/"/g, "'");
}

function sendToNetworkPrinter(ip, port, buffer) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const timeout = setTimeout(() => {
      socket.destroy();
      reject(new Error(`Printer at ${ip}:${port} timed out`));
    }, 5000);

    socket.connect(port || 9100, ip, () => {
      socket.write(buffer, (err) => {
        clearTimeout(timeout);
        if (err) {
          socket.destroy();
          reject(err);
          return;
        }
        socket.end();
        resolve(true);
      });
    });

    socket.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

module.exports = {
  buildSaleReceipt,
  buildRepairIntakeReceipt,
  buildShiftReport,
  buildDrawerKick,
  buildTsplLabel,
  sendToNetworkPrinter,
  CMD,
};
