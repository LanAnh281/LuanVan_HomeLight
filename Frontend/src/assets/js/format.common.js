import moment from "moment-timezone";
export const formatDateTime = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
  const year = newDate.getFullYear();
  var formattedDate =
    (day < 10 ? "0" : "") +
    day +
    "/" +
    (month < 10 ? "0" : "") +
    month +
    "/" +
    year;
  return formattedDate;
};
