export const checkString = (value) => {
  const pattern = /^[\p{L}\s]+$/u;
  return !pattern.test(value);
};
export const checkIdentification = (value) => {
  const pattern = /^\d{12}$/;
  return !pattern.test(value);
};
export const checkAddress = (value) => {
  const pattern =
    /^[a-zA-Z0-9\s\\\/,.\-áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ\s\\\/,.\-]+$/;
  return !pattern.test(value);
};
export const checkPhone = (value) => {
  const pattern = /^\d{10}$/;
  return !pattern.test(value);
};
export const checkMail = (value) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return !pattern.test(value);
};
