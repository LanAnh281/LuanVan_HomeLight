<script>
import { reactive, onMounted, ref } from "vue";
import axios from "axios";
import _ from "lodash";
//service
import boardinghouseService from "../../../service/boardinghouse.service";
//component
import Select from "../../../components/select/selectdependent.vue";

//js
import {
  checkStringAndNumber,
  checkAddress,
  checkPhone,
} from "../../../assets/js/checkInput.common";
import { successAd, warning } from "../../../assets/js/common.alert";
import { city, district, ward } from "../../../assets/js/dependent.common";
export default {
  components: { Select },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        name: "",
        phone: "",
        city: { name: "" },
        district: { name: "" },
        ward: { name: "" },
        number: "",
        address: "",
        rules: "",
      },
      error: {
        name: "",
        number: "",
        phone: "",
        city: "",
        district: "",
        ward: "",
        countFiles: 0,
      },
      flag: true,
      city: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
      uploadFiles: [],
      files: [],
    });
    const isModalOpen = ref(false);
    const filesRef = ref(null);
    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal boarding");
    };
    const closeModal = () => {
      console.log("close modal boarding");
      emit("closeModal");
    };
    const change = async (value) => {
      try {
        const document = await city(value);
        data.item.city = document.city;
        data.district = document.district;
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    };
    const changeDistrict = async (value) => {
      try {
        const document = await district(data.item.city.code, value);
        data.item.district = document.district;
        data.ward = document.ward;
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    };
    const changeWard = async (value) => {
      //city,district,value
      try {
        const document = await ward(
          data.item.city.code,
          data.item.district.code,
          value
        );
        data.item.ward = document.ward;
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    };
    const handleFileUpload = async (event) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const MAX_SIZE_VIDEO = 100000000; //100mb
      const allowedTypesVideo = [
        "video/mp4",
        "video/avi",
        "video/webm",
        "video/mov",
      ];
      const files = event.target.files;

      data.uploadFiles = [...data.uploadFiles, ...files];
      data.files = [
        ...data.files,
        ..._.map(data.uploadFiles, (file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          invalidMessage: validate(file),
        })),
      ];
      const previewImages = document.getElementById("previewImages");
      previewImages.innerHTML = "";
      const rowImages = document.createElement("div");
      rowImages.classList.add("row");

      for (const file of data.uploadFiles) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const colImage = document.createElement("div");
          colImage.classList.add("col-6", "mt-2");
          colImage.style.position = "relative";
          colImage.id = file.name;
          if (allowedTypes.includes(file.type)) {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.maxWidth = "100%";
            img.style.maxHeight = "100%";
            img.style.objectFit = "containt";
            colImage.append(img);
          } else if (allowedTypesVideo.includes(file.type)) {
            const video = document.createElement("video");
            video.src = e.target.result;
            video.style.maxWidth = "100%";
            video.style.maxHeight = "100%";
            colImage.append(video);
          }

          const deleteIcon = document.createElement("span");
          deleteIcon.textContent = "x";
          deleteIcon.style.cssText = `
                  position:absolute;
                  top:-16px;
                  right:10px;
                  width:24px;
                  height:24px;
                  font-weight:400;
                  font-size:1.2rem;
                  color:red;
                  background-color:rgba(240, 227, 227,0.5);
                  text-align:center;
                  line-height:1;                 
          `;
          deleteIcon.classList.add("rounded-circle");
          deleteIcon.addEventListener("mouseenter", () => {
            deleteIcon.style.cssText = `
                  position:absolute;
                  top:-16px;
                  right:10px;
                  width:24px;
                  height:24px;
                  font-weight:600;
                  font-size:1.2rem;
                  color:red;
                  background-color:rgb(240, 227, 227);
                  text-align:center;
                  line-height:1;                 
          `;
          });
          deleteIcon.addEventListener("mouseleave", function () {
            deleteIcon.style.cssText = `
                  position:absolute;
                  top:-16px;
                  right:10px;
                  width:24px;
                  height:24px;
                  font-weight:400;
                  font-size:1.2rem;
                  color:red;
                  background-color:rgba(240, 227, 227,0.5);
                  text-align:center;
                  line-height:1;                 
          `;
          });
          deleteIcon.addEventListener("click", () => {
            data.uploadFiles = data.uploadFiles.filter((item) => item != file);
            const colRemove = document.getElementById(file.name);
            colRemove.remove();
          });

          const br = document.createElement("br");

          colImage.append(deleteIcon);
          colImage.append(br);
          const span = document.createElement("span");
          if (validate(file) == "") {
            span.textContent = `${file.name}`;
            colImage.append(span);
          } else {
            span.textContent = `${file.name}`;
            span.style.color = "red";
            span.style.fontWeight = "600";
          }

          colImage.append(span);
          rowImages.append(colImage);
          previewImages.append(rowImages);
        };

        reader.readAsDataURL(file);
      }
    };
    const validate = (file) => {
      const MAX_SIZE = 2000000; //2Mb
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const MAX_SIZE_VIDEO = 100000000; //100Mb
      const allowedTypesVideo = [
        "video/mp4",
        "video/avi",
        "video/webm",
        "video/mov",
      ];
      if (
        !allowedTypes.includes(file.type) &&
        !allowedTypesVideo.includes(file.type)
      ) {
        return "not an image and a video";
      }
      const maxSize = allowedTypes.includes(file.type)
        ? MAX_SIZE
        : MAX_SIZE_VIDEO;
      if (file.size > maxSize) {
        return `Max size: ${maxSize / 1000}kb `;
      }
      return "";
    };
    const formFields = ["name", "phone", "address", "countFiles"];
    const refresh = () => {
      data.item = {
        name: "",
        phone: "",
        city: { name: "" },
        district: { name: "" },
        ward: { name: "" },
        number: "",
        address: "",
        rules: "",
      };
      data.error = {
        name: "",
        number: "",
        phone: "",
        city: "",
        district: "",
        ward: "",
      };
      data.flag = true;
    };
    const save = async () => {
      const keys = ["name", "number", "phone", "city", "district", "ward"];
      try {
        for (const key of keys) {
          if (
            data.item[key] == "" &&
            key != "city" &&
            key != "district" &&
            key != "ward"
          ) {
            data.error[key] = "Chưa nhập thông tin.";
            data.flag = true;
          } else if (key == "city" || key == "district" || key == "ward") {
            if (data.item[key].name == "") {
              data.error[key] = "Chưa nhập thông tin.";
              data.flag = true;
            }
          }
        }

        if (!data.flag) {
          data.item.address = `${data.item.number} - ${data.item.ward.name} - ${data.item.district.name} - ${data.item.city.name}`;
          const formData = new FormData();
          data.item.countFiles = data.uploadFiles.length;
          _.forEach(formFields, (field) => {
            formData.append(field, data.item[field]);
          });

          if (data.item.countFiles > 0) {
            _.forEach(data.uploadFiles, (file) => {
              if (validate(file) === "") {
                formData.append("files", file);
              }
            });
          }

          const document = await boardinghouseService.create(formData);
          if (document["status"] == "success") {
            successAd(`Đã thêm nhà trọ ${document.message["name"]}`);
            refresh();
            emit("add");
          } else {
            warning("Thất bại", "Bạn không có quyền thêm nhà trọ.");
          }
        }
      } catch (error) {
        if (error) {
          warning("Thất bại", "Bạn không có quyền thêm nhà trọ.");
        }
        console.log(error);
      }
    };
    onMounted(async () => {
      $("#boardingModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#boardingModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
      filesRef.value = document.getElementById("inputImage"); //Get input
      // 3 cấp tỉnh thành
      try {
        await axios
          .get(`https://provinces.open-api.vn/api/?depth=1`, {})
          .then((response) => {
            data.city = response;
          });
      } catch (error) {
        console.log(error);
      }
    });

    return {
      data,
      save,
      checkStringAndNumber,
      checkAddress,
      checkPhone,
      handleFileUpload,
      // 3 cấp
      change,
      changeDistrict,
      changeWard,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="boardingModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">Thêm nhà trọ</h5>
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
              <label for="inputname" class="col-sm-3 col-form-label p-0"
                >Tên nhà trọ :</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputname"
                  @blur="
                    () => {
                      let isCheck = checkStringAndNumber(data.item.name);
                      if (isCheck) {
                        data.error.name = 'Không chứa các ký tự đặc biệt.';
                        data.flag = true;
                      }
                    }
                  "
                  @input="
                    data.error.name = '';
                    data.flag = false;
                  "
                  v-model="data.item.name"
                />
                <div v-if="data.error.name" class="invalid-error">
                  {{ data.error.name }}
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
                  id="Phone"
                  @blur="
                    () => {
                      let isCheck = checkPhone(data.item.phone);
                      if (isCheck) {
                        data.error.phone = 'Số điện thoại gồm 10 số.';
                        data.flag = true;
                      }
                    }
                  "
                  @input="
                    data.error.phone = '';
                    data.flag = false;
                  "
                  v-model="data.item.phone"
                />
                <div v-if="data.error.phone" class="invalid-error">
                  {{ data.error.phone }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputrules" class="col-sm-3 col-form-label p-0"
                >Thành phố :</label
              >
              <div class="col-sm-9">
                <Select
                  :title="`Chọn thành phố`"
                  :data="data.city.data"
                  @choose="(value) => change(value)"
                  @input="
                    () => {
                      data.flag = false;
                      data.error.city = '';
                    }
                  "
                ></Select>
                <div v-if="data.error.city" class="invalid-error">
                  {{ data.error.city }}
                </div>
              </div>
            </div>

            <div class="form-group row">
              <label for="inputrules" class="col-sm-3 col-form-label p-0"
                >Quận huyện :</label
              >
              <div class="col-sm-9">
                <Select
                  :title="`Chọn quận huyện`"
                  :data="data.district.data.districts"
                  @choose="(value) => changeDistrict(value)"
                  @input="
                    () => {
                      data.flag = false;
                      data.error.district = '';
                    }
                  "
                ></Select>
                <div v-if="data.error.district" class="invalid-error">
                  {{ data.error.district }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputrules" class="col-sm-3 col-form-label p-0"
                >Phường xã :</label
              >
              <div class="col-sm-9">
                <Select
                  :title="`Chọn phường xã`"
                  :data="data.ward.data.wards"
                  @choose="(value) => changeWard(value)"
                  @input="
                    () => {
                      data.flag = false;
                      data.error.ward = '';
                    }
                  "
                ></Select>
                <div v-if="data.error.ward" class="invalid-error">
                  {{ data.error.ward }}
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
                      let isCheck = checkAddress(data.item.number);
                      if (isCheck) {
                        data.error.number =
                          'Địa chỉ không được bỏ trống và chứa các kí tự đặc biệt.';
                        data.flag = true;
                      }
                    }
                  "
                  @input="
                    data.error.number = '';
                    data.flag = false;
                  "
                  v-model="data.item.number"
                ></textarea>
                <div v-if="data.error.number" class="invalid-error">
                  {{ data.error.number }}
                </div>
              </div>
            </div>
            <!-- Image -->
            <div class="form-group row">
              <label for="inputImage" class="col-sm-3 col-form-label p-0"
                >Ảnh nhà trọ :</label
              >
              <div class="col-sm-9">
                <input
                  type="file"
                  @blur="() => {}"
                  @input="() => {}"
                  ref="files"
                  multiple
                  @change="handleFileUpload($event)"
                  class="form-control"
                  id="inputImage"
                />
              </div>
              <div id="previewImages" class="container mt-2"></div>
            </div>
            <div class="form-group row justify-content-around mb-0">
              <button type="submit" class="btn btn-login col-sm-2">Thêm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-content {
  width: 140%;
  margin-left: -12%;
}
</style>
