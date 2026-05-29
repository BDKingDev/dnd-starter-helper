const SHEET_NAME = 'Submissions';
const MAX_PLAYER_NAME_LENGTH = 80;
const MAX_OPTIONAL_ANSWER_LENGTH = 1000;
const MAX_TITLE_LENGTH = 160;
const MAX_CLASS_NAME_LENGTH = 80;

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    validatePayload_(payload);
    const sheet = getSubmissionSheet_();

    sheet.appendRow([
      new Date(),
      payload.playerName,
      payload.character.title,
      payload.character.className,
      payload.adventuringDrive.title,
      payload.careAbout.title,
      payload.flaw.title,
      payload.optionalAnswer,
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

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Missing request body.');
  }

  return JSON.parse(e.postData.contents);
}

function validatePayload_(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Submission payload must be an object.');
  }

  validateRequiredString_(payload.playerName, 'playerName', MAX_PLAYER_NAME_LENGTH);
  validateOptionalString_(payload.optionalAnswer, 'optionalAnswer', MAX_OPTIONAL_ANSWER_LENGTH);

  validateCard_(payload.character, 'character', {
    title: MAX_TITLE_LENGTH,
    className: MAX_CLASS_NAME_LENGTH
  });
  validateCard_(payload.adventuringDrive, 'adventuringDrive', {
    title: MAX_TITLE_LENGTH
  });
  validateCard_(payload.careAbout, 'careAbout', {
    title: MAX_TITLE_LENGTH
  });
  validateCard_(payload.flaw, 'flaw', {
    title: MAX_TITLE_LENGTH
  });
}

function validateCard_(card, fieldName, requiredFields) {
  if (!card || typeof card !== 'object' || Array.isArray(card)) {
    throw new Error(fieldName + ' must be an object.');
  }

  Object.keys(requiredFields).forEach(function(key) {
    validateRequiredString_(
      card[key],
      fieldName + '.' + key,
      requiredFields[key]
    );
  });
}

function validateRequiredString_(value, fieldName, maxLength) {
  if (typeof value !== 'string') {
    throw new Error(fieldName + ' must be a string.');
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error(fieldName + ' is required.');
  }

  if (trimmedValue.length > maxLength) {
    throw new Error(fieldName + ' is too long.');
  }
}

function validateOptionalString_(value, fieldName, maxLength) {
  if (value === undefined || value === null) {
    return;
  }

  if (typeof value !== 'string') {
    throw new Error(fieldName + ' must be a string.');
  }

  if (value.trim().length > maxLength) {
    throw new Error(fieldName + ' is too long.');
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
