<script>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
//service
//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";

//components
import Select from "../../../components/select/select.vue";
import BoardingForm from "../../../components/form/boarding.form.vue";
import Box from "../../../components/box/boarding.box.vue";

export default {
  components: { Select, BoardingForm, Box },
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
    });
    const refresh = () => {};
    const changeStatus = (value) => {
      console.log("Status:", value);
    };
    const changefee = (value) => {
      console.log("Status:", value);
    };
    let intervalId = null;
    const boardingModal = ref(false);
    const create = async (value) => {
      console.log("create new room", value);
      data.boarding.push({
        name: value.name,
        address: value.address,
        rules: value.rules,
      });
    };
    onMounted(async () => {
      await checkAccessToken(router);
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 30 * 60 * 1001); // 60000 milliseconds = 1 minutes
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return { data, boardingModal, changeStatus, changefee, create };
  },
};
</script>
<template>
  <div class="body m-0">
    <div class="border-radius my-3 row m-0 justify-content-between">
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
      <div
        class="col-2 ml-auto"
        style="right: -5.5%"
        @click="boardingModal = !boardingModal"
      >
        <button
          class="btn btn-primary p-0"
          style="width: 103px; height: 36px; margin-top: 6px"
          data-toggle="modal"
          data-target="#boardingModal"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              domain_add
            </span>
            <span style="color: var(--white)">Thêm nhà</span>
          </div>
        </button>
      </div>
    </div>
    <div class="border-radius my-3 mx-0 row justify-content-between">
      <div class="col-8">
        <button v-for="(value, index) in data.boarding" :key="index">
          {{ value.name }}
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
      <Box class="m-2"></Box>
      <Box class="m-2"></Box>
    </div>

    <BoardingForm
      v-if="boardingModal"
      @add="(value) => create(value)"
      @closeModal="boardingModal = !boardingModal"
    ></BoardingForm>
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
</style>
