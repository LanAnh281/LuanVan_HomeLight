const sanitizeString = (input) => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/&/g, "&amp;");
};

exports.sanitizeDataMiddleware = (req, res, next) => {
  console.log(">>>MID Body:", req.body);
  try {
    if (req.body) {
      for (const key in req.body) {
        console.log(key);
        if (Object.hasOwnProperty.call(req.body, key)) {
          if (req.body[key] != null && key != "isDelete" && key != "status")
            req.body[key] = sanitizeString(req.body[key]);
        }
      }
    }
    console.log(req.body);
    next();
  } catch (error) {
    return res.json({ message: error, status: "fail1" });
  }
};
