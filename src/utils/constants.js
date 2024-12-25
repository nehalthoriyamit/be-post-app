const HTTP_CODE = {
  SUCCESS_CODE: 200,
  RESOURCE_CREATED_CODE: 201,
  BAD_REQUEST_CODE: 400,
  UNAUTHORIZED_CODE: 401,
  NOT_FOUND_CODE: 404,
  CONFLICT_CODE: 409,
  FORBIDDEN_CODE: 403,
  SERVER_ERROR_CODE: 500,

  // Custom status code
  CUSTOM_CONFLICT_CODE: 209,
  CUSTOM_NOT_FOUND_CODE: 204,
};

const HTTP_STATUS = {
  ERROR_STATUS: "error",
  SUCCESS_STATUS: "success",
};

const PUBLIC_APIS = [
  new RegExp('/auth/login'),
  new RegExp('/auth/signup'),
];

module.exports = { HTTP_CODE, HTTP_STATUS, PUBLIC_APIS };
