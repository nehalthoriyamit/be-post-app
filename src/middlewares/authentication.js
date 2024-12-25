const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { isEmpty } = require('lodash');
const { ENV_VAR } = require('../utils/envConstants');
const { HTTP_STATUS, HTTP_CODE, PUBLIC_APIS } = require('../utils/constants');
const { handleResponse } = require('../utils/handleResponse');
const { Users } = require('../database/models');

const Authentication = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token || token === 'undefined') {
      if (PUBLIC_APIS.some((api) => api.test(req.url))) {
        return next();
      }
      return handleResponse(res, HTTP_STATUS.ERROR_STATUS, HTTP_CODE.UNAUTHORIZED_CODE, 'Send token with api');
    }

    jwt.verify(
      token,
      ENV_VAR.SECRET_KEY,
      async (err, decoded) => {
        if (err) {
          return handleResponse(
            res,
            HTTP_STATUS.ERROR_STATUS,
            HTTP_CODE.UNAUTHORIZED_CODE,
            'Token expired',
          );
        }

        const decodedToken = decoded;
        const query = {
          where: {
            id: decodedToken.id,
            deletedAt: {
              [Op.is]: null,
            },
          },
        };
        const authUser = await Users.findOne(query);
        if (!authUser || isEmpty(authUser)) {
          return handleResponse(
            res,
            HTTP_STATUS.ERROR_STATUS,
            HTTP_CODE.UNAUTHORIZED_CODE,
            'Invalid user',
          );
        }

        req.currentUser = authUser;
        next();
      },
    );
  } catch (error) {
    return handleResponse(res, HTTP_STATUS.ERROR_STATUS, HTTP_CODE.SERVER_ERROR_CODE, 'Authentication error');
  }
};
module.exports = { Authentication };
