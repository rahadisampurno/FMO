const SPREADSHEET_ID = '1OwGRjXQfhKO071H8Ayap9Uqdn-rq8bTUZ6bfVTSVTXY';
const SHEET_NAME = 'Sheet1';
const MAX_FIELD_LENGTH = 240;
const HEADERS = ['Submitted At', 'Kota', 'Acara', 'Rencana Waktu', 'Venue', 'WhatsApp', 'Source', 'Submission ID'];

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function clean(value) {
  return String(value || '').trim().slice(0, MAX_FIELD_LENGTH);
}

function ensureSheetStructure(spreadsheet, sheet) {
  const currentHeaders = sheet.getRange(1, 1, 1, 8).getDisplayValues()[0];
  if (currentHeaders[5] === 'Source') sheet.insertColumnBefore(6);

  spreadsheet.setSpreadsheetTimeZone('Asia/Jakarta');
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
}

function doPost(event) {
  const lock = LockService.getScriptLock();

  try {
    const payload = JSON.parse(event && event.postData ? event.postData.contents : '{}');
    const submissionId = clean(payload.submissionId);
    const city = clean(payload.city);
    const eventType = clean(payload.event);
    const plannedDate = clean(payload.date);
    const venue = clean(payload.venue);
    const phone = clean(payload.phone);
    const source = clean(payload.source) || 'website-entry';

    if (!submissionId || !city || !eventType || !plannedDate || !venue || !phone) {
      return jsonResponse({ ok: false, error: 'required_fields_missing' });
    }

    lock.waitLock(10000);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) return jsonResponse({ ok: false, error: 'sheet_not_found' });
    ensureSheetStructure(spreadsheet, sheet);

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existingIds = sheet.getRange(2, 8, lastRow - 1, 1).getDisplayValues().flat();
      if (existingIds.includes(submissionId)) return jsonResponse({ ok: true, duplicate: true });
    }

    // Typed table columns reject setNumberFormat calls. Writing the values in
    // one append keeps the table's configured column types and avoids partial rows.
    sheet.appendRow([new Date(), city, eventType, plannedDate, venue, phone, source, submissionId]);
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
