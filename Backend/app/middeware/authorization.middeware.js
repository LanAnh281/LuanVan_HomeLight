const jwt = require("jsonwebtoken");
const secret = "asdfghjkl!@#";
exports.authorization = (req, res, next) => {
  console.log("1");
  console.log("req.headers.authorization", req.headers.authorization);
  jwt.verify(req.headers.authorization, secret, function (err, decoded) {
    if (err) {
      // Xử lý lỗi nếu JWT không hợp lệ
      console.log("err");
      return res.status(401).send({ message: "Invalid token" });
    }

    // JWT hợp lệ, "decoded" chứa thông tin giải mã từ payload của JWT
    const userId = decoded.userId;
    const position = decoded.position;
    console.log("userId:", userId, "position:", position);
    next();
    // Tiếp tục xử lý dựa trên thông tin giải mã
    // ...
  });
};
