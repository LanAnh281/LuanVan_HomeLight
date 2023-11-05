<script>
import { reactive, onMounted, ref, onBeforeMount, computed, watch } from "vue";
import _ from "lodash";
import axios from "axios";

//service
import userService from "../../../service/user.service";
//js
import { formatDateTime } from "../../../assets/js/format.common";
import { city, district, ward } from "../../../assets/js/dependent.common";
import { warning, deleted } from "../../../assets/js/common.alert";
// view
import Table from "../../../components/table/table.vue";
import paginationVue from "../../../components/pagination/pagination.vue";
import Select from "../../../components/select/selectdependent.vue";

export default {
  components: { Table, paginationVue, Select },
  props: {
    _id: { type: String, default: "" },
    dataProp: { type: Object, default: {} },
  },
  setup(props, { emit }) {
    const data = reactive({
      boarding: [{ name: "", address: "" }],

      setPage: [],
      searchText: "",
      searchPage: [],
      setPage: [],
      sizePage: 5,
      currentPage: 1,
      totalPage: 0,
      length: 0,

      //select-option
      city: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
      //choose
      chooseCity: "",
      changeDistrict: "",
      chooseWard: "",
      choose: "",
    });
    const isModalOpen = ref(false);

    data.searchPage = computed(
      () => (
        (data.currentPage = 1),
        data.boarding
          ? data.boarding.filter((item) =>
              item.name
                .toLowerCase()
                .includes(data.searchText.toLocaleLowerCase())
            )
          : []
      )
    );
    data.length = computed(() => data.searchPage.length);
    data.totalPage = computed(() =>
      data.searchPage ? Math.ceil(data.searchPage.length / data.sizePage) : 0
    );
    data.setPage = computed(() =>
      data.searchPage
        ? data.searchPage.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : []
    );
    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal visibility user");
    };
    const closeModal = () => {
      console.log("close modal visibility user");
      emit("closeModal");
    };
    const changeCity = async (value) => {
      try {
        const document = await city(value);
        data.chooseCity = document.city;
        data.choose = document.city;
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
    watch(
      () => data.choose,
      async (newValue, oldValue) => {
        try {
          if (data.choose == "") return;
          data.boarding = props.dataProp.BoardingHouses.filter((item) =>
            item.address.includes(newValue.name)
          );
          data.boarding = data.boarding.map((item) => {
            return {
              ...item,
              count: item.Rooms.length,
            };
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
      }
    );

    const changeDistrict = async (value) => {
      try {
        const document = await district(data.chooseCity.code, value);
        // data.item.district = document.district;
        data.chooseDistrict = document.district;
        data.choose = document.district;

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
          data.chooseCity.code,
          data.chooseDistrict.code,
          value
        );
        data.chooseWard = document.ward;
        data.choose = document.ward;
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
        console.log("handle Delete");
        const isDeleted = await deleted(
          "Xóa chủ trọ",
          "Tất cả các thông tin về tài khoản chủ trọ, khách trọ, phòng trọ, dịch vụ của chủ trọ, điện nươc, chi phí, hóa đơn, thông báo sẽ bị xóa bỏ khỏi hệ thống"
        );
        console.log(isDeleted);
        if (isDeleted == true) {
          const document = await userService.delete(props._id);
          console.log("Xóa chủ trọ:", document);
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
    onMounted(async () => {
      try {
        $("#visibilityUserModal").on("show.bs.modal", openModal); //lắng nghe mở modal
        $("#visibilityUserModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
        data.city = await axios.get(
          `https://provinces.open-api.vn/api/?depth=1`,
          {}
        );
        // console.log("PropsId:", props._id, props.dataProp);
        data.boarding = props.dataProp.BoardingHouses;
        let total = 0;
        data.boarding = data.boarding.map((item) => {
          total = total + Number(item.Rooms.length);
          return {
            ...item,
            count: item.Rooms.length,
          };
        });
        props.dataProp.totalRooms = total;
        console.log(props.dataProp);
      } catch (error) {
        console.log(error);
      }
    });
    return {
      data,
      formatDateTime, //select-option
      changeCity,
      changeDistrict,
      changeWard,
      handleDelete,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="visibilityUserModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Thông tin chủ trọ
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
          <div class="row p-0 m-0 px-2">
            <div class="col-6 p-0 m-0">
              <div class="row justify-content-start p-0 m-0"></div>
              <div class="row justify-content-start p-0 mt-2 m-0"></div>
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Họ và tên:</label>
                <label class="">{{ dataProp.userName }}</label>
              </div>

              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Ngày sinh:</label>
                <label class="">{{
                  dataProp.birthday ? formatDateTime(dataProp.birthday) : ""
                }}</label>
              </div>

              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Tổng nhà trọ:</label>
                <label class="">{{ data.boarding.length }} nhà</label>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Tổng phòng trọ: </label>
                <label class="">{{ dataProp.totalRooms }} phòng</label>
              </div>
            </div>
            <div class="col-6 m-0 p-0">
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Giới tính:</label>
                <span class=""> {{ dataProp.sex ? "Nữ" : "Nam" }}</span>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Email:</label>
                <label class="">{{ dataProp.email }}</label>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">SĐT:</label>
                <label class="">{{ dataProp.phone }}</label>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="col-2 p-0 m-0">Địa chỉ:</label>
                <label class="col-10 p-0 m-0">{{ dataProp.address }}</label>
              </div>
            </div>
          </div>
          <hr />
          <!-- Table boarding -->
          <!-- lọc -->
          <div class="mb-3 row m-0 justify-content-start">
            <div class="input-group col-3 align-items-center pr-0">
              <Select
                :title="`Chọn thành phố`"
                :data="data.city.data"
                @choose="(value) => changeCity(value)"
                class="select"
              ></Select>
            </div>
            <div class="input-group col-3 align-items-center p-0 pl-1">
              <Select
                :title="`Chọn quận huyện`"
                :data="data.district.data.districts"
                @choose="(value) => changeDistrict(value)"
                class="select"
              ></Select>
            </div>
            <div class="input-group col-3 align-items-center p-0 pl-1">
              <Select
                :title="`Chọn phường xã`"
                :data="data.ward.data.wards"
                @choose="(value) => changeWard(value)"
                class="select"
              ></Select>
            </div>
            <div class="input-group col align-items-center p-0 pl-1 w-100">
              <input
                type="search"
                placeholder="tìm kiếm theo tên nhà trọ"
                class="p-2 border rounded w-100"
                style="
                  background-color: var(--background);

                  font-size: 0.9rem;
                "
                v-model="data.searchText"
              />
            </div>
          </div>

          <Table
            class="text-center"
            :data="data.setPage"
            :fields="['Tên nhà trọ', 'Địa chỉ', 'Số lượng phòng']"
            :titles="['name', 'address', 'count']"
            :action="false"
            :isInputChecked="false"
          ></Table>
          <paginationVue
            class="m-0 p-0 mt-1"
            :currentPage="data.currentPage"
            :totalPage="data.totalPage"
            :size="data.sizePage"
            :length="data.length"
            @page="(value) => (data.currentPage = value)"
            @previous="
              () => {
                if (data.currentPage > 1) {
                  data.currentPage = data.currentPage - 1;
                }
              }
            "
            @next="
              () => {
                if (data.currentPage < data.totalPage) {
                  data.currentPage = data.currentPage + 1;
                }
              }
            "
          ></paginationVue>
        </div>
        <div class="row justify-content-around my-3">
          <!-- <button class="btn btn-primary" @click="handleActive">
            Ngừng hoạt động
          </button> -->
          <button class="btn btn-danger" @click="handleDelete">
            Xóa chủ trọ
          </button>
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
img {
  width: 200px;
  height: 200px;
  object-fit: contain;
}
</style>
<!-- 
  1. Khóa tài khoản, tất cả tài khoản khách trọ của chủ trọ sẽ đc cập nhật isAvtice =fasle
  2. bên trả phòng là thực hiện xóa từng ng khách ra khỏi hệ thống
 -->
