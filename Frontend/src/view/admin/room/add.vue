<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";
import Swal from "sweetalert2";
//service
import boardinghouseService from "../../../service/boardinghouse.service";
import roomService from "../../../service/room.service";
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
  props: { boarding: { type: Array, default: [] } },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        name: "",
        price: "",
        wide: "",
        long: "",
        boardingId: "",
        isDelete: false,
        status: false,
        countFiles: 0,
      },
      amenitie: [{ name: "" }],
      addAmenitie: [],
      error: {
        name: "",
        price: "",
        wide: "",
        long: "",
        boardingId: "",
      },
      uploadFiles: [],
      files: [],
      flag: true,
      boarding: {},
      checkList: [],
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
    });
    const isModalOpen = ref(false);
    const filesRef = ref(null);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal add room");
    };
    const closeModal = () => {
      console.log("close modal add room");
      filesRef.value.value = "";
      emit("closeModal");
    };

    const refresh = () => {
      data.item = {
        name: "",
        price: "",
        wide: "",
        long: "",
        content: "",
        isDelete: false,
        boardingId: "",
        countFiles: 0,
      };
      data.error = {
        name: "",
        price: "",
        wide: "",
        long: "",
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
    const formFields = [
      "name",
      "price",
      "wide",
      "long",
      "content",
      "isDelete",
      "boardingId",
      "status",
      "countFiles",
    ];
    const save = async () => {
      try {
        for (const key in data.error) {
          if (data.item[key] == "") {
            data.error[key] = "Chưa nhập thông tin.";
            data.flag = true;
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
          const checkboxes = document.querySelectorAll(
            'input[type="checkbox"]'
          );
          for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
              console.log(checkboxes[i]);
              data.checkList.push(checkboxes[i].value);
            }
          }
          console.log("check list", data.checkList);
          _.forEach(data.checkList, (check) => {
            formData.append("amenitie", check);
          });
          const documentRoom = await roomService.create(formData);
          console.log(documentRoom);
          if (documentRoom["status"] == "success") {
            successAd(`Đã thêm phòng trọ ${documentRoom.message["name"]}`);
            emit("add");
            data.checkList = [];
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
      filesRef.value = document.getElementById("inputImage"); //Get input
      $("#roomModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#roomModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
      console.log("Thêm nhà trọ", props.boarding);
      const documentAmenitie = await amenitieService.getAll();
      data.amenitie = documentAmenitie.message;
      data.amenitie.push({ _id: "other", name: "Khác" });
    });
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
    return {
      data,
      save,
      checkStringAndNumber,
      checkAddress,
      checkNumber,
      handleFileUpload,
      handleAddAmenitie,
      handleCheck,
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
            style="text-align: start"
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
              <!-- phòng trọ -->
              <div class="col-sm-10">
                <div v-if="data.active == 'room'">
                  <div class="form-group row">
                    <label
                      for="inputname"
                      class="col-sm-2 col-form-label p-0 m-0"
                    >
                      Nhà trọ :</label
                    >
                    <div class="col-sm-10">
                      <Select
                        :title="'Chọn nhà trọ'"
                        :data="boarding"
                        :selected="data.item.boardingId"
                        @choose="(value) => (data.item.boardingId = value)"
                        @input="
                          () => {
                            data.flag = false;
                            data.error.boardingId = '';
                          }
                        "
                      ></Select>
                      <div v-if="data.error.boardingId" class="invalid-error">
                        {{ data.error.boardingId }}
                      </div>
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
                      >Chiều rộng :</label
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
                              data.error.wide = 'chiều rộng phòng là số';
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
                  <!-- Image -->
                  <div class="form-group row">
                    <label for="inputImage" class="col-sm-2 col-form-label p-0"
                      >Ảnh phòng trọ :</label
                    >
                    <div class="col-sm-10">
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
                </div>

                <!-- Tiện ích -->
                <div v-if="data.active == 'chalet'">
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
                </div>
              </div>
            </div>
            <div
              class="form-group row justify-content-around mb-0"
              v-if="data.active == 'chalet'"
            >
              <button type="submit" class="btn btn-login col-sm-2 ml-5">
                Thêm
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
<!-- 

  -cập nhật phòng show ra ds tiện ích và cho chỉnh sửa
 
  -show nhà trọ cả đã thuê và chưa thuê

 -->
