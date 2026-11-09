/**
 * TriStar 1947 — Google Sheet backend (Apps Script web app).
 * Free, no Google Cloud project and no billing details needed.
 *
 * Setup (see README): open the Sheet → Extensions → Apps Script → paste this file →
 * set SECRET below → Deploy → New deployment → Web app →
 *   Execute as: Me · Who has access: Anyone → copy the Web app URL.
 * The URL + SECRET go into the website's environment variables (APPS_SCRIPT_URL / APPS_SCRIPT_SECRET).
 * Requests without the correct SECRET are rejected.
 */
const SECRET = 'PASTE_A_LONG_RANDOM_STRING_HERE';

// Columns kept as plain text so phone numbers, dates and "=..." values are never reinterpreted by Sheets.
const NUMERIC_HEADERS = ['Total (₹)'];

function doPost(e) {
  // Only writes take the lock. Reads and email sends run freely so a slow email never blocks the dashboard.
  let lock = null;
  try {
    const req = JSON.parse(e.postData.contents);
    if (!SECRET || SECRET.indexOf('PASTE_') === 0 || req.secret !== SECRET) return out({ ok: false, error: 'unauthorized' });
    if (req.action === 'ensure' || req.action === 'append' || req.action === 'update') {
      lock = LockService.getScriptLock();
      lock.waitLock(20000);
    }
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    switch (req.action) {
      case 'ensure': {
        Object.keys(req.tabs).forEach(function (name) {
          const headers = req.tabs[name];
          let sh = ss.getSheetByName(name);
          if (!sh) {
            sh = ss.insertSheet(name);
            sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
            sh.setFrozenRows(1);
          } else {
            // newer app versions may add columns: write any missing header cells (data rows are never touched)
            const have = sh.getLastColumn() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].length : 0;
            if (have < headers.length) {
              sh.getRange(1, have + 1, 1, headers.length - have).setValues([headers.slice(have)]).setFontWeight('bold');
            }
          }
          headers.forEach(function (h, i) {
            if (NUMERIC_HEADERS.indexOf(h) === -1) sh.getRange(2, i + 1, Math.max(sh.getMaxRows() - 1, 1), 1).setNumberFormat('@');
          });
        });
        return out({ ok: true });
      }
      case 'append': {
        const sh = ss.getSheetByName(req.tab);
        const r = sh.getLastRow() + 1;
        sh.getRange(r, 1, 1, req.row.length).setValues([req.row]);
        return out({ ok: true });
      }
      case 'read': {
        const sh = ss.getSheetByName(req.tab);
        const lr = sh.getLastRow(), lc = sh.getLastColumn();
        return out({ ok: true, values: lr && lc ? sh.getRange(1, 1, lr, lc).getDisplayValues() : [] });
      }
      case 'update': {
        const sh = ss.getSheetByName(req.tab);
        sh.getRange(req.row, req.col + 1, 1, req.values.length).setValues([req.values]);
        return out({ ok: true });
      }
      case 'sendEmail': {
        // Sends from the Google account that owns this script. Needs the "send email" permission (asked on first deploy).
        const opts = { to: req.to, subject: req.subject, body: req.text || '', htmlBody: req.html, name: req.name || 'TriStar 1947' };
        if (req.replyTo) opts.replyTo = req.replyTo;
        MailApp.sendEmail(opts);
        return out({ ok: true, remaining: MailApp.getRemainingDailyQuota() });
      }
      default:
        return out({ ok: false, error: 'bad action' });
    }
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    if (lock) lock.releaseLock();
  }
}

/** Run this ONCE from the editor (select it in the dropdown → Run) to grant the "send email" permission. */
function authorizeMail() {
  Logger.log('Mail quota remaining today: ' + MailApp.getRemainingDailyQuota());
  MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'TriStar website: email permission granted', 'Your website can now send emails.');
}

function doGet() {
  return out({ ok: true, service: 'tristar-sheet-backend' });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
