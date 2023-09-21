<script>
import { reactive, onMounted, ref } from "vue";
import axios from "axios";

//service
import boardinghouseService from "../../../service/boardinghouse.service";
//component
import Select from "../../../components/select/selectdependent.vue";

//js
import {
  checkStringAndNumber,
  checkAddress,
} from "../../../assets/js/checkInput.common";
import { successAd, warning } from "../../../assets/js/common.alert";
import { city, district, ward } from "../../../assets/js/dependent.common";
export default {
  components: { Select },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        name: "",
        city: "",
        district: "",
        ward: "",
        number: "",
        address: "",
        rules: "",
      },
      error: { name: "", number: "" },
      flag: true,
      city: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
    });
    const isModalOpen = ref(false);
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
    const refresh = () => {
      data.item = {
        name: "",
        city: "",
        district: "",
        ward: "",
        number: "",
        address: "",
        rules: "",
      };
      data.error = { name: "", number: "" };
      data.flag = true;
    };
    const save = async () => {
      console.log("save");
      const keys = ["name", "number"];
      try {
        for (const key of keys) {
          console.log("key", data.item[key]);
          if (data.item[key] == "") {
            data.error[key] = "Chưa nhập thông tin.";
            data.flag = true;
            console.log("1");
          }
        }
        if (!data.flag) {
          data.item.address = `${data.item.number} - ${data.item.ward.name} - ${data.item.district.name} - ${data.item.city.name}`;
          const document = await boardinghouseService.create({
            address: data.item.address,
            name: data.item.name,
          });
          if (document["status"] == "success") {
            successAd(`Đã thêm nhà trọ ${document.message["name"]}`);
            refresh();
            emit("add");
          } else {
            console.log("Thất bại");
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

            <!-- <div class="form-group row">
                <label for="inputrules" class="col-sm-3 col-form-label p-0"
                  >Quy định :</label
                >
                <div class="col-sm-9">
                  <textarea
                    class="form-control"
                    id="inputrules"
                    @blur="
                      () => {
                        let isCheck = checkAddress(data.item.rules);
                        if (isCheck) {
                          data.error.rules =
                            'Quy định không chứa các kí tự đặc biệt';
                          data.flag = true;
                        }
                      }
                    "
                    @input="
                      data.error.rules = '';
                      data.flag = false;
                    "
                    v-model="data.item.rules"
                  ></textarea>
                  <div v-if="data.error.rules" class="invalid-error">
                    {{ data.error.rules }}
                  </div>
                </div>
              </div> -->

            <div class="form-group row justify-content-around mb-0">
              <button type="submit" class="btn btn-login col-sm-3">Thêm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
