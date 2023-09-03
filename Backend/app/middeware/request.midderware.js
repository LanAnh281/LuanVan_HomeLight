const sanitizeString = (input) => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/&/g, "&amp;");
};

exports.sanitizeDataMiddleware = (req, res, next) => {
  console.log(">>>Body:", req.body);
  if (req.body) {
    for (const key in req.body) {
      if (Object.hasOwnProperty.call(req.body, key)) {
        if (req.body[key] != null)
          req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }
  next();
};
