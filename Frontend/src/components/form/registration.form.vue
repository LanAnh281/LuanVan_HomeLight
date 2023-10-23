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
import { success, warning, load } from "../../assets/js/common.alert";
import { city, district, ward } from "../../assets/js/dependent.common";
//componment
import Select from "../../components/select/selectdependent.vue";

export default {
  components: { Select },
  setup() {
    const router = useRouter();
    const data = reactive({
      item: {
        userName: "",
        // identification: "",
        phone: "",
        city: "",
        district: "",
        ward: "",
        number: "",
        address: "",
        email: "",
        start: "",
        end: "",
        clientId: "",
        secretId: "",
        isPay: false,
        files: [],
      },
      error: {
        userName: "",
        // identification: "",
        phone: "",
        number: "",
        email: "",
        image: "",
      },
      files: [],
      uploadFiles: [],
      message: "",
      //3 cấp
      city: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
      flag: true,
      submit: "Đăng ký",
    });
    // const isPay = ref(false);
    const isModalOpen = ref(false);
    const formFields = [
      "userName",
      "identification",
      "phone",
      "number",
      "city",
      "district",
      "ward",
      "address",
      "email",
      "start",
      "end",
      "clientId",
      "secretId",
      "isPay",
    ];
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
    const save = async () => {
      try {
        // console.log(data.item);
        for (const key in data.error) {
          if (data.item[key] == "") {
            data.error[key] = "Chưa nhập thông tin.";
            data.flag = true;
          }
        }
        if (!data.flag) {
          data.item.address = `${data.item.number} -  ${data.item.ward.name} - ${data.item.district.name} - ${data.item.city.name}`;
          const formData = new FormData();
          _.forEach(formFields, (field) => {
            formData.append(field, data.item[field]);
          });

          // sử dụng axios có headers :{"Content-Type": "multipart/form-data",}
          //Kết nối với backend
          // setTimeout(() => {
          //   load();
          // }, 1000);
          data.submit = "Đang đăng ký";
          const documents = await axios.post(
            `http://localhost:3000/api/users`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (documents.data.status == "success") {
            success(
              "Thành công",
              "Đã tạo tài khoản thành công. Bạn hãy kiểm tra email đã đăng ký để đăng nhập."
            );

            //Đặt lại giá trị ban đầu

            _.forEach(formFields, (field) => {
              data.item[field] = "";
            });
            data.submit = "Đăng ký";
          }
        }
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
          warning("Cảnh báo", "Email đã được đăng ký");
          data.submit = "Đăng ký";
        } else if (error.request) {
          console.log("Client-side errors", error.request);
          warning("Cảnh báo", "Email đã được đăng ký");
          data.submit = "Đăng ký";
        } else {
          console.log("Errors:", error.message);
          warning("Cảnh báo", "Email đã được đăng ký");
          data.submit = "Đăng ký";
        }
      }
    };
    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal");
    };
    const closeModal = () => {
      console.log("close modal");
      isModalOpen.value = false;
      _.forEach(formFields, (field) => {
        data.item[field] = "";
      });
    };
    onMounted(async () => {
      $("#registrationModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#registrationModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
      try {
        await axios
          .get(`https://provinces.open-api.vn/api/?depth=1`, {})
          .then((response) => {
            data.city = response;
          });
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
      // isPay,
      save,
      checkString,
      checkIdentification,
      checkAddress,
      checkPhone,
      checkMail,
      //3 cấp
      change,
      changeDistrict,
      changeWard,
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
            <h5 class="modal-title title" id="exampleModalLabel">Đăng ký</h5>
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
            <span class="text-danger">(*)</span>
            <span> Đăng ký dành cho chủ nhà trọ</span>
            <form
              @submit.prevent="save"
              enctype="multipart/form-data"
              class="container mt-3"
            >
              <div class="form-group row">
                <label for="inputUserName" class="col-sm-3 col-form-label p-0"
                  >Họ và Tên :</label
                >
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control"
                    id="inputUserName"
                    placeholder="Nhập họ và tên"
                    @blur="
                      () => {
                        let isCheck = checkString(data.item.userName);
                        if (isCheck) {
                          data.error.userName = 'Họ tên phải là ký tự.';
                          data.flag = true;
                        }
                      }
                    "
                    @input="
                      data.error.userName = '';
                      data.flag = false;
                    "
                    v-model="data.item.userName"
                  />
                  <div v-if="data.error.userName" class="invalid-error">
                    {{ data.error.userName }}
                  </div>
                </div>
              </div>
              <!-- <div class="form-group row">
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
                    @blur="
                      () => {
                        let isCheck = checkIdentification(
                          data.item.identification
                        );
                        if (isCheck) {
                          data.error.identification = 'CCCD gồm 12 số.';
                          data.flag = true;
                        }
                      }
                    "
                    @input="
                      data.error.identification = '';
                      data.flag = false;
                    "
                    v-model="data.item.identification"
                  />
                  <div v-if="data.error.identification" class="invalid-error">
                    {{ data.error.identification }}
                  </div>
                </div>
              </div> -->
              <!-- Image -->
              <!-- <div class="form-group row">
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
                          data.error.image = 'Ảnh cccd trước và sau.';
                          data.flag = true;
                        }
                      }
                    "
                    @input="
                      data.error.image = '';
                      data.flag = false;
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
              </div> -->
              <div class="form-group row">
                <label for="inputEmail" class="col-sm-3 col-form-label p-0"
                  >Email :</label
                >
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control"
                    id="inputEmail"
                    placeholder="Nhập email"
                    @blur="
                      () => {
                        let isCheck = checkMail(data.item.email);
                        if (isCheck) {
                          data.error.email = 'Chưa đúng định dạng email.';
                          data.flag = true;
                        }
                      }
                    "
                    @input="
                      data.error.email = '';
                      data.flag = false;
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
                    type="tel"
                    class="form-control"
                    id="inputPhone"
                    placeholder="Nhập số điện thoại"
                    @blur="
                      () => {
                        let isCheck = checkPhone(data.item.phone);
                        if (isCheck) {
                          data.error.phone = 'SĐT gồm 10 số.';
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

              <!-- 3 cấp -->
              <div class="form-group row">
                <label for="inputrules" class="col-sm-3 col-form-label p-0"
                  >Thành phố :</label
                >
                <div class="col-sm-9">
                  <Select
                    :title="`Chọn thành phố`"
                    :data="data.city.data"
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
                    @choose="(value) => changeDistrict(value)"
                  ></Select>
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
                  ></Select>
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
                    placeholder="Nhập địa chỉ"
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
                  />
                  <div v-if="data.error.number" class="invalid-error">
                    {{ data.error.number }}
                  </div>
                </div>
              </div>

              <!-- Payment -->
              <div class="form-group row">
                <label
                  for="inputIsPay"
                  class="col-sm-3 col-form-label p-0"
                ></label>
                <div class="col-sm-9 m-0">
                  <input
                    type="checkbox"
                    id="inputIsPay"
                    placeholder="Nhập mã kết nối do cổng thanh toán cung cấp"
                    v-model="data.item.isPay"
                  /><span class="text-info">Tích hợp thanh toán </span>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/PayPal_logo.svg/1280px-PayPal_logo.svg.png"
                    class="w-25 h-75 m-0 p-0"
                  />
                </div>
              </div>
              <div class="form-group row" v-if="data.item.isPay">
                <label for="inputClientId" class="col-sm-3 col-form-label p-0"
                  >ClientId:
                </label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control"
                    id="inputClientId"
                    placeholder="Nhập mã kết nối do Paypal cung cấp"
                    v-model="data.item.clientId"
                  />
                </div>
              </div>

              <div class="form-group row" v-if="data.item.isPay">
                <label for="inputSecretId" class="col-sm-3 col-form-label p-0"
                  >SecretId:</label
                >
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control"
                    id="inputSecretId"
                    placeholder="Nhập key mã hóa do Paypal cung cấp"
                    v-model="data.item.secretId"
                  />
                </div>
              </div>
              <!-- BTN submit -->

              <div class="form-group row justify-content-around mb-0">
                <button
                  type="submit"
                  class="btn btn-login col-sm-3"
                  :disabled="data.submit == 'Đang đăng ký'"
                >
                  {{ data.submit }}
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
