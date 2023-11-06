<script>
import { reactive, ref, onBeforeMount } from "vue";
import axios from "axios";
import _ from "lodash";

//service
import boardinghouseService from "../../../service/boardinghouse.service";
import roomService from "../../../service/room.service";

//component
import Select from "../../../components/select/selectdependent.vue";

//js
import {
  checkStringAndNumber,
  checkAddress,
} from "../../../assets/js/checkInput.common";
import { successAd, warning, deleted } from "../../../assets/js/common.alert";
import { city, district, ward } from "../../../assets/js/dependent.common";
export default {
  components: { Select },
  props: {
    // dataProps: {},
    boardingId: "",
  },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        name: "",
        phone: "",
        address: "",
        rules: "",
        isDelete: false,
        city: { code: "", name: "" },
        district: { code: "", name: "" },
        ward: { code: "", name: "" },
        number: "",
        countFiles: 0,
      },
      levels: {
        city: { code: "", name: "" },
        district: { code: "", name: "" },
        ward: { code: "", name: "" },
      },
      error: { name: "", number: "", phone: "" },
      flag: true,
      city: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
      media: [],
      removeMedia: [],
      mediasCopy: [],
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
    const refresh = async () => {
      try {
        const documentBoarding = await boardinghouseService.get(
          props.boardingId
        );

        data.item = documentBoarding.message;
        if (data.item) {
          const address = data.item.address.split(" - ");
          //number
          data.item.number = address[0];
          //city
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
          //district
          const document = await city(data.levels.city.code);
          data.levels.district = document.district;
          data.district = document.district;
          data.levels.district = data.levels.district.data.districts.filter(
            (item) => item.name == address[2]
          );
          data.levels.district = data.levels.district[0];
          data.item.district = data.levels.district;

          //ward
          const ward = await axios.get(
            `https://provinces.open-api.vn/api/d/${data.levels.district.code}?depth=2`,
            {}
          );
          data.levels.ward = ward;
          data.ward = ward;
          data.levels.ward = ward.data.wards.filter(
            (item) => item.name == address[1]
          );
          data.levels.ward = data.levels.ward[0];
          data.item.ward = data.levels.ward;
        }
        data.media = data.item.Media;
        data.mediasCopy = data.media;
        data.removeMedia = []; // init remove medias list
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
    const save = async () => {
      try {
        data.item.address = `${data.item.number} - ${data.item.ward.name} - ${data.item.district.name} - ${data.item.city.name}`;
        data.item.countFiles = data.uploadFiles.length;
        const formData = new FormData();
        _.forEach(formFields, (field) => {
          formData.append(field, data.item[field]);
        });
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
        const documentUpdate = await boardinghouseService.update(
          props.boardingId,
          formData
        );
        if (documentUpdate["status"] == "success") {
          successAd(`Đã cập nhật nhà trọ `);
          await refresh();
          emit("edit");
          const previewImage = document.getElementById("previewImagesEdit");
          previewImage.innerHTML = "";

          data.files = [];
          data.uploadFiles = [];
          filesRef.value = document.getElementById("inputImage"); //Get input
          filesRef.value.value = "";
          data.removeMedia = [];
        } else {
          warning("Thất bại", "Bạn không có quyền chỉnh sửa nhà trọ.");
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
    const handleDeleteMedia = (value) => {
      try {
        data.mediasCopy = data.mediasCopy.filter(
          (item) => item["name"] != value
        );
        data.removeMedia.push(value);
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
    const handleDelete = async () => {
      try {
        const rooms = await roomService.getAllRoom(props.boardingId);

        data.flag = false;
        for (let value of rooms.message) {
          if (value.status == true) {
            warning("Cảnh báo", `Phòng trọ vẫn còn khách trọ`);
            data.flag = true;
            break;
          }
        }
        if (data.flag) return;
        const isDelete = await deleted(
          `Xóa nhà trọ ${data.item.name}`,
          `Bạn sẽ xóa tất cả phòng trọ thuộc nhà trọ ${data.item.name}`
        );
        if (isDelete) {
          const document = await boardinghouseService.delete(props.boardingId);
          document.status == "success"
            ? successAd(`Xóa thành công nhà trọ ${data.item.name} `)
            : warning("Xóa thất bại", `Xóa thất bại nhà trọ ${data.item.name}`);
          data.item = {
            name: "",
            phone: "",
            address: "",
            rules: "",
            isDelete: false,
            city: { code: "", name: "" },
            district: { code: "", name: "" },
            ward: { code: "", name: "" },
            number: "",
          };
          // data.levels.city = "";
          // data.levels.district = "";
          // data.levels.ward = "";
          emit("edit");
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
    const formFields = ["name", "phone", "address", "countFiles"];
    onBeforeMount(async () => {
      await refresh();
      filesRef.value = document.getElementById("inputImage"); //Get input
      $("#editBoardingModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#editBoardingModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      save,
      handleDelete,
      checkStringAndNumber,
      checkAddress,
      // 3 cấp
      change,
      changeDistrict,
      changeWard,
      handleDeleteMedia,
      handleFileUpload,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="editBoardingModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Thông tin nhà trọ
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
        <!--   @submit.prevent="save" -->
        <div class="modal-body">
          <form enctype="multipart/form-data" class="container mt-3">
            <div class="form-group row">
              <label for="inputname" class="col-sm-3 col-form-label p-0"
                >Tên nhà trọ :</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputname"
                  v-model="data.item.name"
                />
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
                  v-model="data.item.phone"
                />
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
                  :codeProps="data.levels.city"
                  @choose="(value) => change(value)"
                ></Select>
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
                  :codeProps="data.levels.district"
                  @choose="(value) => changeDistrict(value)"
                ></Select>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputrules" class="col-sm-3 col-form-label p-0"
                >Quận huyện :</label
              >
              <div class="col-sm-9">
                <Select
                  :title="`Chọn phường xã`"
                  :data="data.ward.data.wards"
                  :codeProps="data.levels.ward"
                  @choose="(value) => changeWard(value)"
                ></Select>
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
                  v-model="data.item.number"
                ></textarea>
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
            <div class="form-group row justify-content-start mb-0">
              <div class="col-sm-3"></div>
              <button
                type="submit"
                class="btn btn-warning text-light col-sm-3 mx-3 title"
                @click.prevent="save"
              >
                Cập nhật
              </button>
              <button
                type="submit"
                class="btn btn-danger col-sm-2 title text-light"
                @click.prevent="handleDelete"
              >
                xóa
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
