import Swal from "sweetalert2";
export const success = (title, text) => {
  Swal.fire({
    icon: "success",
    title: title,
    text: text,
    background: "#fff",
    didOpen: () => {
      const popup = Swal.getPopup();
      popup.style.border = "2px solid #ccc";
    },
  });
};
export const successAd = (title) => {
  Swal.fire({
    position: "top-end",
    icon: "", // Loại bỏ biểu tượng mặc định
    title: "",
    showConfirmButton: false,
    timer: 1000,
    customClass: {
      popup: "custom-popup-successAd",
    },
    html: `<div class="successAd row justify-content-around m-0 p-0"> 
            <span class="material-symbols-outlined col-1 m-0 p-0">done</span>
            <p class="col-11 " style="display:inline-block;text-align: start;">${title}</p>
          </div>`,
  });
};

export const warning = (title, text) => {
  Swal.fire({
    icon: "warning",
    title: title,
    text: text,
    background: "#fff",
    didOpen: () => {
      const popup = Swal.getPopup();
      popup.style.border = "2px solid #ccc";
    },
  });
};
export const deleted = (title, text) => {
  Swal.fire({
    icon: "delete",
    title: title,
    text: text,
    background: "#fff",
    didOpen: () => {
      const popup = Swal.getPopup();
      popup.style.border = "2px solid #ccc";
    },
  });
};
export const load = async (title) => {
  await Swal.fire({
    showConfirmButton: false, // Ẩn nút "OK"
    focusConfirm: false,
    customClass: {
      popup: "custom-popup-class",
    },
    html: ` <div class="spinner-border text-success custom-spinner " role="status">
              <span class="sr-only" >Loading...</span>
            </div>`,
  });
};
