const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { Users } = require("../../database/models");
const supabase = require("../../supabaseClient");
const { HTTP_STATUS, HTTP_CODE } = require("../../utils/constants");
const { handleResponse } = require("../../utils/handleResponse");
const { isEmpty, omit } = require("lodash");
const { ENV_VAR } = require("./../../utils/envConstants");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return handleResponse(
        res,
        HTTP_STATUS.ERROR_STATUS,
        HTTP_CODE.BAD_REQUEST_CODE,
        "Name, email and password are required"
      );
    }

    const qry = {
      where: {
        email,
        deletedAt: {
          [Op.is]: null,
        },
      },
    };

    const userData = await Users.findOne(qry);
    if (userData || !isEmpty(userData)) {
      return handleResponse(
        res,
        HTTP_STATUS.ERROR_STATUS,
        HTTP_CODE.BAD_REQUEST_CODE,
        "Email already exists"
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const bodyData = {
      name,
      email,
      password: passwordHash,
    };

    const result = await Users.create(bodyData);
    if (!result || isEmpty(result)) {
      return handleResponse(
        res,
        HTTP_STATUS.ERROR_STATUS,
        HTTP_CODE.CONFLICT_CODE,
        "User not register"
      );
    }

    return handleResponse(
      res,
      HTTP_STATUS.SUCCESS_STATUS,
      HTTP_CODE.RESOURCE_CREATED_CODE,
      "User register successfully"
    );
  } catch (err) {
    console.log('signup Error: ', err);
    return handleResponse(
      res,
      HTTP_STATUS.ERROR_STATUS,
      HTTP_CODE.SERVER_ERROR_CODE,
      "Server error"
    );
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleResponse(
        res,
        HTTP_STATUS.ERROR_STATUS,
        HTTP_CODE.BAD_REQUEST_CODE,
        "Email and password are required"
      );
    }

    const qry = {
      where: {
        email,
        deletedAt: {
          [Op.is]: null,
        },
      },
    };

    const userData = await Users.findOne(qry);
    if (!userData || isEmpty(userData)) {
      return handleResponse(
        res,
        HTTP_STATUS.ERROR_STATUS,
        HTTP_CODE.NOT_FOUND_CODE,
        "User not found"
      );
    }

    const checkPassword = await bcrypt.compare(password, userData.password);
    if (!checkPassword) {
      return handleResponse(
        res,
        HTTP_STATUS.ERROR_STATUS,
        HTTP_CODE.UNAUTHORIZED_CODE,
        "Incorrect password!"
      );
    }

    const user = omit(JSON.parse(JSON.stringify(userData)), ["password", "updatedAt", "deletedAt"]);

    const tokenOptions = { expiresIn: 24 * 60 * 60 };
    const token = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
      },
      ENV_VAR.SECRET_KEY,
      tokenOptions
    );

    return handleResponse(
      res,
      HTTP_STATUS.SUCCESS_STATUS,
      HTTP_CODE.SUCCESS_CODE,
      "Login successfully",
      {
        user,
        token,
      }
    );
  } catch (err) {
    console.log('login Error: ', err);
    return handleResponse(
      res,
      HTTP_STATUS.ERROR_STATUS,
      HTTP_CODE.SERVER_ERROR_CODE,
      "Server error"
    );
  }
};

// Signup using supabase
const signupOld = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    await Users.create({ email: user.email, password: user.password });
    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

// Login using supabase
const loginOld = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ token: user?.access_token });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { login, signup };
