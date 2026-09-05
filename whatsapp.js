/**
 * whatsapp.js
 * -----------------------------------------------------------------------
 * Generates safe WhatsApp "Click-to-Chat" links (https://wa.me/) so the
 * cashier/technician can send a message with one click, without ever
 * saving the customer's number as a contact and without any WhatsApp
 * Business API credentials, tokens, or automation that could violate
 * WhatsApp's terms of service. Opening the link is a manual, human action
 * — El-RESALA never sends messages automatically or in bulk.
 *
 * Unchanged from the Electron version — this logic has nothing to do
 * with Electron/Node internals, it's pure string building, so it ports
 * over as-is. The one difference: in the desktop app, `shell.openExternal`
 * opened the link in the OS default browser from the main process. On
 * the web, the frontend opens the returned URL itself via
 * `window.open(url, '_blank')`, since there's no OS shell to hand off to.
 */

const EGYPT_COUNTRY_CODE = '20';

function normalizeEgyptPhone(rawPhone) {
  let digits = String(rawPhone).replace(/[^\d]/g, '');
  if (digits.startsWith('0020')) digits = digits.slice(4);
  else if (digits.startsWith('20') && digits.length > 11) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return `${EGYPT_COUNTRY_CODE}${digits}`;
}

function buildChatLink(rawPhone, message) {
  const phone = normalizeEgyptPhone(rawPhone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

function salesReceiptMessage({ invoiceCode, total }) {
  return `أهلاً بك في الرسالة (El-RESALA)! فاتورتك رقم ${invoiceCode} بقيمة ${total} ج.م جاهزة. شكراً لثقتك بنا.`;
}

function repairStatusMessage({ customerName, device, cost, ticketCode }) {
  return `عميلنا العزيز ${customerName}، تم الانتهاء من صيانة جهازك (${device}) وهو جاهز للتسليم الآن في فرع الرسالة (El-RESALA). التكلفة: ${cost} ج.م. رقم التذكرة: ${ticketCode}.`;
}

function debtReminderMessage({ customerName, debt }) {
  return `مرحباً ${customerName}، نود تذكيركم بأن الرصيد المتبقي المستحق لحسابكم لدى الرسالة (El-RESALA) هو ${debt} ج.م.`;
}

const links = {
  salesReceipt: ({ phone, invoiceCode, total }) =>
    buildChatLink(phone, salesReceiptMessage({ invoiceCode, total })),

  repairStatus: ({ phone, customerName, device, cost, ticketCode }) =>
    buildChatLink(phone, repairStatusMessage({ customerName, device, cost, ticketCode })),

  debtReminder: ({ phone, customerName, debt }) =>
    buildChatLink(phone, debtReminderMessage({ customerName, debt })),

  custom: ({ phone, message }) => buildChatLink(phone, message),
};

module.exports = {
  normalizeEgyptPhone,
  buildChatLink,
  salesReceiptMessage,
  repairStatusMessage,
  debtReminderMessage,
  links,
};
