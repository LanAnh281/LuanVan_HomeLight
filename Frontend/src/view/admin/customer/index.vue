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
import userRoomService from "../../../service/user_room.service";
import boardinghouseService from "../../../service/boardinghouse.service";
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
import SelectNormal from "../../../components/select/select.vue";
import View from "./view.vue";
import Edit from "./edit.vue";
import Mail from "./mail.vue";
export default {
  components: { paginationVue, Table, Select, SelectNormal, View, Edit, Mail },
  setup() {
    const router = useRouter();
    const route = useRoute();
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
      user: "",
      checkedList: [],
      //boarding
      boarding: [],
      boardingActice: "",
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
        const documentUser = await userService.getAllTenant("Landloard");
        data.item = documentUser.message;
        data.item = documentUser.message.filter(
          (item) => item.user.boardingId == data.boardingActice
        );
        data.item = data.item.map((item) => {
          return {
            ...item,
            _id: item.tenantId,
            sex: item.user.sex ? "Nữ" : "Nam",
            userName: item.user.userName,
            phone: item.user.phone,
            email: item.user.email,
            address: item.user.address,
            checked: false,
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
    watch(
      () => data.boardingActice,
      async (newValue, oldValue) => {
        await refresh();
      }
    );
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
          await refresh();
          data.item = data.item.filter((item) =>
            item.user.address.includes(newValue.name)
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
      const documentBoarding = await boardinghouseService.getAllUser();
      data.boarding = documentBoarding.message;
      if (data.boarding.length > 0) {
        data.boardingActice = data.boarding[0]._id;
      }
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
      <div class="input-group col-2 align-items-center p-0 pl-1">
        <SelectNormal
          :title="`Chọn nhà trọ`"
          :data="data.boarding"
          :selected="data.boardingActice"
          @choose="
            async (value) => {
              data.boardingActice = value;
            }
          "
          class="select"
          style="height: 36px"
        ></SelectNormal>
      </div>
    </div>
    <!-- Search -->
    <div class="border-radius my-3">
      <!-- Search -->
      <div class="my-2 mx-3 row justify-content-between">
        <input
          type="search"
          placeholder="tìm kiếm theo tên khách hàng"
          class="p-2 border rounded"
          style="
            background-color: var(--background);
            width: 30%;
            font-size: 0.9rem;
          "
          v-model="data.searchText"
        />
        <div class="row justify-content-end mr-1">
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
              <span style="color: var(--white); font-size: 16px">Soạn thư</span>
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
      :actionList="['visibility', 'edit', 'cancel']"
      :isInputChecked="true"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      @visibility="
        (value) => {
          console.log(value);
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
  min-height: 200vh;
}
.select {
  background-color: var(--background);
}
</style>
