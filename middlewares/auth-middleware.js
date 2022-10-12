const jwt = require("jsonwebtoken");
const { User } = require("../models");


module.exports = (req, res, next) => {
  const { token } = req.cookies;
  
  if (!token) {
    res.status(401).send({
      errorMessage: "로그인이 필요합니다.",
    });
    return;
  };

  try {
    const { key } = jwt.verify(token, "customized-secret-key");
    User.findByPk(key).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};