<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";

//service
import boardinghouseService from "../../../service/boardinghouse.service";
import roomService from "../../../service/room.service";
import mediaService from "../../../service/media.service";
import amenitieService from "../../../service/amenitie.service";

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
        long: "",
        wide: "",
        content: "",
        boardingId: "",
        status: "",
        countFiles: 0,
        medias: [],
      },
      error: {
        name: "",
        price: "",
        long: "",
        wide: "",
        boardingId: "",
      },
      medias: [],
      uploadFiles: [],
      files: [],
      flag: false,
      boarding: {},
      removeMedia: [],
      mediasCopy: [],
      categories: [
        { name: "Phòng trọ", icon: "house", active: "room" },
        { name: "Tiện ích", icon: "chalet", active: "chalet" },
        // {
        //   name: "Hình ảnh ",
        //   icon: "image",
        //   active: "image",
        // },
      ],
      active: "room",
      amenitie: [{ name: "" }],
      addAmenitie: [],
      checkList: [], // ds check hiện tại
      checkedList: [], //danh sách check ban đầu
      removeList: [], //ds loại bỏ là ds không tồn tại trong ds hiện tại nhưng tồn tại trong ds ban đầu
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
      // data.uploadFiles = [];
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
        return `Max size: ${MAX_SIZE / 1000}kb `;
      }
      return "";
    };
    const formFields = [
      "boardingId",
      "name",
      "price",
      "long",
      "wide",
      "content",
      "status",
    ];
    const save = async () => {
      try {
        for (const key in data.error) {
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
          // Tiện ích
          const checkboxes = document.querySelectorAll(
            'input[type="checkbox"]'
          );
          for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
              data.checkList.push(checkboxes[i].value);
            }
          }

          // Tiện ích bị loại bỏ
          //124 hiện tại
          //123 quá khứ
          //123-124=3 quá khư-hiện tại
          //124-12 =4
          data.removeList = data.checkedList.filter(
            (item) => !data.checkList.includes(item)
          );
          console.log("remove list:", data.removeList);
          _.forEach(data.removeList, (value) => {
            formData.append("removeAmenitie", value);
          });
          //
          data.checkList = data.checkList.filter(
            (item) => !data.checkedList.includes(item)
          );
          console.log("check new list", data.checkList);
          _.forEach(data.checkList, (check) => {
            formData.append("amenitie", check);
          });
          const documentRoom = await roomService.update(props._id, formData);
          console.log(documentRoom);
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
            data.checkList = [];
            data.checkedList = [];
            await refresh();
          } else {
            warning("Thất bại", "Bạn không có quyền chỉnh sửa phòng trọ.");
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
    const handleCheck = (event) => {
      try {
        // chia gioa diện thành 3 phần 1. thông tin cơ bản, 2 . tiện ích mô tả, 3. hin a hr
        if (event.target.checked == true && event.target.value == "other") {
          console.log("khác");
          data.addAmenitie.push({ name: "" });
          return;
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
    const handleAddAmenitie = async (value) => {
      try {
        console.log("Thêm tiện ích", value);
        const document = await amenitieService.create({
          name: value,
        });
        const documentAmenitie = await amenitieService.getAll();
        data.amenitie = documentAmenitie.message;
        data.amenitie.push({ _id: "other", name: "Khác" });
        // loại bỏ cái vừa thêm ra khỏi danh sách thêm mới
        data.addAmenitie = data.addAmenitie.filter(
          (item) => item.name != value
        );
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
      try {
        //get all boarding house
        const documentRoom = await roomService.get(props._id);
        data.item = documentRoom.message;

        const documentBoarding = await boardinghouseService.getAllUser();
        data.boarding = documentBoarding.message;
        // media
        const documentMedia = await mediaService.get(props._id);
        data.medias = documentMedia.message;
        data.mediasCopy = data.medias;
        data.removeMedia = []; // init remove medias list

        // ame
        const documentAmenitie = await amenitieService.getAll();
        data.amenitie = documentAmenitie.message;
        data.amenitie.push({ _id: "other", name: "Khác" });

        //
        filesRef.value = document.getElementById("inputImage"); //Get input
        const amenitieArray = data.item.Amenities.map((item) => {
          return {
            _id: item._id,
          };
        });
        data.amenitie = data.amenitie.map((item) => {
          return {
            ...item,
            checked: amenitieArray.some((value) => value._id == item._id),
          };
        });
        // danh sách đã chọn ban đầu
        data.checkedList = data.amenitie.filter((item) => {
          return item.checked == true;
        });
        data.checkedList = data.checkedList.map((item) => {
          return item._id;
        });
        console.log("Ban đầu:", data.checkedList);
      } catch (error) {}
    };
    onMounted(async () => {
      await refresh();
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
      handleAddAmenitie,
      handleCheck,
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
            <div class="form-group row">
              <ul class="col-sm-2 p-0" style="margin-top: -3%">
                <li
                  v-for="(value, index) in data.categories"
                  :key="index"
                  @click="data.active = value.active"
                >
                  <div class="row ml-2 my-3 list">
                    <span class="material-symbols-outlined mr-2 py-1 icon">
                      {{ value.icon }}
                    </span>
                    <span
                      class="mr-2 py-2 name"
                      :class="value.active == data.active ? 'isActive' : ''"
                    >
                      {{ value.name }}</span
                    >
                  </div>
                </li>
              </ul>
              <div class="col-sm-10">
                <!-- nhà trọ -->
                <div v-if="data.active == 'room'">
                  <div class="form-group row">
                    <label for="inputname" class="col-sm-2 col-form-label p-0"
                      >Nhà trọ :
                    </label>
                    <div class="col-sm-10">
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
                    <label for="inputroom" class="col-sm-2 col-form-label p-0"
                      >Tên phòng trọ :</label
                    >
                    <div class="col-sm-10">
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
                    <label for="inputprice" class="col-sm-2 col-form-label p-0"
                      >Giá phòng :</label
                    >
                    <div class="col-sm-10">
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
                    <label for="inputlong" class="col-sm-2 col-form-label p-0"
                      >Chiều dài :</label
                    >
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="inputlong"
                        @blur="
                          () => {
                            let isCheck = checkNumber(data.item.long);
                            if (isCheck) {
                              data.error.long = 'Chiều dài phòng là số';
                              data.flag = true;
                            }
                          }
                        "
                        @input="
                          data.error.long = '';
                          data.flag = false;
                        "
                        v-model="data.item.long"
                      />
                      <div v-if="data.error.long" class="invalid-error">
                        {{ data.error.long }}
                      </div>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputwide" class="col-sm-2 col-form-label p-0"
                      >Chiều dài :</label
                    >
                    <div class="col-sm-10">
                      <input
                        type="text"
                        class="form-control"
                        id="inputwide"
                        @blur="
                          () => {
                            let isCheck = checkNumber(data.item.wide);
                            if (isCheck) {
                              data.error.wide = 'Chiều rộng phòng là số';
                              data.flag = true;
                            }
                          }
                        "
                        @input="
                          data.error.wide = '';
                          data.flag = false;
                        "
                        v-model="data.item.wide"
                      />
                      <div v-if="data.error.wide" class="invalid-error">
                        {{ data.error.wide }}
                      </div>
                    </div>
                  </div>

                  <div class="form-group row">
                    <label
                      for="inputContent"
                      class="col-sm-2 col-form-label p-0"
                      >Mô tả thêm :</label
                    >
                    <div class="col-sm-10">
                      <textarea
                        type="text"
                        class="form-control"
                        id="inputContent"
                        rows="5"
                        v-model="data.item.content"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <!-- Tiện ích -->
                <div v-if="data.active == 'chalet'">
                  <!-- Tiện ích -->
                  <div class="form-group row justify-content-around mb-0">
                    <label class="col-sm-2 col-form-label p-0"
                      >Tiện ích :</label
                    >
                    <div class="col-sm-10 row">
                      <div
                        class="div col-4"
                        v-for="(value, index) in data.amenitie"
                        :key="index"
                      >
                        <input
                          type="checkbox"
                          @change="handleCheck"
                          :value="value._id"
                          :checked="value.checked"
                        />
                        {{ value.name }}
                      </div>
                    </div>
                  </div>

                  <div
                    class="form-group row justify-content-around mb-0"
                    v-for="(value, index) in data.addAmenitie"
                    :key="index"
                  >
                    <label
                      for="inputAmenitie"
                      class="col-sm-2 col-form-label p-0"
                      >Tên tiện ích :</label
                    >
                    <div class="col-sm-10 row m-0 mb-1">
                      <input
                        type="text"
                        id="inputAmenitie"
                        v-model="value.name"
                        class="form-control col-11"
                        style="
                          border-right: 0px;
                          border-top-right-radius: 0;
                          border-bottom-right-radius: 0;
                        "
                      />

                      <span
                        class="material-symbols-outlined text-success col-sm-1 border py-1"
                        @click="handleAddAmenitie(value.name)"
                        style="
                          border-radius: 4px;
                          border-top-left-radius: 0;
                          border-bottom-left-radius: 0;
                          padding-left: 10px;
                        "
                      >
                        save
                      </span>
                    </div>
                  </div>
                  <!-- Image -->
                  <div class="form-group row">
                    <label
                      for="inputImagePrevious"
                      class="col-sm-2 col-form-label p-0"
                      >Ảnh phòng trọ :</label
                    >
                    <div class="col-sm-10">
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
                </div>
                <!--   v-if="data.active == 'chalet'" -->
                <div
                  class="form-group row justify-content-around mt-3 mb-0"
                  v-if="data.active == 'chalet'"
                >
                  <button type="submit" class="btn btn-login col-warning sm-3">
                    Cập nhật
                  </button>
                </div>
              </div>
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

ul {
  list-style: none;
}
li {
  display: block;
}
.list {
  text-align: center;
  line-height: 1;
}
.icon {
  background-color: #7367f0;
  color: var(--beige);
  border-radius: 6px;
  width: 18%;
  text-align: center;
}
.list:hover > .name,
.isActive {
  color: #5243f6;
  font-weight: 500;
}
</style>
