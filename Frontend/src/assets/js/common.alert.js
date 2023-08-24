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
