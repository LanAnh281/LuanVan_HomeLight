<script>
import {
  ref,
  reactive,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  computed,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";

//service
import boardinghouseService from "../../../service/boardinghouse.service";
import billService from "../../../service/bill.service";
import roomService from "../../../service/room.service";
import utilityReadingsService from "../../../service/UtilityReadings.service";
//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
import { warning, deleted } from "../../../assets/js/common.alert";
//component
import Select from "../../../components/select/select.vue";
import Table from "../../../components/table/table.vue";
import Pagination from "../../../components/pagination/pagination.vue";
export default {
  components: { Select, Table, Pagination },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      item: [], //list
      totalPage: 0,
      currentPage: 1,
      sizePage: 2,
      setPage: [],
      length: 0,

      selectDate: { month: "", year: "" },
      boarding: [{}],
      boardingActice: "",
      isInput: true,
    });
    let intervalId = null;
    data.totalPage = computed(() => {
      return data.item.length > 0
        ? Math.ceil(data.item.length / data.sizePage)
        : 0;
    });

    data.setPage = computed(() => {
      return data.item.length > 0
        ? data.item.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : [];
    });

    const handleDate = async (value) => {
      const date = new Date(value.target.value);

      data.selectDate = {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };
    };

    const refresh = async () => {
      try {
        const documentBill = await billService.getAll();
        data.item = documentBill.message;
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
        if (oldValue == "") return;
        console.log(newValue);
      }
    );

    onMounted(async () => {
      await checkAccessToken(router); //access token
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
      //
      const date = new Date();
      data.selectDate = {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };
      const documentBoarding = await boardinghouseService.getAllUser();
      data.boarding = documentBoarding.message;
      data.boardingActice = data.boarding[0]._id;
      await refresh();
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,
      handleDate,
    };
  },
};
</script>
<template>
  <div class="body m-0">
    <div class="border-radius my-3 row m-0 p-0 justify-content-start">
      <div class="mt-1 mb-1 ml-3 mr-1">
        <input
          type="date"
          @input="handleDate"
          class="border rounded py-1 text-center"
          style="height: 39px"
        />
      </div>
      <div class="input-group col-1 m-0 align-items-center p-0"></div>

      <div class="col-9 mr-1 p-0 row justify-content-end"></div>
    </div>
    <div class="border-radius my-3 mx-0 row justify-content-start">
      <div class="col-8 boarding">
        <button
          class="btn px-2 mr-2 board-item"
          v-for="(value, index) in data.boarding"
          :key="index"
          :class="value._id == data.boardingActice ? 'isActiveBoarding' : ''"
          @click="
            async () => {
              data.boardingActice = value._id;
            }
          "
        >
          {{ value.name }}
        </button>
      </div>
    </div>
    <!-- <span>
      <span class="text-primary">(*)</span> Trước khi thực hiện lọc cần lưu giá
      trị điện nước trước.</span
    > -->

    <Table
      class="text-center mt-2"
      :data="data.setPage"
      :fields="[
        'Mã hóa đơn',
        'Phòng',
        'Tổng tiền(VNĐ)',
        'Đã trả(VNĐ)',
        'Còn lại(VNĐ)',
      ]"
      :titles="[
        'name',
        'previousElectric',
        'currentElectric',
        'previousWater',
        'currentWater',
      ]"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      :action="true"
      :actionList="['visibility', 'cancel', 'payments']"
      :isInput="data.isInput"
    ></Table>
    <Pagination
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
    ></Pagination>
  </div>
</template>
<style scoped>
.body {
  min-height: 100vh;
}
.boarding > * {
  height: 36px;
  margin-top: 6px;
  background-color: var(--chocolate);
  color: var(--white);
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
.isActiveBoarding {
  background-color: var(--ruby);
  text-shadow: 0 0 2px #fff;
}
</style>
