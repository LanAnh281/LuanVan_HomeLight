<script>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import _ from "lodash";
//service
//js
import {
  checkIdentification,
  checkString,
  checkAddress,
  checkPhone,
  checkMail,
} from "../../assets/js/checkInput.common";
import { success, warning } from "../../assets/js/common.alert";
export default {
  components: {},
  setup() {
    const router = useRouter();
    const data = reactive({
      item: {
        userName: "",
        identification: "",
        phone: "",
        address: "",
        email: "",
        start: "",
        end: "",
        files: [],
      },
      error: {
        userName: "",
        identification: "",
        phone: "",
        address: "",
        email: "",
        start: "",
        end: "",
        image: "",
      },
      files: [],
      uploadFiles: [],
      message: "",
      flag: true,
    });
    const filesRef = ref(null);
    const isModalOpen = ref(false);
    // Khi chọn file
    const handleFileUpload = async (event) => {
      data.uploadFiles = [];
      const files = event.target.files;
      data.uploadFiles = [...data.uploadFiles, ...files];

      const previewImages = document.getElementById("previewImages");
      previewImages.innerHTML = "";
      const rowImages = document.createElement("div");
      rowImages.classList.add("row");
      for (const file of data.uploadFiles) {
        const reader = new FileReader();
        let invalidMessage = validate(file);
        if (invalidMessage == "") {
          reader.onload = function (e) {
            const colImage = document.createElement("div");
            colImage.classList.add("col-6");

            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.width = "192px";
            img.style.height = "100px";
            img.style.objectFit = "contain";
            const br = document.createElement("br");
            colImage.appendChild(img);
            colImage.appendChild(br);

            const span = document.createElement("span");
            span.textContent = `${file.name}`;
            colImage.appendChild(span);

            rowImages.appendChild(colImage);
            previewImages.appendChild(rowImages);
          };

          // reader.onloadend = function () {
          //   previewImages.appendChild(rowImages);
          // };
          reader.readAsDataURL(file);
        } else {
          const colImage = document.createElement("div");
          colImage.classList.add("col-6");
          const span = document.createElement("span");
          span.textContent = `${file.name}`;
          span.style.color = "red";
          colImage.appendChild(span);

          rowImages.appendChild(colImage);
          previewImages.appendChild(rowImages);
        }
      }

      data.files = [
        ...data.files,
        ..._.map(files, (file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: null,
          invalidMessage: validate(file),
        })),
      ];
    };

    //Kiểm tra loại file và kích thước file
    const validate = (file) => {
      const MAX_SIZE = 200000;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.type)) {
        return "not an image";
      }

      if (file.size > MAX_SIZE) {
        return `Max size: ${MAX_SIZE / 1000}kb `;
      }
      return "";
    };
    const formFields = [
      "userName",
      "identification",
      "phone",
      "address",
      "email",
      "start",
      "end",
    ];

    const save = async () => {
      if (data.flag) {
        const formData = new FormData();
        _.forEach(formFields, (field) => {
          formData.append(field, data.item[field]);
        });
        _.forEach(data.uploadFiles, (file) => {
          if (validate(file) === "") {
            formData.append("files", file);
          }
        });
        if (data.uploadFiles.length == 0) {
          for (let i = 0; i < 2; i++) {
            formData.append("files", "");
          }
        }
        // sử dụng axios có headers :{"Content-Type": "multipart/form-data",}
        //Kết nối với backend
        try {
          await axios.post(`http://localhost:3000/api/users`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const previewImages = document.getElementById("previewImages");
          previewImages.innerHTML = "";
          data.message = "Files has been uploaded";
          //Đặt lại giá trị ban đầu
          data.files = [];
          filesRef.value.value = "";
          data.uploadFiles = [];
          _.forEach(formFields, (field) => {
            data.item[field] = "";
          });
          success(
            "Thành công",
            "Đã tạo tài khoản thành công. Bạn hãy kiểm tra email đã đăng ký để đăng nhập"
          );
        } catch (err) {
          data.message = err;
        }
      } else {
        warning("Thất bại", "Bạn cần kiểm tra lại thông tin.");
      }
    };
    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal");
    };
    const closeModal = () => {
      console.log("close modal");
      const previewImages = document.getElementById("previewImages");
      previewImages.innerHTML = "";
      isModalOpen.value = false;
      data.message = "Files has been uploaded";
      //Đặt lại giá trị ban đầu
      data.files = [];
      filesRef.value.value = "";
      data.uploadFiles = [];
      _.forEach(formFields, (field) => {
        data.item[field] = "";
      });
    };
    onMounted(() => {
      //Get input
      filesRef.value = document.getElementById("inputImage");
      //lắng nghe mở modal
      $("#registrationModal").on("show.bs.modal", openModal);
      //lắng nghe đóng modal
      $("#registrationModal").on("hidden.bs.modal", closeModal);
    });

    return {
      data,
      handleFileUpload,
      save,
      checkString,
      checkIdentification,
      checkAddress,
      checkPhone,
      checkMail,
    };
  },
};
</script>
<template>
  <div class="body">
    <div
      class="modal fade"
      id="registrationModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Đăng ký</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form
              @submit.prevent="save"
              enctype="multipart/form-data"
              class="container mt-3"
            >
              <div class="form-group row">
                <label for="inputUserName" class="col-sm-3 col-form-label p-0"
                  >Họ Tên :</label
                >
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control"
                    id="inputUserName"
                    required
                    @blur="
                      () => {
                        let isCheck = checkString(data.item.userName);
                        if (isCheck) {
                          data.error.userName = 'Họ tên phải là ký tự';
                          data.flag = false;
                        }
                      }
                    "
                    @input="
                      data.error.userName = '';
                      data.flag = true;
                    "
                    v-model="data.item.userName"
                  />
                  <div v-if="data.error.userName" class="invalid-error">
                    {{ data.error.userName }}
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="inputidentificationCard"
                  class="col-sm-3 col-form-label p-0"
                  >Số CCCD :</label
                >
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control"
                    id="inputidentificationCard"
                    required
                    @blur="
                      () => {
                        let isCheck = checkIdentification(
                          data.item.identification
                        );
                        if (isCheck) {
                          data.error.identification = 'CCCD gồm 12 số';
                          data.flag = false;
                        }
                      }
                    "
                    @input="
                      data.error.identification = '';
                      data.flag = true;
                    "
                    v-model="data.item.identification"
                  />
                  <div v-if="data.error.identification" class="invalid-error">
                    {{ data.error.identification }}
                  </div>
                </div>
              </div>
              <!-- Image -->
              <div class="form-group row">
                <label
                  for="inputImagePrevious"
                  class="col-sm-3 col-form-label p-0"
                  >Ảnh CCCD (mặt trước và sau) :</label
                >
                <div class="col-sm-9">
                  <input
                    type="file"
                    @blur="
                      () => {
                        if (data.uploadFiles.length != 2) {
                          data.error.image = 'Ảnh cccd trước và sau';
                          data.flag = false;
                        }
                      }
                    "
                    @input="
                      data.error.image = '';
                      data.flag = true;
                    "
                    ref="files"
                    multiple
                    @change="handleFileUpload($event)"
                    class="form-control"
                    id="inputImage"
                  />
                  <div v-if="data.error.image" class="invalid-error">
                    {{ data.error.image }}
                  </div>
                </div>
                <div id="previewImages" class="container"></div>
              </div>
              <div class="form-group row">
                <label for="inputEmail" class="col-sm-3 col-form-label p-0"
                  >Email :</label
                >
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control"
                    id="inputEmail"
                    required
                    @blur="
                      () => {
                        let isCheck = checkMail(data.item.email);
                        if (isCheck) {
                          data.error.email = 'Chưa đúng định dạng email';
                          data.flag = false;
                        }
                      }
                    "
                    @input="
                      data.error.email = '';
                      data.flag = true;
                    "
                    v-model="data.item.email"
                  />
                  <div v-if="data.error.email" class="invalid-error">
                    {{ data.error.email }}
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPhone" class="col-sm-3 col-form-label p-0"
                  >SĐT :</label
                >
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control"
                    id="inputPhone"
                    required
                    @blur="
                      () => {
                        let isCheck = checkPhone(data.item.phone);
                        if (isCheck) {
                          data.error.phone = 'SĐT gồm 10 số';
                          data.flag = false;
                        }
                      }
                    "
                    @input="
                      data.error.phone = '';
                      data.flag = true;
                    "
                    v-model="data.item.phone"
                  />
                  <div v-if="data.error.phone" class="invalid-error">
                    {{ data.error.phone }}
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputaddress" class="col-sm-3 col-form-label p-0"
                  >Địa chỉ :</label
                >
                <div class="col-sm-9">
                  <textarea
                    class="form-control"
                    id="inputaddress"
                    @blur="
                      () => {
                        let isCheck = checkAddress(data.item.address);
                        if (isCheck) {
                          data.error.address =
                            'Địa chỉ không chứa các kí tự đặc biệt';
                          data.flag = false;
                        }
                      }
                    "
                    @input="
                      data.error.address = '';
                      data.flag = true;
                    "
                    v-model="data.item.address"
                  ></textarea>
                  <div v-if="data.error.address" class="invalid-error">
                    {{ data.error.address }}
                  </div>
                </div>
              </div>

              <div class="form-group row justify-content-around mb-0">
                <button type="submit" class="btn btn-login col-sm-3">
                  Đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.dangerous {
  color: red;
}
.non-dangerous {
  color: var(--black-light);
}
.modal-title {
  color: var(--chocolate);
}
</style>
