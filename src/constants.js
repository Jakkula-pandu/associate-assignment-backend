module.exports = {
  ROLES: {
    ADMIN: "Admin",
    VERTICAL_LEAD: "Vertical Lead",
    ASSOCIATE: "Associate",
  },
  STATUS_CODES: {
    OK: 200,
    NEW_RESOURCE_CREATED: 201,
    ALREADY_EXIST: 225,
    DOES_NOT_EXIST: 227,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    INVALID: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    PASSWORD_NOT_SET: 410,
    LENGTH_REQUIRED: 411,
    MUST_BE_NUMBER: 415,
    TABLE_NOT_FOUND: 418,
    SESSION_EXPIRED: 440,
    INTERNAL_SERVER_ERROR: 500,
    SOMETHING_WENT_WRONG: 503,
    GATE_WAY_TIMEOUT: 504,
  },
  STATUS: {
    TRUE: true,
    FALSE: false,
  },
  MESSAGES: {
    200: "Successfully",
    225: "Already Exists",
    227: "Does Not Exists",
    400: "required",
    401: "Unauthorized",
    403: "Invalid",
    404: "Not Found",
    409: "Conflict",
    410: "Password Not Set",
    411: "Length Required",
    415: "Must Be A Number",
    418: "Table not found",
    440: "Session Expired",
    500: "Internal Server Error",
    503: "Some thing went wrong",
    504: "Gateway Timeout",

  },
  NUMBERS: {
    ZERO: 0,
    ONE: 1,
    TEN: 10,
    TWO: 2,
    THREE: 3,
    FOUR:4
  },
   STRING_COMPARE: {
    NULL: 'null',
    UNDEFINED: undefined
  },
  STRINGS: {
    NO_RECORDS: "No records found",
    ERROR_FETCHING_USERS: "Error fetching users",
    NOT_AUTHORIZED:"you are not authorized for add batches",
    BATCH_EXIST:'Batch with this name already exists.'
  },
  VARIABLES: {
    ROLE: "role",
    ROLE_ID: "role_id",
    ROLE_NAME: "role_name",
    CREATED_DATE: "created_date",
    DESC: "DESC",
  },
};
