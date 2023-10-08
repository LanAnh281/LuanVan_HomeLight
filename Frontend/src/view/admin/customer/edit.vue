<script>
import { reactive, onMounted, ref, onBeforeMount, defineComponent } from "vue";
import axios, { all } from "axios";
import _ from "lodash";
//component
import Select from "../../../components/select/selectdependent.vue";
import SelectNormal from "../../../components/select/select.vue";
//service
import userService from "../../../service/user.service";
//js
import { city, district, ward } from "../../../assets/js/dependent.common";
import { load, successAd, warning } from "../../../assets/js/common.alert";
import {
  checkAddress,
  checkIdentification,
  checkMail,
  checkNumber,
  checkPhone,
  checkStringAndNumber,
  sanitizeInput,
  checkString,
} from "../../../assets/js/checkInput.common";
// view
export default {
  components: { Select, SelectNormal },
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        userName: "",
        identification: "",
        phone: "",
        city: "",
        district: "",
        ward: "",
        number: "",
        address: "",
        email: "",
        start: "",
        end: "",
        numberPlate: "",
        sex: false,
        birthday: "",
        securityDeposit: 0,
        files: [],
        countFile: 0,
        //room
      },
      error: {
        userName: "",
        identification: "",
        phone: "",
        city: "",
        district: "",
        ward: "",
        number: "",
        email: "",
        birthday: "",
        sex: "",
      },
      files: [],
      uploadFiles: [],
      message: "",
      //3 cấp
      city: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
      flag: true,
      levels: { city: {}, district: {}, ward: {} },
      btnSubmit: "Lưu",
      removeList: [],
    });
    const filesRef = ref(null);

    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal view room");
    };
    const closeModal = () => {
      console.log("close modal view room");
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

    const validate = (file) => {
      const MAX_SIZE = 2000000; //2Mb
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

      if (
        !allowedTypes.includes(file.type) &&
        !allowedTypesVideo.includes(file.type)
      ) {
        return "not an image and a video";
      }
      const max = allowedTypes.includes(file.type) ? MAX_SIZE : MAX_SIZE_VIDEO;
      if (file.size > max) {
        return `Max size: ${max / 1000}kb`;
      }
      return "";
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

    const save = async () => {
      data.item.address = `${data.item.number} - ${data.item.ward.name} - ${data.item.district.name} - ${data.item.city.name}`;
      console.log(data.item.address);
      try {
        if (data.removeList.length == 2) {
          if (data.uploadFiles.length != 2) {
            data.error["image"] = "Chưa tải đủ ảnh cccd.";
            data.flag = true;
            console.log("key:image");
          }
        } else if (data.removeList.length == 1) {
          if (data.uploadFiles.length != 1) {
            data.error["image"] = "Thiếu 1 ảnh cccd.";
            data.flag = true;
            console.log("key:image");
          }
        }

        // for (let key in data.error) {
        //   if (key == "sex") continue;
        //   if (data.item[key] == "") {
        //     data.error[key] = "Chưa nhập thông tin";
        //     data.flag = true;
        //     console.log("key:", key, data.item[key]);
        //   }
        // }
        console.log(data.flag);
        // if (!data.flag) {
        data.btnSubmit = "Đang lưu";
        const formData = new FormData();
        for (let key in data.item) {
          formData.append(key, data.item[key]);
        }
        _.forEach(data.uploadFiles, (file) => {
          if (validate(file) === "") {
            formData.append("files", file);
          }
        });
        formData.append("countFile", data.uploadFiles.length);
        _.forEach(data.removeList, (image) => {
          formData.append("removeImages", JSON.stringify(image));
        });
        formData.append("removeImages", "");
        console.log("data.removeList", data.removeList);
        setTimeout(() => {
          load();
        }, 0);
        const documentUpdateUser = await userService.update(
          props._id,
          formData
        );
        console.log(documentUpdateUser);
        if (documentUpdateUser["status"] == "success") {
          successAd("Thành công");
          await refresh();
          data.btnSubmit = "Lưu";
          emit("edit");
        } else {
          warning("Thất bại");
        }
        // }
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
    const refresh = async () => {
      const documentUser = await userService.get(props._id);
      data.item = documentUser.message;
      data.item.birthday = new Date(data.item.birthday)
        .toISOString()
        .split("T")[0];

      const address = data.item.address.split(" - ");
      data.item.number = address[0];

      const response = await axios.get(
        `https://provinces.open-api.vn/api/?depth=1`
      );
      data.city = response;
      data.levels.city = response;
      data.levels.city = data.levels.city.data.filter(
        (item) => item.name == address[3]
      );
      data.levels.city = data.levels.city[0];
      data.item.city = data.levels.city;
      console.log(">>>city:", data.levels.city);
      // //district
      const documentDistrict = await city(data.levels.city.code);
      data.levels.district = documentDistrict.district;
      data.district = documentDistrict.district;
      data.levels.district = data.levels.district.data.districts.filter(
        (item) => item.name == address[2]
      );
      data.levels.district = data.levels.district[0];
      data.item.district = data.levels.district;
      console.log(">>>district:", data.levels.district);

      //ward
      const ward = await axios.get(
        `https://provinces.open-api.vn/api/d/${data.levels.district.code}?depth=2`,
        {}
      );
      data.levels.ward = ward;
      console.log(">>>ward:", ward.data.wards.length, address[1]);
      data.ward = ward;
      data.levels.ward = ward.data.wards.filter(
        (item) => item.name == address[1]
      );
      data.levels.ward = data.levels.ward[0];
      data.item.ward = data.levels.ward;
      console.log("ward:", data.levels.ward);

      data.flag = true;
      const previewImages = document.getElementById("previewImages");
      previewImages.innerHTML = "";
      filesRef.value = document.getElementById("inputImage");
      filesRef.value.value = "";
    };
    const handleDeleteImagePrevious = async () => {
      const previousImage = document.getElementById("imagePrevious");
      previousImage.remove();
      data.removeList.push({
        id: data.item.imagePrevious,
        name: "imagePrevious",
      });
      data.item.imagePrevious = "";
    };
    const handleDeleteImageAfter = () => {
      const afterImage = document.getElementById("imageAfter");
      afterImage.remove();
      data.removeList.push({ id: data.item.imageAfter, name: "imageAfter" });
      data.item.imageAfter = "";
    };
    onMounted(async () => {
      try {
        await refresh();
        filesRef.value = document.getElementById("inputImage");
        $("#editUserModal").on("show.bs.modal", openModal); //lắng nghe mở modal
        $("#editUserModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal

        // data.city = await axios.get(
        //   `https://provinces.open-api.vn/api/?depth=1`
        // );
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    });
    return {
      data,
      change,
      changeDistrict,
      changeWard,
      save,
      handleFileUpload,
      // check input
      checkAddress,
      checkIdentification,
      checkMail,
      checkNumber,
      checkPhone,
      checkStringAndNumber,
      sanitizeInput,
      checkString,
      //remove image
      handleDeleteImagePrevious,
      handleDeleteImageAfter,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="editUserModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Cập nhật khách trọ
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body mx-3">
          <form
            class="row justify-content-around"
            @submit.prevent="save"
            enctype="multipart/form-data"
          >
            <!-- form 1 -->
            <form class="col-6">
              <!-- userName -->
              <div class="form-group row">
                <label
                  for="inputUserName"
                  class="col-sm-4 m-0 px-0 col-form-label"
                  >Họ và tên:</label
                >
                <div class="col-sm-8 p-0 m-0">
                  <input
                    type="email"
                    class="form-control"
                    id="inputUserName"
                    @blur="
                      () => {
                        if (checkString(data.item.userName)) {
                          data.flag = true;
                          data.error.userName =
                            'Tên không gồm các ký tự đặc biệt';
                        }
                      }
                    "
                    @input="
                      () => {
                        data.flag = false;
                        data.error.userName = '';
                      }
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
                  for="inputBirthday"
                  class="col-sm-4 m-0 px-0 col-form-label"
                  >Ngày sinh:</label
                >
                <div class="col-sm-8 p-0 m-0">
                  <input
                    type="date"
                    class="form-control"
                    id="inputBirthday"
                    v-model="data.item.birthday"
                    @input="
                      () => {
                        data.flag = false;
                        data.error.birthday = '';
                      }
                    "
                  />
                  <div v-if="data.error.birthday" class="invalid-error">
                    {{ data.error.birthday }}
                  </div>
                </div>
              </div>
              <fieldset class="form-group row mt-4 mb-4">
                <legend
                  class="col-form-label col-sm-3 p-0 m-0 float-sm-left pt-0"
                >
                  Giới tính:
                </legend>
                <div class="col-sm-8 ml-4">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      v-model="data.item.sex"
                      id="gridRadios1"
                      value="false"
                      checked
                    />
                    <label class="form-check-label mr-5" for="gridRadios1">
                      Nam
                    </label>

                    <input
                      class="form-check-input"
                      type="radio"
                      v-model="data.item.sex"
                      id="gridRadios2"
                      value="true"
                    />
                    <label class="form-check-label" for="gridRadios2">
                      Nữ
                    </label>
                  </div>
                </div>
              </fieldset>
              <div class="form-group row">
                <label for="inputPhone" class="col-sm-4 m-0 px-0 col-form-label"
                  >SĐT:</label
                >
                <div class="col-sm-8 p-0 m-0">
                  <input
                    type="tel"
                    class="form-control"
                    id="inputPhone"
                    @blur="
                      () => {
                        if (checkPhone(data.item.phone)) {
                          data.flag = true;
                          data.error.phone = 'SĐT gồm có 10 số.';
                        }
                      }
                    "
                    @input="
                      () => {
                        data.flag = false;
                        data.error.phone = '';
                      }
                    "
                    v-model="data.item.phone"
                  />
                  <div v-if="data.error.phone" class="invalid-error">
                    {{ data.error.phone }}
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputEmail" class="col-sm-4 col-form-label p-0"
                  >Email:</label
                >
                <div class="col-sm-8 p-0 m-0">
                  <input
                    type="text"
                    class="form-control"
                    id="inputEmail"
                    @blur="
                      () => {
                        if (checkMail(data.item.email)) {
                          data.flag = true;
                          data.error.email = 'Email sai định dạng.';
                        }
                      }
                    "
                    @input="
                      () => {
                        data.flag = false;
                        data.error.email = '';
                      }
                    "
                    v-model="data.item.email"
                  />
                  <div v-if="data.error.email" class="invalid-error">
                    {{ data.error.email }}
                  </div>
                </div>
              </div>
              <!-- Biển số xe -->
              <div class="form-group row">
                <label
                  for="inputNumberPlate"
                  class="col-sm-4 col-form-label p-0"
                  >Biến số xe:</label
                >
                <div class="col-sm-8 p-0 m-0">
                  <input
                    type="text"
                    class="form-control"
                    id="inputNumberPlate"
                    v-model="data.item.numberPlate"
                  />
                </div>
              </div>
            </form>

            <!-- form 2 -->
            <form class="col pl-4 ml-1">
              <!-- cccd -->
              <div class="form-group row">
                <label
                  for="inputidentificationCard"
                  class="col-sm-4 col-form-label p-0"
                  >CCCD:</label
                >
                <div class="col-sm-8 p-0 m-0">
                  <input
                    type="text"
                    class="form-control"
                    id="inputidentificationCard"
                    @blur="
                      () => {
                        if (checkIdentification(data.item.identification)) {
                          data.flag = true;
                          data.error.identification = 'CCCD sai định dạng.';
                        }
                      }
                    "
                    @input="
                      () => {
                        data.flag = false;
                        data.error.identification = '';
                      }
                    "
                    v-model="data.item.identification"
                  />
                  <div v-if="data.error.identification" class="invalid-error">
                    {{ data.error.identification }}
                  </div>
                </div>
              </div>
              <!-- 3 cấp -->
              <div class="form-group row">
                <label for="inputrules" class="col-sm-4 col-form-label p-0"
                  >Thành phố:</label
                >
                <!-- City -->
                <div class="col-sm-8 p-0 m-0">
                  <Select
                    :title="`Chọn thành phố`"
                    :data="data.city.data"
                    :codeProps="data.levels.city"
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
                <label
                  for="inputrules"
                  class="col-sm-4 col-form-label p-0"
                  style="font-size: 0.98rem"
                  >Quận huyện:</label
                >
                <div class="col-sm-8 p-0">
                  <Select
                    :title="`Chọn quận huyện`"
                    :data="data.district.data.districts"
                    :codeProps="data.levels.district"
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
                <label for="inputrules" class="col-sm-4 col-form-label p-0"
                  >Phường xã:</label
                >
                <div class="col-sm-8 p-0">
                  <Select
                    :title="`Chọn phường xã`"
                    :data="data.ward.data.wards"
                    :codeProps="data.levels.ward"
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
              <!-- địa chỉ -->
              <div class="form-group row">
                <label for="inputAddress" class="col-sm-4 col-form-label p-0"
                  >Địa chỉ:</label
                >
                <div class="col-sm-8 p-0 m-0">
                  <input
                    type="text"
                    class="form-control"
                    id="inputAddress"
                    @blur="
                      () => {
                        if (checkAddress(data.item.number)) {
                          data.flag = true;
                          data.error.number = 'không chứa ký tự đặc biệt.';
                        }
                      }
                    "
                    @input="
                      () => {
                        data.flag = false;
                        data.error.number = '';
                      }
                    "
                    v-model="data.item.number"
                  />
                  <div v-if="data.error.number" class="invalid-error">
                    {{ data.error.number }}
                  </div>
                </div>
              </div>
            </form>
            <!-- Ảnh cccd -->
            <div class="form-group row col-12 p-0 m-0">
              <label for="" class="col-sm-2 col-form-label p-0"
                >Ảnh CCCD:</label
              >
              <div class="col-sm-10 p-0 m-0 mb-2 border rounded">
                <input
                  type="file"
                  ref="files"
                  multiple
                  class="form-control"
                  id="inputImage"
                  @change="handleFileUpload($event)"
                  @input="
                    () => {
                      data.flag = false;
                      data.error.image = '';
                    }
                  "
                  style="border: none"
                />
                <div v-if="data.error.image" class="invalid-error">
                  {{ data.error.image }}
                </div>
                <div id="previewImages"></div>
              </div>
              <!-- <div class="row ml-5"> -->

              <div
                class="imagesDiv pl-5"
                id="imagePrevious"
                style="margin-left: 78px"
              >
                <img
                  class="images ml-5"
                  style="width: 200px; object-fit: contain"
                  :src="`http://localhost:3000/api/users/getImg/${data.item.imagePrevious}`"
                />
                <span class="delete-icon" @click="handleDeleteImagePrevious"
                  >x</span
                >
              </div>
              <div class="imagesDiv pl-5" id="imageAfter">
                <img
                  class="images ml-5 pl-5"
                  style="width: 200px; object-fit: contain"
                  :src="`http://localhost:3000/api/users/getImg/${data.item.imageAfter}`"
                />
                <span class="delete-icon" @click="handleDeleteImageAfter"
                  >x</span
                >
              </div>
            </div>
            <!-- </div> -->

            <div class="form-group mt-2 col-2 text-center">
              <button
                type="submit"
                class="btn btn-login"
                :disabled="data.btnSubmit == 'Đang lưu'"
              >
                {{ data.btnSubmit }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-content {
  width: 160%;
  margin-left: -16%;
}

.imagesDiv,
.imageAfter {
  position: relative;
  display: inline;
}

.delete-icon {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  opacity: 1;
  color: var(--red);
  background-color: #f6f1f1;

  border-radius: 50%;
  line-height: 1;
  text-align: center;
}
.delete-icon:hover {
  color: red;
  font-size: 1.1rem;
  border-radius: 50%;

  background-color: var(--gray);
}
</style>
