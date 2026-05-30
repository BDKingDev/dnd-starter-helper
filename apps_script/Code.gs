const SHEET_NAME = 'Submissions';
const SUBMISSION_TOKEN_PROPERTY = 'SUBMISSION_TOKEN';
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_CACHE_TTL_SECONDS = 120;
const MAX_PLAYER_NAME_LENGTH = 80;
const MAX_OPTIONAL_ANSWER_LENGTH = 1000;
const MAX_TITLE_LENGTH = 160;
const MAX_CLASS_NAME_LENGTH = 80;

function doPost(e) {
  try {
    enforceRateLimit_();
    const payload = parsePayload_(e);
    validateSubmissionToken_(payload.submissionToken);
    validatePayload_(payload);
    const sheet = getSubmissionSheet_();
    const sanitizedPayload = buildStoredPayload_(payload);

    sheet.appendRow([
      new Date(),
      sanitizedPayload.playerName,
      sanitizedPayload.character.title,
      sanitizedPayload.character.className,
      sanitizedPayload.adventuringDrive.title,
      sanitizedPayload.careAbout.title,
      sanitizedPayload.flaw.title,
      sanitizedPayload.optionalAnswer,
      JSON.stringify(sanitizedPayload)
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

function enforceRateLimit_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);

  try {
    const cache = CacheService.getScriptCache();
    const cacheKey = getRateLimitCacheKey_();
    const currentCount = Number(cache.get(cacheKey) || '0');

    if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    }

    cache.put(
      cacheKey,
      String(currentCount + 1),
      RATE_LIMIT_CACHE_TTL_SECONDS
    );
  } finally {
    lock.releaseLock();
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Missing request body.');
  }

  return JSON.parse(e.postData.contents);
}

function validateSubmissionToken_(providedToken) {
  const configuredToken = PropertiesService
    .getScriptProperties()
    .getProperty(SUBMISSION_TOKEN_PROPERTY);

  if (!configuredToken) {
    return;
  }

  if (typeof providedToken !== 'string' || providedToken.trim() !== configuredToken) {
    throw new Error('Invalid submission token.');
  }
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

function buildStoredPayload_(payload) {
  return {
    playerName: payload.playerName,
    submittedAt: payload.submittedAt || '',
    character: payload.character,
    adventuringDrive: payload.adventuringDrive,
    careAbout: payload.careAbout,
    flaw: payload.flaw,
    optionalAnswer: payload.optionalAnswer || ''
  };
}

function getRateLimitCacheKey_() {
  const bucket = Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS);
  return 'rate-limit:' + bucket;
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
