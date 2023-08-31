<script>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
//service
import boardinghouseService from "../../../service/boardinghouse.service";
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
import BoardingForm from "../../../components/form/boarding.form.vue";
import Rule from "../../../components/form/rules.form.vue";
import Box from "../../../components/box/boarding.box.vue";

export default {
  components: { Select, BoardingForm, Box, Rule },
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
    });
    let intervalId = null;
    const isBoardingModal = ref(false);
    const isRuleModal = ref(false);

    const refresh = () => {};
    const changeStatus = (value) => {
      console.log("Status:", value);
    };
    const changefee = (value) => {
      console.log("Status:", value);
    };
    const create = async () => {
      await refreshBoarding();
    };
    const handleDeleteClick = async (id, name) => {
      console.log("xóa");
      try {
        const isDelete = await deleted(
          "Xóa nhà trọ",
          `Bạn có chắc chắn xóa nhà trọ ${name}`
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
    const refreshBoarding = async () => {
      const document = await boardinghouseService.getAll();
      data.boarding = document.message;
    };
    onMounted(async () => {
      await refreshBoarding();
      data.isActiveBoarding = data.boarding[0]._id;
      await checkAccessToken(router);
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,
      isBoardingModal,
      isRuleModal,
      changeStatus,
      changefee,
      create,
      handleDeleteClick,
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
      <div class="col-8 m-0 p-0 row justify-content-end">
        <div class="mr-1" @click="isBoardingModal = !isBoardingModal">
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

        <div class="m-0" @click="isRuleModal = !isRuleModal">
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
      </div>
    </div>
    <!-- Boarding -->
    <div class="border-radius my-3 mx-0 row justify-content-end">
      <div class="col-8 boarding">
        <button
          v-for="(value, index) in data.boarding"
          :key="index"
          class="btn px-2 mr-1 board-item"
          :class="value._id == data.isActiveBoarding ? 'isActiveBoarding' : ''"
          @click="
            () => {
              data.isActiveBoarding = value._id;
            }
          "
        >
          {{ value.name }}
          <span
            class="delete-icon"
            @click.stop="handleDeleteClick(value._id, value.name)"
          >
            x
          </span>
        </button>
      </div>
      <div class="col-4">
        <button
          class="btn btn-primary p-0 mr-1"
          style="width: 34%; height: 36px; margin-top: 6px"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              holiday_village
            </span>
            <span style="color: var(--white)">Thêm phòng</span>
          </div>
        </button>

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
    <div style="display: grid; grid-template-columns: repeat(3, 1fr)">
      <Box class="m-2"></Box>
      <Box class="m-2"></Box>
      <Box class="m-2"></Box>
      <Box class="m-2"></Box>
    </div>
    <!-- componment -->
    <BoardingForm
      v-if="isBoardingModal"
      @add="create"
      @closeModal="isBoardingModal = !isBoardingModal"
    ></BoardingForm>
    <Rule v-if="isRuleModal" @closeModal="isRuleModal = !isRuleModal"></Rule>
  </div>
</template>
<style scope>
.body {
  min-height: calc(100vh - var(--footer));
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
</style>
