const { json } = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = process.env;

const verifyToken = async (req, res, next) => {
  const token =
    (await req.body.token) ||
    (await req.query.token) ||
    (await req.headers["x-access-token"]);

  if (!token) {
    return res.status(403).send("A token is required for authentication!");
  }
  try {
    const decoded = await jwt.verify(token, `${process.env.TOKEN_KEY}`);
    req.user = decoded;
  } catch (err) {
    return res.status(403).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
