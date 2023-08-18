const moment = require("moment-timezone");
const dateTime = (date) => {
  const dateFormat = "YYYY-M-D";
  const dateMoment = moment.tz(date, dateFormat, "UTC");
  const dateInDesiredTimezone = dateMoment.tz("Asia/Ho_Chi_Minh");

  return dateInDesiredTimezone.format();
};
module.exports = { dateTime };
