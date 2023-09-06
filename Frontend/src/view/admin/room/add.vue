<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";

//service
import boardinghouseService from "../../../service/boardinghouse.service";
import roomService from "../../../service/room.service";
//component
import Select from "../../../components/select/select.vue";
//js
import {
  checkStringAndNumber,
  checkAddress,
  checkNumber,
} from "../../../assets/js/checkInput.common";
import { successAd, warning } from "../../../assets/js/common.alert";
export default {
  components: { Select },
  props: { boarding: [] },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        name: "",
        price: "",
        area: "",
        boardingId: "",
        cycleId: null,
        countFiles: 0,
      },
      error: {
        name: "",
        price: "",
        area: "",
        boardingId: "",
      },
      uploadFiles: [],
      files: [],
      flag: true,
      boarding: {},
    });
    const isModalOpen = ref(false);
    const filesRef = ref(null);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal room");
    };
    const closeModal = () => {
      console.log("close modal room");
      filesRef.value.value = "";
      emit("closeModal");
    };

    const refresh = () => {
      data.item = {
        name: "",
        price: "",
        area: "",
        boardingId: "",
        // cycleId: null,
        countFiles: 0,
      };
      data.error = {
        name: "",
        price: "",
        area: "",
        boardingId: "",
      };
      data.flag = true;
      const previewImage = document.getElementById("previewImages");
      previewImage.innerHTML = "";
      data.files = [];
      filesRef.value = document.getElementById("inputImage"); //Get input

      filesRef.value.value = "";
      data.uploadFiles = [];
    };
    const handleFileUpload = (event) => {
      data.uploadFiles = [];
      const files = event.target.files;
      data.uploadFiles = [...data.uploadFiles, ...files];
      const previewImage = document.getElementById("previewImages");
      previewImage.innerHTML = "";
      const rowImages = document.createElement("div");
      rowImages.classList.add("row");
      rowImages.style.position = "relative";
      for (const file of data.uploadFiles) {
        const reader = new FileReader();
        let invalidMessage = validate(file);
        if (invalidMessage == "") {
          reader.onload = function (e) {
            const colImage = document.createElement("div");
            colImage.classList.add("justify-content-between");
            colImage.classList.add("col-6");
            colImage.id = file.name;
            const img = document.createElement("img");

            img.src = e.target.result;
            img.style.maxWidth = "100%";
            img.style.maxHeight = "100%";
            img.style.objectFit = "contain";
            const deleteicon = document.createElement("span");
            deleteicon.textContent = "x";
            deleteicon.classList.add("delete-icon-add");
            deleteicon.addEventListener("click", () => {
              alert(`xóa ${file.name} `);
              data.uploadFiles = data.uploadFiles.filter(
                (item) => item != file
              );
              const imgRemove = document.getElementById(file.name);
              imgRemove.remove();
            });
            const br = document.createElement("br");
            colImage.appendChild(img);
            colImage.appendChild(br);

            const span = document.createElement("span");
            span.textContent = `${file.name}`;
            colImage.appendChild(deleteicon);
            colImage.appendChild(span);

            rowImages.appendChild(colImage);
            previewImage.appendChild(rowImages);
          };
          reader.readAsDataURL(file);
        } else {
          const colImage = document.createElement("div");
          colImage.classList.add("col-6");
          const span = document.createElement("span");
          span.textContent = `${file.name}`;
          span.style.color = "red";
          colImage.appendChild(span);

          rowImages.appendChild(colImage);
          previewImage.appendChild(rowImages);
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
    const validate = (file) => {
      const MAX_SIZE = 200000;
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
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
        return `Max size: ${MAX_SIZE / 1000}kb `;
      }
      return "";
    };
    const formFields = [
      "name",
      "price",
      "area",
      "boardingId",
      "cycleId",
      "countFiles",
    ];
    const save = async () => {
      try {
        for (const key in data.error) {
          console.log("key", key, data.item[key]);
          if (data.item[key] == "") {
            data.error[key] = "Chưa nhập thông tin.";
            data.flag = true;
            console.log("1", key);
          }
        }

        if (!data.flag) {
          data.item["countFiles"] = data.uploadFiles.length;

          const formData = new FormData();
          if (data.item.countFiles > 0) {
            _.forEach(data.uploadFiles, (file) => {
              if (validate(file) === "") {
                formData.append("files", file);
              }
            });
          }
          _.forEach(formFields, (field) => {
            formData.append(field, data.item[field]);
          });

          const documentRoom = await roomService.create(formData);
          if (documentRoom["status"] == "success") {
            successAd(`Đã thêm phòng trọ ${documentRoom.message["name"]}`);
            emit("add");
            refresh();
          } else {
            warning("Thất bại", "Bạn không có quyền thêm phòng trọ.");
          }
        }
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

    onBeforeMount(async () => {
      console.log("1");
      filesRef.value = document.getElementById("inputImage"); //Get input
      $("#roomModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#roomModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      save,
      checkStringAndNumber,
      checkAddress,
      checkNumber,
      handleFileUpload,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="roomModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Thêm phòng trọ
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
        <div class="modal-body">
          <form
            @submit.prevent="save"
            enctype="multipart/form-data"
            class="container mt-3"
          >
            <!-- nhà trọ -->
            <div class="form-group row">
              <label for="inputname" class="col-sm-3 col-form-label p-0"
                >Nhà trọ :</label
              >
              <div class="col-sm-9">
                <Select
                  :title="'Chọn nhà trọ'"
                  :data="boarding"
                  :selected="data.item.boardingId"
                  @choose="(value) => (data.item.boardingId = value)"
                ></Select>
              </div>
            </div>

            <!--  -->
            <div class="form-group row">
              <label for="inputroom" class="col-sm-3 col-form-label p-0"
                >Tên phòng trọ :</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputroom"
                  @blur="
                    () => {
                      let isCheck = checkNumber(data.item.name);
                      if (isCheck) {
                        data.error.name = 'Tên nhà trọ là số.';
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
              <label for="inputprice" class="col-sm-3 col-form-label p-0"
                >Giá phòng :</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputprice"
                  @blur="
                    () => {
                      let isCheck = checkNumber(data.item.price);
                      if (isCheck) {
                        data.error.price = 'Giá phòng là số';
                        data.flag = true;
                      }
                    }
                  "
                  @input="
                    data.error.price = '';
                    data.flag = false;
                  "
                  v-model="data.item.price"
                />
                <div v-if="data.error.price" class="invalid-error">
                  {{ data.error.price }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputarea" class="col-sm-3 col-form-label p-0"
                >Diện tích :</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputarea"
                  @blur="
                    () => {
                      let isCheck = checkNumber(data.item.area);
                      if (isCheck) {
                        data.error.area = 'Diện tích phòng là số';
                        data.flag = true;
                      }
                    }
                  "
                  @input="
                    data.error.area = '';
                    data.flag = false;
                  "
                  v-model="data.item.area"
                />
                <div v-if="data.error.area" class="invalid-error">
                  {{ data.error.area }}
                </div>
              </div>
            </div>
            <!-- Image -->
            <div class="form-group row">
              <label for="inputImage" class="col-sm-3 col-form-label p-0"
                >Ảnh phòng trọ :</label
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
                <!-- <div v-if="data.error.image" class="invalid-error">
                  {{ data.error.image }}
                </div> -->
              </div>
              <div id="previewImages" class="container mt-2"></div>
            </div>
            <div class="form-group row justify-content-around mb-0">
              <button type="submit" class="btn btn-login col-sm-3">Thêm</button>
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
</style>
