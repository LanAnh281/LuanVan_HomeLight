<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";

//service
import boardinghouseService from "../../../service/boardinghouse.service";
import roomService from "../../../service/room.service";
import mediaService from "../../../service/media.service";
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
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        name: "",
        price: "",
        area: "",
        boardingId: "",
        cycleId: null,
        status: "",
        countFiles: 0,
        medias: [],
      },
      error: {
        name: "",
        price: "",
        area: "",
        boardingId: "",
      },
      medias: [],
      uploadFiles: [],
      files: [],
      flag: true,
      boarding: {},
      removeMedia: [],
      mediasCopy: [],
    });
    const isModalOpen = ref(false);
    const filesRef = ref(null);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal edit room");
    };
    const closeModal = () => {
      console.log("close modal edit room");
      // refresh();
      emit("closeModal");
    };

    const handleFileUpload = (event) => {
      data.uploadFiles = [];
      const files = event.target.files;
      data.uploadFiles = [...data.uploadFiles, ...files];
      const previewImage = document.getElementById("previewImagesEdit");
      previewImage.innerHTML = "";
      const rowImages = document.createElement("div");
      rowImages.classList.add("row");
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
              // alert(`xóa ${file.name} `);
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
    const formFields = ["name", "price", "area", "boardingId", "cycleId"];
    const save = async () => {
      try {
        for (const key in data.error) {
          console.log("key", key, data.item[key]);
          if (data.item[key] == "") {
            data.error[key] = "Chưa nhập thông tin.";
            data.flag = true;
            console.log("key:", key);
          }
        }
        if (!data.flag) {
          const formData = new FormData();
          _.forEach(formFields, (field) => {
            formData.append(field, data.item[field]);
          });
          formData.append("countFiles", data.uploadFiles.length);
          _.forEach(data.removeMedia, (media) => {
            if (media != "") {
              formData.append("removeMedia", media);
            }
          });
          formData.append("removeMedia", data.removeMedia);
          _.forEach(data.uploadFiles, (file) => {
            if (validate(file) === "") {
              formData.append("files", file);
            }
          });

          const documentRoom = await roomService.update(props._id, formData);

          if (documentRoom["status"] == "success") {
            successAd(`Đã chỉnh sửa phòng trọ `);
            emit("edit");
            const previewImage = document.getElementById("previewImagesEdit");
            previewImage.innerHTML = "";
            const documentMedia = await mediaService.get(props._id);
            data.mediasCopy = documentMedia.message;
            data.files = [];
            data.uploadFiles = [];
            filesRef.value = document.getElementById("inputImage"); //Get input
            filesRef.value.value = "";
            data.removeMedia = [];
          } else {
            console.log("Thất bại");
            warning("Thất bại", "Bạn không có quyền thêm phòng trọ.");
          }
        }
      } catch (error) {
        if (error) {
          warning("Thất bại", "Bạn không có quyền chỉnh sửa nhà trọ.");
        }
        console.log(error);
      }
    };
    const handleDeleteMedia = (value) => {
      data.mediasCopy = data.mediasCopy.filter((item) => item["name"] != value);
      data.removeMedia.push(value);
    };
    onMounted(async () => {
      //get all boarding house
      const documentRoom = await roomService.get(props._id);
      data.item = documentRoom.message;

      const documentBoarding = await boardinghouseService.getAllUser();
      data.boarding = documentBoarding.message;

      const documentMedia = await mediaService.get(props._id);
      data.medias = documentMedia.message;
      data.mediasCopy = data.medias;
      data.removeMedia = []; // init remove medias list

      filesRef.value = document.getElementById("inputImage"); //Get input

      $("#roomUpdateModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#roomUpdateModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      save,
      checkStringAndNumber,
      checkAddress,
      checkNumber,
      handleFileUpload,
      handleDeleteMedia,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="roomUpdateModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Cập nhật phòng trọ
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
                >Nhà trọ :
              </label>
              <div class="col-sm-9">
                <Select
                  :title="'Chọn nhà trọ'"
                  :data="data.boarding"
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
              <label
                for="inputImagePrevious"
                class="col-sm-3 col-form-label p-0"
                >Ảnh phòng trọ :</label
              >
              <div class="col-sm-9">
                <input
                  type="file"
                  ref="files"
                  multiple
                  @change="handleFileUpload($event)"
                  class="form-control"
                  id="inputImage"
                />
              </div>
              <div id="previewImagesEdit" class="container"></div>
              <div class="row">
                <div
                  v-show="data.mediasCopy"
                  class="mt-3 imagesDiv col-6"
                  v-for="(value, index) in data.mediasCopy"
                  :key="index"
                >
                  <img
                    class="images"
                    :src="`http://localhost:3000/static/images/${value.name}`"
                  />
                  <span
                    class="delete-icon"
                    @click="handleDeleteMedia(value.name)"
                    >x</span
                  >
                </div>
              </div>
            </div>
            <div class="form-group row justify-content-around mb-0">
              <button type="submit" class="btn btn-login col-warning sm-3">
                Cập nhật
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
.images {
  max-width: 100%;
  max-height: 70%px;
  object-fit: contain;
}
.imagesDiv {
  position: relative;
}
.delete-icon {
  position: absolute;
  top: -10px;
  right: -1px;
  opacity: 1;
  color: var(--red);
  line-height: 1;
  text-align: center;
}
.delete-icon:hover {
  color: red;
  font-size: 1.1rem;
  background-color: var(--gray);
}
</style>
