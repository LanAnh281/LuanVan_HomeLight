<!-- -Thông tin chủ trọ=> nhà trọ => số phòng trọ -->

<script>
import { reactive, onMounted, onBeforeUnmount, computed, watch } from "vue";
import axios from "axios";

import { useRouter } from "vue-router";

//service
import userService from "../../../service/user.service";
import userRoomService from "../../../service/user_room.service";
//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
import { city, district, ward } from "../../../assets/js/dependent.common";
import { deleted, success, warning } from "../../../assets/js/common.alert";
//component
import paginationVue from "../../../components/pagination/pagination.vue";
import Table from "../../../components/table/tableChecked.table.vue";
import Select from "../../../components/select/selectdependent.vue";
import SelectNormal from "../../../components/select/select.vue";
import View from "./view.vue";
import Edit from "./edit.vue";
import Mail from "../../../components/form/mail.vue";
import Service from "./service.vue";
import { formatDateTime } from "../../../assets/js/format.common";
export default {
  components: {
    paginationVue,
    Table,
    Select,
    SelectNormal,
    View,
    Edit,
    Mail,
    Service,
  },
  setup() {
    const router = useRouter();
    const data = reactive({
      item: [{ userName: "" }], //list
      setPage: [],
      searchPage: [],
      currentPage: 1,
      totalPage: 1,
      sizePage: 20,
      length: 0,
      searchText: "",
      //select-option
      city: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
      //choose
      chooseCity: "",
      changeDistrict: "",
      chooseWard: "",
      choose: "",
      //modal
      isInfoUserModal: false,
      isEditUserModal: false,
      isMail: false,
      isService: false,
      checkedList: [],
      active: {},
    });

    let intervalId = null;
    data.totalPage = computed(() =>
      data.searchPage ? Math.ceil(data.searchPage.length / data.sizePage) : 0
    );
    data.searchPage = computed(
      () => (
        (data.currentPage = 1),
        data.item
          ? data.item.filter((item) =>
              item.userName
                .toLowerCase()
                .includes(data.searchText.toLocaleLowerCase())
            )
          : []
      )
    );
    data.length = computed(() => data.searchPage.length);
    data.setPage = computed(() =>
      data.searchPage
        ? data.searchPage.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : []
    );
    const refresh = async () => {
      try {
        const documentUser = await userService.getAllLandlord();
        data.item = documentUser.message;

        let total = 0;
        data.item = data.item.map((item) => {
          for (let value of item.BoardingHouses) {
            total = total + value.Rooms.length;
          }

          return {
            ...item,
            birthday: item.birthday ? formatDateTime(item.birthday) : "",
            sex: item.sex ? "Nữ" : "Nam",
            checked: false,
            totalRooms: total,
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
          await refresh();
          data.item = data.item.filter((item) =>
            item.address.includes(newValue.name)
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
    const handleDelete = async (value) => {
      try {
        let documentUserRoom = await userRoomService.getAll();
        documentUserRoom = documentUserRoom.message;
        const isUserRoom = documentUserRoom.filter(
          (item) => item.UserId == value
        );
        if (isUserRoom.length > 0) {
          warning(
            "Cảnh báo",
            "Khách trọ vẫn còn đang thuê. Bạn cần xóa khách trọ này khỏi phòng trọ."
          );
        } else {
          const isDelete = await deleted("xóa khách trọ", " ");
          if (isDelete == true) {
            const document = await userService.delete(value);
            if (document.status == "success") {
              success("Thành công", "");
              await refresh();
            } else warning("Thất bại", "");
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
    const handleEdit = async (value) => {
      try {
        console.log("edit:", value);
        data.isEditUserModal = !data.isEditUserModal;
        data.user = value;
        console.log(data.user);
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
    const handleInfo = (value) => {
      data.isInfoUserModal = !data.isInfoUserModal;
      const user = data.item.filter((item) => item._id == value);
      data.active = user[0];
    };
    const sendMail = async () => {
      try {
        data.checkedList = data.item.filter((item) => item.checked == true);
        // data.isMail = data.checkedList.length > 0 ? !data.isMail : false;
        if (data.checkedList.length > 0) {
          data.isMail = !data.isMail;
        } else {
          data.isMail = false;
          warning("Cảnh báo", "Bạn chưa chọn khách trọ");
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
      await checkAccessToken(router); //access token
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes

      await refresh();
      try {
        data.city = await axios.get(
          `https://provinces.open-api.vn/api/?depth=1`,
          {}
        );
      } catch (error) {
        console.log(error);
      }
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,
      refresh,
      //select-option
      changeCity,
      changeDistrict,
      changeWard,
      //handle
      handleDelete,
      handleEdit,
      handleInfo,
      sendMail,
    };
  },
};
</script>
<template>
  <div class="body m-0 px-3">
    <div class="border-radius mb-1 row m-0 justify-content-start">
      <div class="input-group col-2 align-items-center pr-0">
        <Select
          :title="`Chọn thành phố`"
          :data="data.city.data"
          @choose="(value) => changeCity(value)"
          class="select"
        ></Select>
      </div>
      <div class="input-group col-2 align-items-center p-0 pl-1">
        <Select
          :title="`Chọn quận huyện`"
          :data="data.district.data.districts"
          @choose="(value) => changeDistrict(value)"
          class="select"
        ></Select>
      </div>
      <div class="input-group col-2 align-items-center p-0 pl-1">
        <Select
          :title="`Chọn phường xã`"
          :data="data.ward.data.wards"
          @choose="(value) => changeWard(value)"
          class="select"
        ></Select>
      </div>
    </div>
    <!-- Search -->
    <div class="border-radius">
      <!-- Search -->
      <div class="mx-3 row justify-content-between">
        <input
          type="search"
          placeholder="tìm kiếm theo tên chủ trọ"
          class="p-2 border rounded col-4 my-2"
          style="
            background-color: var(--background);
            width: 30%;
            height: 36px;
            font-size: 0.9rem;
          "
          v-model="data.searchText"
        />
        <div class="row col-8 justify-content-end">
          <button
            class="btn btn-primary p-0 m-0 col-3"
            data-toggle="modal"
            data-target="#serviceModal"
            @click="() => (data.isService = !data.isService)"
          >
            <div class="row justify-content-center plus">
              <span
                class="material-symbols-outlined"
                style="color: var(--white)"
              >
                email
              </span>
              <span style="color: var(--white); font-size: 16px"
                >Dịch vụ thuê</span
              >
            </div>
          </button>

          <!-- component dịch vụ thuê -->
          <Service v-if="data.isService"> </Service>
          <button
            class="btn btn-warning p-0 mt-0 mx-2 col-6"
            style="width: 110px; height: 36px"
            data-toggle="modal"
            data-target="#mailModal"
            @click="sendMail"
          >
            <div class="row justify-content-center plus">
              <span
                class="material-symbols-outlined"
                style="color: var(--white)"
              >
                email
              </span>
              <span style="color: var(--white); font-size: 16px" class="px-1"
                >Soạn thư</span
              >
            </div>
          </button>
          <!-- component -->
          <Mail
            v-if="data.isMail"
            :checkedList="data.checkedList"
            @closeModal="data.isMail = !data.isMail"
          ></Mail>
        </div>
      </div>
    </div>

    <!-- Table -->
    <h5 class="title text-center my-3">Danh sách chủ trọ</h5>
    <Table
      :data="data.setPage"
      :name="'User'"
      :fields="['Họ tên', 'GT', 'SĐT', 'Email', 'Địa chỉ']"
      :titles="['userName', 'sex', 'phone', 'email', 'address']"
      :action="true"
      :actionList="['visibility']"
      :isInputChecked="true"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      @visibility="
        (value) => {
          handleInfo(value);
        }
      "
      @edit="
        (value) => {
          handleEdit(value);
        }
      "
      @cancel="
        (value) => {
          console.log('cancel:', value);
          handleDelete(value);
        }
      "
    ></Table>
    <!-- pagination -->
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

    <View
      v-if="data.isInfoUserModal"
      :_id="data.active._id"
      :dataProp="data.active"
      @closeModal="data.isInfoUserModal = !data.isInfoUserModal"
      @delete="refresh"
    >
    </View>
    <Edit
      v-if="data.isEditUserModal"
      :_id="data.user"
      @edit="refresh"
      @closeModal="data.isEditUserModal = !data.isEditUserModal"
    ></Edit>
  </div>
</template>
<style scoped>
.body {
  height: 100vh; /* Đặt chiều cao cho .body theo chiều cao của viewport */
  overflow: auto; /* Cho phép nội dung trượt khi vượt quá chiều cao của .body */
}

.select {
  background-color: var(--background);
}
</style>
