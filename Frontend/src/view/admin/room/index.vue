<script>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
//service
import boardinghouseService from "../../../service/boardinghouse.service";
import roomService from "../../../service/room.service";

//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
import {
  successAd,
  deleted,
  success,
  warning,
} from "../../../assets/js/common.alert";

//components
import Select from "../../../components/select/select.vue";
import EditBoardingForm from "./editBoarding.form.vue";
import AddBoardingForm from "./addBoarding.vue";

import Rule from "./addRules.form.vue";
import Box from "./box.vue";

//
import roomForm from "./add.vue";
import roomFast from "./addRoomFast.vue";
import Edit from "./edit.vue";
import View from "./view/view.vue";
import ViewStatus from "./view/viewStatus.vue";
import addCustomer from "./addCustomer/index.form.vue";
import paginationVue from "../../../components/pagination/pagination.vue";

export default {
  components: {
    Select,
    AddBoardingForm,
    roomForm,
    roomFast,
    Box,
    Rule,
    Edit,
    EditBoardingForm,
    View,
    ViewStatus,
    addCustomer,
    paginationVue,
  },
  setup() {
    const router = useRouter();
    const data = reactive({
      items: [{ name: "", wide: "", long: "", price: "" }], //list rooms

      room: {}, // one room
      boarding: [{ _id: "", name: "" }], // list boarding

      boradingItem: {
        name: "",
        address: "",
        city: { code: "", name: "" },
        district: { code: "", name: "" },
        ward: { code: "", name: "" },
        number: "",
      },
      medias: [], //list images and videos room
      isActiveBoarding: "", // a boarding item actived
      isActiveRoom: "",
      status: [
        { _id: true, name: "Chưa thuê" },
        { _id: false, name: "Đã thuê" },
      ],
      isStatus: { _id: true, name: "Đã thuê" },
      fee: [
        {
          _id: false,
          name: "Chưa thanh toán",
        },
        { _id: true, name: "Đã thanh toán" },
      ],
      currentPage: 1,
      totalPage: 0,
      length: 0,
      sizePage: 18,
      searchText: "",
      flag: false,
    });
    const component = reactive({
      isBoardingModal: false,

      isRuleModal: false,
      isEditRoomModal: false,
    });
    let intervalId = null;
    const isBoardingModal = ref(false);
    const isEditBoardingModal = ref(false);
    const isRoomModal = ref(false);
    const isRoomFastModal = ref(false);
    const isEditRoomModal = ref(false);

    const isViewModal = ref(false);
    const isAddCustomerModal = ref(false);
    const handleStatus = (value) => {
      //value: Object, but component need a boolean
      data.isStatus = {};
      data.isStatus = data.status.filter(
        (item) => item._id == JSON.parse(value)
      );
      data.isStatus = data.isStatus[0];
    };
    const handlefee = (value) => {
      console.log("Status:", value);
    };

    const refreshBoarding = async () => {
      const document = await boardinghouseService.getAllUser();
      data.boarding = document.message;
      data.isActiveBoarding = data.boarding[0]._id;
    };
    const refreshRoom = async () => {
      try {
        const documentRoom = await roomService.getAll(); //api getAll rooms
        data.items = documentRoom.message;
        //filter rooms of a boarding house
        data.items = data.items.filter(
          (item) => item.boardingId == data.isActiveBoarding
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
    const handleDeleteClick = async (id, name) => {
      try {
        console.log(data.items);
        data.flag = false;
        for (let value of data.items) {
          if (value.status == true) {
            warning(
              "Cảnh báo",
              `Các phòng trọ của nhà trọ ${name} vẫn còn khách trọ`
            );
            data.flag = true;
            break;
          }
        }
        if (data.flag) return;
        const isDelete = await deleted(
          `Xóa nhà trọ ${name}`,
          `Bạn sẽ xóa tất cả phòng trọ thuộc nhà trọ ${name}`
        );
        if (isDelete) {
          const document = await boardinghouseService.delete(id);
          document.status == "success"
            ? successAd(`Xóa thành công nhà trọ ${name} `)
            : warning("Xóa thất bại", `Xóa thất bại nhà trọ ${name}`);
          await refreshBoarding();
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
    //Function edit boarding
    const handleEditBoardingClick = async (value) => {
      try {
        isEditBoardingModal.value = !isEditBoardingModal.value;
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
      const boardingId = data.isActiveBoarding;
      data.isActiveBoarding = "";
      setTimeout(() => {
        data.isActiveBoarding = boardingId;
      }, 1);
      await refreshRoom();
    };
    const handleAddRoomFast = async () => {
      const boardingId = data.isActiveBoarding;
      data.isActiveBoarding = "";
      setTimeout(() => {
        data.isActiveBoarding = boardingId;
      }, 1);
    };
    const refresh = async () => {
      try {
        const document = await boardinghouseService.getAllUser(); // api getAll borading houses
        data.boarding = document.message;
        if (data.boarding.length > 0) {
          data.isActiveBoarding = data.boarding[0]._id;
          const documentRoom = await roomService.getAll(); //api getAll rooms
          data.items = documentRoom.message;
          data.items = data.items.filter(
            //filter rooms of a boarding house
            (item) => item.boardingId == data.isActiveBoarding
          );
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
      await refresh();
      await refreshRoom();
      await checkAccessToken(router); //access token
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,
      component,
      refresh,
      refreshRoom,
      refreshBoarding,

      handleStatus,
      handlefee,
      handleDeleteClick,
      handleEditBoardingClick,
      handleEdit,
      roomService,
      handleAddRoomFast,
      //modal
      isBoardingModal,
      isEditBoardingModal,
      isRoomModal,
      isRoomFastModal,
      isEditRoomModal,
      isViewModal,
      isAddCustomerModal,
    };
  },
};
</script>
<template>
  <div class="body m-0">
    <!-- Status  and fee-->
    <div class="border-radius mb-3 row m-0 justify-content-start">
      <div class="input-group col-2 align-items-center pt-0 pr-0 mr-1 mt-1">
        <Select
          :title="`Trạng thái phòng`"
          :data="data.status"
          :selected="true"
          @choose="(value) => handleStatus(value)"
          style="background-color: var(--background)"
        ></Select>
      </div>
      <div class="input-group col-2 align-items-center p-0">
        <Select
          :title="`Chọn nhà trọ`"
          :data="data.boarding"
          @choose="
            async (value) => {
              data.isActiveBoarding = value;
              const documentRoom = await roomService.getAll();
              data.items = documentRoom.message;
              data.items = data.items.filter(
                (item) => item.boardingId == data.isActiveBoarding
              );
            }
          "
          class="select"
        ></Select>
      </div>
      <div class="input-group col-7 align-items-center">
        <input
          type="search"
          placeholder="tìm kiếm theo tên phòng trọ"
          class="p-2 pb-1 border rounded"
          style="
            background-color: var(--background);
            width: 50%;
            font-size: 0.9rem;
          "
          v-model="data.searchText"
        />
      </div>
    </div>
    <!-- Boarding house items -->
    <div class="border-radius my-3 mx-0 row justify-content-end">
      <!-- <div class="col-4 boarding">
        <button
          class="btn px-2 mr-2 board-item"
          v-for="(value, index) in data.boarding"
          :key="index"
          :class="value._id == data.isActiveBoarding ? 'isActiveBoarding' : ''"
          @click="
            async () => {
              data.isActiveBoarding = value._id;
              const documentRoom = await roomService.getAll();
              data.items = documentRoom.message;
              data.items = data.items.filter(
                (item) => item.boardingId == data.isActiveBoarding
              );
            }
          "
        >
          {{ value.name }}
          <span
            class="delete-icon mr-1"
            @click.stop="handleDeleteClick(value._id, value.name)"
          >
            x
          
          </span>
        </button>
      </div> -->
      <div class="col-8 mr-1 p-0 row justify-content-end mr-3">
        <div class="mr-1">
          <button
            class="btn btn-primary p-0"
            style="width: 103px; height: 36px; margin-top: 6px"
            data-toggle="modal"
            data-target="#boardingModal"
            @click="isBoardingModal = !isBoardingModal"
          >
            <div class="row justify-content-center plus">
              <span
                class="material-symbols-outlined"
                style="color: var(--white)"
              >
                domain_add
              </span>
              <span style="color: var(--white); font-size: 16px">Thêm nhà</span>
            </div>
          </button>
        </div>
        <!-- component  -->
        <AddBoardingForm
          v-if="isBoardingModal"
          @add="
            async () => {
              await refreshBoarding();
            }
          "
          @closeModal="isBoardingModal = !isBoardingModal"
        ></AddBoardingForm>

        <!--  btn edit boarding -->
        <div class="mr-1">
          <button
            class="btn btn-warning"
            style="width: 118px; height: 36px; margin-top: 6px"
            data-toggle="modal"
            data-target="#editBoardingModal"
            @click="
              () => {
                handleEditBoardingClick(data.isActiveBoarding);
              }
            "
          >
            <div class="row justify-content-center plus">
              <span
                class="material-symbols-outlined mr-1"
                style="color: var(--white)"
              >
                edit
              </span>
              <span style="color: var(--white); font-size: 16px"
                >Sửa nhà trọ</span
              >
            </div>
          </button>
          <!-- :dataProps="data.boradingItem" -->
          <EditBoardingForm
            v-if="isEditBoardingModal"
            :boardingId="data.isActiveBoarding"
            @edit="refreshBoarding"
            @closeModal="isEditBoardingModal = !isEditBoardingModal"
          ></EditBoardingForm>
        </div>
        <div>
          <button
            class="btn p-0 mr-1"
            style="
              width: 120px;
              height: 36px;
              margin-top: 6px;
              background-color: var(--green);
            "
          >
            <div
              class="row justify-content-center plus"
              data-toggle="modal"
              data-target="#roomModal"
              @click="isRoomModal = !isRoomModal"
            >
              <span
                class="material-symbols-outlined"
                style="color: var(--white)"
              >
                holiday_village
              </span>
              <span style="color: var(--white); font-size: 16px"
                >Thêm phòng</span
              >
            </div>
            <!-- compomnent add room -->
            <roomForm
              v-if="isRoomModal"
              :boarding="data.boarding"
              @add="handleEdit"
              @closeModal="isRoomModal = !isRoomModal"
            ></roomForm>
          </button>
        </div>

        <div>
          <button
            class="btn p-0"
            style="
              width: 170px;
              height: 36px;
              margin-top: 6px;
              background-color: var(--blue);
            "
          >
            <div
              class="row justify-content-center plus"
              data-toggle="modal"
              data-target="#roomFastModal"
              @click="isRoomFastModal = !isRoomFastModal"
            >
              <span
                class="material-symbols-outlined"
                style="color: var(--white)"
              >
                holiday_village
              </span>
              <span style="color: var(--white); font-size: 16px"
                >Thêm phòng nhanh</span
              >
            </div>
            <!-- compomnent add room -->
            <roomFast
              v-if="isRoomFastModal"
              :boarding="data.boarding"
              @add="handleAddRoomFast"
              @closeModal="isRoomFastModal = !isRoomFastModal"
            ></roomFast>
          </button>
        </div>
      </div>
    </div>
    <!-- componment box -->
    <Box
      v-if="data.isActiveBoarding"
      class="ml-3 mb-3"
      :_idBoarding="data.isActiveBoarding"
      :currentPage="data.currentPage"
      :status="data.isStatus"
      :searchText="data.searchText"
      @handleDelete="handleEdit"
      @edit="
        (value) => {
          isEditRoomModal = !isEditRoomModal;
          data.isActiveRoom = value;
        }
      "
      @view="
        (value) => {
          isViewModal = !isViewModal;
          data.isActiveRoom = value;
        }
      "
      @addCutomer="
        (value) => {
          isAddCustomerModal = !isAddCustomerModal;
          data.isActiveRoom = value;
        }
      "
      @out="handleEdit"
      @totalPage="
        (value) => {
          data.totalPage = value.totalPage;
          data.length = value.length;
        }
      "
    ></Box>

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
    <Edit
      v-if="isEditRoomModal"
      :_id="data.isActiveRoom"
      @edit="handleEdit"
    ></Edit>
    <View v-if="isViewModal" :_id="data.isActiveRoom"></View>
    <ViewStatus v-if="isViewModal" :_id="data.isActiveRoom"> </ViewStatus>
    <addCustomer
      v-if="isAddCustomerModal"
      :_id="data.isActiveRoom"
      @changeStatus="
        (value) => {
          handleEdit();
        }
      "
    ></addCustomer>
  </div>
</template>
<style scope>
.body {
  min-height: 240vh;
}
.border-radius {
  border: 1px solid #eae6e6;
  border-radius: 5px;
  min-height: 50px;
}

.plus:hover > * {
  text-shadow: 0 0 2px #ffff;
}
.boarding > * {
  height: 36px;
  margin-top: 6px;
  background-color: var(--chocolate);
  color: var(--white);
}
.isActiveBoarding {
  background-color: var(--ruby);
  text-shadow: 0 0 2px #fff;
}
.board-item {
  position: relative;
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  text-align: center;
  line-height: 0;
  min-width: 80px;
}
.delete-icon {
  position: absolute;
  cursor: pointer;
  background-color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
}
.delete-icon {
  top: -10px;
  right: -16px;
  color: var(--red);
}

.board-item:hover {
  color: var(--white);
  text-shadow: 0 0 2px #fff;
}
.board-item:hover .delete-icon {
  opacity: 1;
  font-weight: 500;
}
.delete-icon:hover {
  color: red;
}
.delete-icon-add {
  position: absolute;
  top: -4px;
  right: -2px;
  color: var(--red);
  font-size: 1.1rem;
  cursor: pointer;
  background-color: #dfd4d4;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 1rem;
  text-align: center;
  line-height: 1;
  opacity: 1;
}
.delete-icon-add:hover {
  color: red;
  font-size: 1.2rem;
  font-weight: 600;
}
.select {
  background-color: var(--background);
}
</style>
