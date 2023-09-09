<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import axios from "axios";
import _ from "lodash";
//component
import Select from "../../../../components/select/selectdependent.vue";

//service
import boardinghouseService from "../../../../service/boardinghouse.service";
import roomService from "../../../../service/room.service";
import mediaService from "../../../../service/media.service";
//js
import { city, district, ward } from "../../../../assets/js/dependent.common";

// view
export default {
  components: { Select },
  setup(props, { emit }) {
    const data = reactive({
      item: {},
      city: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
    });
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
    const save = async () => {
      console.log("save");
    };
    onMounted(async () => {
      //get all boarding house
      try {
        await axios
          .get(`https://provinces.open-api.vn/api/?depth=1`, {})
          .then((response) => {
            data.city = response;
          });
      } catch (error) {
        console.log(error);
      }
      $("#addCustomerModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#addCustomerModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });
    return { data, change, changeDistrict, changeWard, save };
  },
};
</script>
<template>
  <form class="row justify-content-around" @submit.prevent="save">
    <!-- form 1 -->
    <form class="col-6">
      <!-- userName -->
      <div class="form-group row">
        <label for="inputUserName" class="col-sm-4 m-0 px-0 col-form-label"
          >Họ và tên:</label
        >
        <div class="col-sm-8 p-0 m-0">
          <input type="email" class="form-control" id="inputUserName" />
        </div>
      </div>
      <div class="form-group row">
        <label for="inputBirthday" class="col-sm-4 m-0 px-0 col-form-label"
          >Ngày sinh:</label
        >
        <div class="col-sm-8 p-0 m-0">
          <input type="date" class="form-control" id="inputBirthday" />
        </div>
      </div>
      <fieldset class="form-group row">
        <legend class="col-form-label col-sm-3 p-0 m-0 float-sm-left pt-0">
          Giới tính:
        </legend>
        <div class="col-sm-8 ml-2">
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="gridRadios"
              id="gridRadios1"
              value="false"
              checked
            />
            <label class="form-check-label mr-5" for="gridRadios1"> Nam </label>

            <input
              class="form-check-input"
              type="radio"
              name="gridRadios"
              id="gridRadios2"
              value="true"
            />
            <label class="form-check-label" for="gridRadios2"> Nữ </label>
          </div>
        </div>
      </fieldset>
      <div class="form-group row">
        <label for="inputPhone" class="col-sm-4 m-0 px-0 col-form-label"
          >SĐT:</label
        >
        <div class="col-sm-8 p-0 m-0">
          <input type="tel" class="form-control" id="inputPhone" />
        </div>
      </div>
      <div class="form-group row">
        <label for="inputEmail" class="col-sm-4 col-form-label p-0"
          >Email:</label
        >
        <div class="col-sm-8 p-0 m-0">
          <input type="text" class="form-control" id="inputEmail" />
        </div>
      </div>
      <div class="form-group row">
        <label for="inputNumberPlate" class="col-sm-4 col-form-label p-0"
          >Biến số xe:</label
        >
        <div class="col-sm-8 p-0 m-0">
          <input type="text" class="form-control" id="inputNumberPlate" />
        </div>
      </div>
    </form>

    <!-- form 2 -->
    <form class="col-6 pl-4">
      <div class="form-group row">
        <label for="inputidentificationCard" class="col-sm-4 col-form-label p-0"
          >CCCD:</label
        >
        <div class="col-sm-8 p-0 m-0">
          <input
            type="text"
            class="form-control"
            id="inputidentificationCard"
          />
        </div>
      </div>
      <div class="form-group row">
        <label for="inputrules" class="col-sm-4 col-form-label p-0"
          >Thành phố:</label
        >
        <div class="col-sm-8 p-0 m-0">
          <Select
            :title="`Chọn thành phố`"
            :data="data.city.data"
            @choose="(value) => change(value)"
          ></Select>
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
            @choose="(value) => changeDistrict(value)"
          ></Select>
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
            @choose="(value) => changeWard(value)"
          ></Select>
        </div>
      </div>
      <div class="form-group row">
        <label for="inputrules" class="col-sm-4 col-form-label p-0"
          >Thanh toán:</label
        >
        <div class="col-sm-8 p-0">
          <Select
            :title="`Chọn kỳ thanh toán`"
            :data="data.ward.data.wards"
            @choose="(value) => changeWard(value)"
          ></Select>
        </div>
      </div>
      <div class="form-group row">
        <label for="inputrules" class="col-sm-4 col-form-label p-0"
          >Tiền cọc:</label
        >
        <div class="col-sm-8 p-0 m-0 row">
          <input
            type="text"
            class="form-control col-sm-9 p-0"
            aria-label="Amount (to the nearest dollar)"
            style="
              border-top-right-radius: 0px;
              border-bottom-right-radius: 0px;
            "
          />
          <div class="input-group-append col-sm-3 m-0 p-0">
            <span
              class="input-group-text m-0 p-1"
              style="
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
              "
              >VND</span
            >
          </div>
        </div>
      </div>
    </form>
    <div class="form-group row col-12 p-0 m-0">
      <label for="inputidentificationCard" class="col-sm-2 col-form-label p-0"
        >Hình ảnh:</label
      >
      <div class="col-sm-10 p-0 m-0 mb-5">
        <input
          type="file"
          ref="files"
          class="form-control"
          id="inputidentificationCard"
          style="height: 300%"
        />
      </div>
    </div>

    <div class="form-group mt-5 col-2">
      <button type="submit" class="btn btn-login">Lưu</button>
    </div>
  </form>
</template>
<style scoped>
.form-group > label {
  color: var(--black-light);
}
</style>
