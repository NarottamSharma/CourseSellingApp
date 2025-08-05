const { jwt } = require("zod");
const {JWT_ADMIN_SECRET}=require("../config")


function adminMiddleware(req, res, next) {
  const { token } = req.header.token;
  const decoded = jwt.verify(token, JWT_ADMIN_SECRET);
  if (decoded) {
    req.userId = req.decoded.id,
    next()
  }else{
    res.status(403).json({
      message:"You are not signed in",
    })
  }
}

module.exports = {
  adminMiddleware: adminMiddleware,
};
