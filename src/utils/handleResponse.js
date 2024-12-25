const { isEmpty } = require("lodash");

const handleResponse = (res, status, statusCode, message, data) => {
  const responseObj = { status, statusCode };

  if (typeof message === "string" && message?.length > 0) {
    responseObj.message = message;
  }

  if (data && !isEmpty(data)) {
    responseObj.data = data;
  }

  return res.status(statusCode).json(responseObj);
};
module.exports = { handleResponse };
