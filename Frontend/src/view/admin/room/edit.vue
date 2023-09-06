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
  props: { _id: "", dataProps: {}, medias: [], boarding: [] },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        name: "",
        price: "",
        area: "",
        boardingId: "",
        cycleId: null,
        countFiles: 0,
        medias: [],
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
      refresh();
      emit("closeModal");
    };

    const refresh = async () => {
      // const previewImage = document.getElementById("previewImagesEdit");
      // previewImage.innerHTML = "";
      data.mediasCopy = [];
      data.files = [];
      filesRef.value = document.getElementById("inputImage"); //Get input
      filesRef.value.value = "";
      data.uploadFiles = [];

      // const documentBoarding = await boardinghouseService.getAll();
      // data.boarding = documentBoarding.message;
      filesRef.value = document.getElementById("inputImage"); //Get input
      // const documentRoom = await roomService.get(props._id);
      // data.item = documentRoom.message;
      // const documentMedia = await mediaService.get(props._id);
      // data.item.medias = documentMedia.message;
      // data.mediasCopy = data.item.medias;
      data.removeMedia = [];
      data.itemcountFiles = 0;
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
            colImage.classList.add("col-6");

            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.width = "240px";
            img.style.height = "240px";
            img.style.objectFit = "contain";
            const br = document.createElement("br");
            colImage.appendChild(img);
            colImage.appendChild(br);

            const span = document.createElement("span");
            span.textContent = `${file.name}`;
            colImage.appendChild(span);

            rowImages.appendChild(colImage);
            previewImage.appendChild(rowImages);
          };
          reader.readAsDataURL(file);
          console.log("upload0");
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
        console.log("upload");
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
      console.log("save");
      try {
        // data.item["countFiles"] = data.uploadFiles.length;
        const formData = new FormData();
        _.forEach(formFields, (field) => {
          console.log(">>P", field, ":", props.dataProps[field]);
          formData.append(field, props.dataProps[field]);
        });
        formData.append("countFiles", data.uploadFiles.length);
        _.forEach(data.removeMedia, (media) => {
          console.log("media", media);
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

        console.log("data.otems:", formData, props.dataProps);
        const documentRoom = await roomService.update(
          props.dataProps._id,
          formData
        );

        console.log("doc", documentRoom);
        if (documentRoom["status"] == "success") {
          successAd(`Đã chỉnh sửa phòng trọ `);
          await refresh();
          emit("edit");
        } else {
          console.log("Thất bại");
          warning("Thất bại", "Bạn không có quyền thêm phòng trọ.");
        }
      } catch (error) {
        if (error) {
          warning("Thất bại", "Bạn không có quyền thêm nhà trọ.");
        }
        console.log(error);
      }
    };
    const handleDeleteMedia = (value) => {
      data.mediasCopy = props.medias.filter((item) => item["name"] != value);
      data.removeMedia.push(value);
      console.log(">>>>removeMedia:", data.removeMedia);
    };
    onMounted(async () => {
      console.log("1");
      const documentBoarding = await boardinghouseService.getAll();
      data.boarding = documentBoarding.message;
      filesRef.value = document.getElementById("inputImage"); //Get input

      data.mediasCopy = props.medias;
      console.log("copy media:", data.mediasCopy, props.medias);
      data.removeMedia = [];

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
                  :data="boarding"
                  :selected="dataProps.boardingId"
                  @choose="(value) => (dataProps.boardingId = value)"
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
                  v-model="dataProps.name"
                />
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
                  v-model="dataProps.price"
                />
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
                  v-model="dataProps.area"
                />
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
              <!-- {{ data.mediasCopy }} -->
              <div
                v-show="data.mediasCopy"
                class="mt-3 imagesDiv"
                v-for="(value, index) in data.mediasCopy"
                :key="index"
              >
                <img
                  class="images"
                  :src="`http://localhost:3000/static/images/${value.name}`"
                />
                <span class="delete-icon" @click="handleDeleteMedia(value.name)"
                  >x</span
                >
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
  max-width: 240px;
  max-height: 240px;
  object-fit: contain;
}
.imagesDiv {
  position: relative;
}
.delete-icon {
  position: absolute;
  top: -10px;
  right: -4px;
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
