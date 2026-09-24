/**
 * Zero Noise calculator — saves each sign-up as a row in this sheet.
 *
 * Setup (5 minutes) is in SETUP.md next to this file.
 * Paste this whole file into your Google Sheet: Extensions -> Apps Script.
 */

// 1) Type any long random string here (30+ characters). Use the SAME string in Vercel as SHEET_WEBHOOK_SECRET.
var SECRET = "PASTE-YOUR-LONG-RANDOM-SECRET-HERE";

// 2) The tab (sheet) the rows go into. It is created automatically if it doesn't exist.
var TAB_NAME = "Calculator leads";

var HEADERS = [
  "Date", "First name", "Email", "I sell", "List size", "Offer price", "Currency",
  "Bare-minimum / year", "Bare-minimum / month", "Page", "Source", "Consent"
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (!SECRET || SECRET.indexOf("PASTE-YOUR") === 0 || data.secret !== SECRET) {
      return out({ ok: false, error: "unauthorized" });
    }
    if (!data.email || !data.name) return out({ ok: false, error: "missing" });

    lock.waitLock(10000); // two people signing up at once shouldn't overwrite each other
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(TAB_NAME) || ss.insertSheet(TAB_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(), data.name, data.email, data.offer || "", data.list, data.price, data.currency || "",
      data.floorYearly, data.floorMonthly, data.page || "", data.source || "", data.consent || ""
    ]);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

// Opening the web app URL in a browser just says it's alive (it never shows your data).
function doGet() {
  return out({ ok: true, service: "zero-noise-leads" });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
