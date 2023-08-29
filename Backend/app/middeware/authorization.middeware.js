const jwt = require("jsonwebtoken");
const secret = "asdfghjkl!@#";
exports.authorization = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    console.log("req.headers.authorization", req.headers.authorization);
    if (auth) {
      jwt.verify(req.headers.authorization, secret, function (err, decoded) {
        if (err) {
          // Xử lý lỗi nếu JWT không hợp lệ
          console.log("error at auth middeware", err);
          return res.status(401).send({ message: "Invalid token" });
        }
        // JWT hợp lệ, "decoded" chứa thông tin giải mã từ payload của JWT
        req._id = decoded._id;
        req.position = decoded.position;
        req.userId = decoded.userId;
        next();
      });
    } else {
      req._id = null;
      req.position = null;
      req.userId = null;
      next();
    }
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
