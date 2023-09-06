<script>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed,
  readonly,
} from "vue";
import { useRoute, useRouter } from "vue-router";
//service
import boardinghouseService from "../../../service/boardinghouse.service";
import roomService from "../../../service/room.service";
import mediaService from "../../../service/media.service";

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
import BoardingForm from "./addBoarding.form.vue";

import Rule from "./addRules.form.vue";
import Box from "./box.vue";
//
import roomForm from "./add.vue";
import Edit from "./edit.vue";
export default {
  components: { Select, BoardingForm, roomForm, Box, Rule, Edit },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      items: {
        name: "",
        area: "",
        price: "",
      },
      boarding: [],
      room: {},
      medias: [],
      status: [
        { _id: false, name: "Chưa thuê" },
        { _id: true, name: "Đã thuê" },
      ],
      fee: [
        {
          _id: false,
          name: "Chưa thanh toán",
        },
        { _id: true, name: "Đã thanh toán" },
      ],
      isActiveBoarding: "",
      roomId: "",
    });
    const component = reactive({
      isBoardingModal: false,
      isRuleModal: false,
      isEditRoomModal: false,
    });
    let intervalId = null;
    const changeStatus = (value) => {
      console.log("Status:", value);
    };
    const changefee = (value) => {
      console.log("Status:", value);
    };
    // const create = async () => {
    //   await refreshBoarding();
    // };
    const refresh = async () => {
      try {
        const document = await boardinghouseService.getAll(); // api getAll borading houses
        data.boarding = document.message;
        data.isActiveBoarding = data.boarding[0]._id;
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
    const refreshBoarding = async () => {
      const document = await boardinghouseService.getAll();
      data.boarding = document.message;
    };
    const refreshRoom = async () => {
      try {
        const documentRoom = await roomService.getAll(); //api getAll rooms
        data.items = documentRoom.message;
        //filter rooms of a boarding house
        data.items = data.items.filter(
          (item) => item.boardingId == data.isActiveBoarding
        );
        // const documentMedia= await mediaService.get()
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
    const handleEdit = async (value) => {
      console.log(`value:`, value);
      data.roomId = value;
      component.isEditRoomModal = !component.isEditRoomModal;
      const documentRoom = await roomService.get(value);
      data.room = documentRoom.message;
      const documentMedia = await mediaService.get(value);
      data.medias = documentMedia.message;
    };
    onMounted(async () => {
      await refresh();

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

      changeStatus,
      changefee,
      // create,
      handleDeleteClick,
      handleEdit,
      roomService,
    };
  },
};
</script>
<template>
  <div class="body m-0">
    <!-- Status  and fee-->
    <div class="border-radius my-3 row m-0 justify-content-start">
      <div class="input-group col-2 align-items-center">
        <Select
          :title="`Trạng thái phòng`"
          :data="data.status"
          @choose="(value) => changeStatus(value)"
        ></Select>
      </div>
      <div class="input-group col-2 align-items-center">
        <Select
          :title="`Tiền phòng`"
          :data="data.fee"
          @choose="(value) => changefee(value)"
        ></Select>
      </div>
      <!-- btn add boarding house -->
      <div class="col-8 mr-1 p-0 row justify-content-end">
        <div
          class="mr-1"
          @click="component.isBoardingModal = !component.isBoardingModal"
        >
          <button
            class="btn btn-primary p-0"
            style="width: 103px; height: 36px; margin-top: 6px"
            data-toggle="modal"
            data-target="#boardingModal"
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
        <BoardingForm
          v-if="component.isBoardingModal"
          @add="
            async () => {
              await refreshBoarding();
            }
          "
          @closeModal="component.isBoardingModal = !component.isBoardingModal"
        ></BoardingForm>

        <!-- btn add rules -->
        <div class="" @click="component.isRuleModal = !component.isRuleModal">
          <button
            class="btn btn-primary p-0 mr-0"
            style="width: 103px; height: 36px; margin-top: 6px"
            data-toggle="modal"
            data-target="#ruleModal"
          >
            <div class="row justify-content-center">
              <span
                class="material-symbols-outlined"
                style="color: var(--white)"
              >
                post_add
              </span>
              <span style="color: var(--white)">Quy định</span>
            </div>
          </button>
        </div>
        <!-- component add rules -->
        <Rule
          v-if="component.isRuleModal"
          @closeModal="component.isRuleModal = !component.isRuleModal"
        ></Rule>
      </div>
    </div>
    <!-- Boarding house items -->
    <div class="border-radius my-3 mx-0 row justify-content-end">
      <div class="col-8 boarding">
        <button
          class="btn px-2 mr-1 board-item"
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
            class="delete-icon"
            @click.stop="handleDeleteClick(value._id, value.name)"
          >
            x
            <!--click.stop not parent element -->
          </span>
        </button>
      </div>
      <!-- btn add room -->
      <div class="col-4">
        <button
          class="btn btn-primary p-0 mr-1"
          style="width: 34%; height: 36px; margin-top: 6px"
          data-toggle="modal"
          data-target="#roomModal"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              holiday_village
            </span>
            <span style="color: var(--white)">Thêm phòng</span>
          </div>
        </button>
        <!-- compomnent add room -->
        <roomForm
          :boarding="data.boarding"
          @add="
            async () => {
              console.log(`đã thêm phòng trọ mới`);
              await refreshRoom();
            }
          "
        ></roomForm>

        <!-- btn edit room -->
        <button
          class="btn btn-warning p-0 mr-1"
          style="width: 34%; height: 36px; margin-top: 6px"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              construction
            </span>
            <span style="color: var(--white)">Sửa phòng</span>
          </div>
        </button>
      </div>
    </div>
    <!-- componment -->
    <!-- Box rooms have icon click delete and edit -->
    <Box
      class="m-2"
      :data="data.items"
      @handleDelete="refreshRoom()"
      @edit="(value) => handleEdit(value)"
    ></Box>

    <Edit
      v-if="component.isEditRoomModal"
      :dataProps="data.room"
      :medias="data.medias"
      :boarding="data.boarding"
      :_id="data.roomId"
      @edit="
        async () => {
          await refreshRoom();
        }
      "
    ></Edit>
  </div>
</template>
<style scope>
.body {
  min-height: 100vh;
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
  top: -10px;
  right: -4px;
  cursor: pointer;
  background-color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.board-item:hover {
  color: var(--white);
  text-shadow: 0 0 2px #fff;
}
.board-item:hover .delete-icon {
  opacity: 1;
  color: var(--red);
  font-weight: 500;
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
  text-align: center;
  line-height: 1;
  opacity: 1;
}
.delete-icon-add:hover {
  color: red;
  font-size: 1.2rem;
  font-weight: 600;
}
</style>
