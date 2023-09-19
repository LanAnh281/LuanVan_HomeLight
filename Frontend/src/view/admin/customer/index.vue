<script>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
} from "vue";
import axios from "axios";

import { useRoute, useRouter } from "vue-router";

//service
import userService from "../../../service/user.service";
import accountService from "../../../service/account.service";
import userRoomService from "../../../service/user_room.service";
//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
import { city, district, ward } from "../../../assets/js/dependent.common";
import {
  deleted,
  success,
  successAd,
  warning,
} from "../../../assets/js/common.alert";
//component
import paginationVue from "../../../components/pagination/pagination.vue";
import Table from "../../../components/table/tableChecked.table.vue";
import Select from "../../../components/select/selectdependent.vue";
import View from "./view.vue";
import Edit from "./edit.vue";
import Mail from "./mail.vue";
export default {
  components: { paginationVue, Table, Select, View, Edit, Mail },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      item: [{ userName: "" }], //list
      setPage: [],
      searchPage: [],
      currentPage: 1,
      totalPage: 1,
      sizePage: 10,
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
      user: "",
      checkedList: [],
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
        const documentUser = await userService.getAll();
        data.item = documentUser.message;
        data.item = data.item.map((item) => {
          return {
            ...item,
            sex: item.sex ? "Nữ" : "Nam",
            checked: false,
          };
        });
        data.length = data.item.length;
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
        // data.item.city = document.city;
        data.chooseCity = document.city;
        data.choose = document.city;
        data.district = document.district;
        data.length = data.item.length;
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
          const documentUser = await userService.getAll();
          data.item = documentUser.message;
          data.item = data.item.filter(
            (item) =>
              item.address.includes(newValue.name) && item.isActive == true
          );
          data.item = data.item.map((item) => {
            return {
              ...item,
              sex: item.sex ? "Nữ" : "Nam",
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

        // data.item.ward = document.ward;
        // console.log(data.chooseCity, data.chooseDistrict, data.chooseWard);
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
        // **** ẩn khách trọ đi
        // const document = await accountService.updateActive(value, {
        //   isActive: false,
        // });
        // if (document.status == "success") {
        //   success("Thành công", "");
        //   await refresh();
        // } else warning("Thất bại", "");
        //*** xóa hoàn toàn khách trọ khỏi hệ thống
        // 1, không còn ở phòng trọ
        //2, còn ở phòng trong phòng trọ
        let documentUserRoom = await userRoomService.getAll();
        documentUserRoom = documentUserRoom.message;
        const isUserRoom = documentUserRoom.filter(
          (item) => item.UserId == value
        );
        console.log(isUserRoom);
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
      console.log("info:", value);
      data.isInfoUserModal = !data.isInfoUserModal;
      data.user = value;
      console.log(data.user);
    };
    const sendMail = async () => {
      try {
        data.checkedList = data.item.filter((item) => item.checked == true);
        data.isMail = data.checkedList.length > 0 ? !data.isMail : false;
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
  <div class="body m-0">
    <div class="border-radius my-3 row m-0 justify-content-start">
      <div class="input-group col-2 align-items-center pr-0">
        <Select
          :title="`Chọn thành phố`"
          :data="data.city.data"
          @choose="(value) => changeCity(value)"
        ></Select>
      </div>
      <div class="input-group col-2 align-items-center p-0 pl-1">
        <Select
          :title="`Chọn quận huyện`"
          :data="data.district.data.districts"
          @choose="(value) => changeDistrict(value)"
        ></Select>
      </div>
      <div class="input-group col-2 align-items-center p-0 pl-1">
        <Select
          :title="`Chọn phường xã`"
          :data="data.ward.data.wards"
          @choose="(value) => changeWard(value)"
        ></Select>
      </div>
      <!-- btn add boarding house -->
      <div class="col-6 mr-1 p-0 row justify-content-end">
        <div class="mr-1">
          <button
            class="btn btn-primary p-0"
            style="width: 103px; height: 36px; margin-top: 6px"
          >
            <div class="row justify-content-center plus">
              <span
                class="material-symbols-outlined"
                style="color: var(--white)"
              >
                domain_add
              </span>
              <span style="color: var(--white)">Thêm nhà</span>
            </div>
          </button>
        </div>
        <!-- component  -->
      </div>
    </div>
    <!-- Search -->
    <div class="border-radius my-3">
      <!-- Search -->
      <div class="my-2 mx-3 row justify-content-between">
        <input
          type="search"
          placeholder="tìm kiếm theo tên"
          class="p-2 border rounded"
          style="background-color: var(--background); width: 30%"
          v-model="data.searchText"
        />
        <div class="row justify-content-end mr-1">
          <button
            class="btn btn-primary p-0 mt-0 mr-1"
            style="width: 80px; height: 40px"
          >
            <div class="row justify-content-center plus">
              <span
                class="material-symbols-outlined"
                style="color: var(--white)"
              >
                email
              </span>
              <span style="color: var(--white)">xxx</span>
            </div>
          </button>
          <button
            class="btn btn-warning p-0 mt-0"
            style="width: 100px; height: 40px"
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
              <span style="color: var(--white)">Soạn thư</span>
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
    <Table
      :data="data.setPage"
      :name="'User'"
      :fields="['Họ tên', 'GT', 'SĐT', 'Email', 'Địa chỉ']"
      :titles="['userName', 'sex', 'phone', 'email', 'address']"
      :action="true"
      :actionList="['info', 'edit', 'cancel']"
      :isInputChecked="true"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      @info="
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
      :_id="data.user"
      @closeModal="data.isInfoUserModal = !data.isInfoUserModal"
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
  min-height: 124vh;
}
</style>
