<script>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import _ from "lodash";
//service
import Login from "../../service/login.service";
import userService from "../../service/user.service";
import { checkCookieExistence } from "../../assets/js/common.login";
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
      files: [],
      uploadFiles: [],
      message: "",
    });
    const filesRef = ref(null);
    // Khi chọn file
    const handleFileUpload = (event) => {
      const files = event.target.files;
      data.uploadFiles = [...data.uploadFiles, ...files];
      data.files = [
        ...data.files,
        ..._.map(files, (file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          invalidMessage: validate(file),
        })),
      ];
    };
    //Kiểm tra loại file và kích thước file
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
    const save = async () => {
      const formData = new FormData();
      const formFields = [
        "userName",
        "identification",
        "phone",
        "address",
        "email",
        "start",
        "end",
      ];
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
        await axios.post(`http://localhost:3000/api/users/multiple`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        data.message = "Files has been uploaded";
        //Đặt lại giá trị ban đầu
        data.files = [];
        filesRef.value.value = "";
        data.uploadFiles = [];
        _.forEach(formFields, (field) => {
          data.item[field] = "";
        });
      } catch (err) {
        data.message = err;
      }
    };
    onMounted(() => {
      //lấy thẻ input có id là inputImage
      filesRef.value = document.getElementById("inputImage");
    });

    return {
      data,

      handleFileUpload,
      save,

      //
    };
  },
};
</script>
<template>
  <div class="login container-fluid">
    <div class="row justify-content-around align-items-center vh-100">
      <div class="card shadow col-4">
        <div class="row justify-content-center">
          <router-link :to="{ name: 'User' }" class="col-3">
            <img
              src="../../assets/image/logo.PNG"
              style="width: 100%; height: 100%"
            />
          </router-link>
          <h4 class="text-center mt-3 ml-3 col-12">Đăng ký</h4>
        </div>
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
                v-model="data.item.userName"
              />
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
                v-model="data.item.identificationCard"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="inputImagePrevious" class="col-sm-3 col-form-label p-0"
              >Ảnh CCCD :</label
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
            <div
              v-for="(file, index) in data.files"
              :key="index"
              :class="`level ${file.invalidMessage && 'has-text-danger'}`"
            >
              <div class="level-left">
                <div class="level-item">
                  {{ file.name }}
                  <span v-if="file.invalidMessage">
                    &nbsp; - {{ file.invalidMessage }}</span
                  >
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <a
                    class="material-symbols-outlined"
                    @click.prevent="
                      data.files.splice(index, 1);
                      data.uploadFiles.splice(index, 1);
                    "
                  >
                    delete
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group row">
            <label for="inputaddress" class="col-sm-3 col-form-label p-0"
              >Địa chỉ :</label
            >
            <div class="col-sm-9">
              <input
                type="text"
                class="form-control"
                id="inputaddress"
                v-model="data.item.address"
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
            <label for="inputEmail" class="col-sm-3 col-form-label p-0"
              >Email :</label
            >
            <div class="col-sm-9">
              <input
                type="text"
                class="form-control"
                id="inputEmail"
                v-model="data.item.email"
              />
            </div>
          </div>
          <div class="form-group row">
            <label for="inputContent" class="col-sm-3 col-form-label p-0"
              >Nội dung yêu cầu :</label
            >
            <div class="col-sm-9">
              <input
                type="date"
                class="form-control"
                id="inputContent"
                v-model="data.item.start"
              />
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
</template>
<style></style>
