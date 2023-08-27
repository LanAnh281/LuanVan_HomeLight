const jwt = require("jsonwebtoken");
const secret = "asdfghjkl!@#";
exports.authorization = (req, res, next) => {
  try {
    console.log("req.headers.authorization", req.headers.authorization);
    jwt.verify(req.headers.authorization, secret, function (err, decoded) {
      if (err) {
        // Xử lý lỗi nếu JWT không hợp lệ
        console.log("err");
        return res.status(401).send({ message: "Invalid token" });
      }
      // JWT hợp lệ, "decoded" chứa thông tin giải mã từ payload của JWT
      const _id = decoded._id;
      const position = decoded.position;
      req._id = _id;
      req.position = position;
      next();
    });
  } catch (error) {
    res.json({ message: error, status: "fail" });
  }
};
