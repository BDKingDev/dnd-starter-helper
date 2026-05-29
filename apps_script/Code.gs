const SHEET_NAME = 'Submissions';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = getSubmissionSheet_();

    sheet.appendRow([
      new Date(),
      payload.playerName || '',
      payload.character?.title || '',
      payload.character?.className || '',
      payload.adventuringDrive?.title || '',
      payload.careAbout?.title || '',
      payload.flaw?.title || '',
      payload.optionalAnswer || '',
      JSON.stringify(payload)
    ]);

    return jsonResponse_({
      success: true
    });
  } catch (error) {
    return jsonResponse_({
      success: false,
      error: String(error)
    });
  }
}

function getSubmissionSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'timestamp',
      'playerName',
      'characterTitle',
      'characterClassName',
      'adventuringDriveTitle',
      'careAboutTitle',
      'flawTitle',
      'optionalAnswer',
      'fullJsonPayload'
    ]);
  }

  return sheet;
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
