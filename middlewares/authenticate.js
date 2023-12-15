const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");
const { Auth } = require("../models/auth");
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer" || !token) next(HttpError(401));

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const auth = await Auth.findById(id);
    if (!auth || !auth.token || auth.token !== token) {
      next(HttpError(401));
    }

    req.auth = auth;
    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = authenticate;
