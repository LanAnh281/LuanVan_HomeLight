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
import roomService from "../../../service/room.service";
import utilityReadingsService from "../../../service/UtilityReadings.service";
//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
import { warning, deleted } from "../../../assets/js/common.alert";
//component
import Select from "../../../components/select/select.vue";
import Table from "../../../components/table/input.table.vue";
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
      //1. chọn tháng hiện tại, thì các căn trạng thái đang thuê chưa ghi chỉ số
      // => table input
      // if(current.month== month && current.year=year)=> table input
      // 2. chọn tháng và năm quá khứ thì table thường
      // if(current.month!=month && current.year!=year)=> table
      //1.8.2023
      // table input : phòng, 4 cs, save => dựa vào room xác định phòng đang thuê=> ghi chỉ số
      // table: phòng, 4 cs => dựa vào ulti => xác định phòng=> hiện chỉ số
      const current = new Date();
      // thời gian hiện tại== thời gian đã chọn
      if (
        current.getMonth() + 1 == data.selectDate.month &&
        current.getFullYear() == data.selectDate.year
      ) {
        // đùng thời gian hiện tại
        await refresh();
      } else {
        //quá khứ hoặc tương lai
        const documentUti = await utilityReadingsService.getAll();
        data.item = documentUti.message;
        data.item = data.item.filter((item) => {
          let date = new Date(item.date);
          return (
            date.getMonth() + 1 == data.selectDate.month &&
            date.getFullYear() == data.selectDate.year
          );
        });
        data.isInput = false;
      }
    };
    const getUti = async (id) => {
      const documentElectric = await utilityReadingsService.get(id);
      return documentElectric.message;
    };
    const refresh = async () => {
      try {
        // room
        const documentRoom = await roomService.getAll();
        data.item = documentRoom.message.filter((item) => {
          return (
            item.boardingId === data.boardingActice && item.status === true
          );
        });
        data.item = await Promise.all(
          data.item.map(async (item) => {
            return {
              ...item,
              currentElectric: 0,
              currentWater: 0,
              uti: await getUti(item._id),
            };
          })
        );
        data.item = data.item.map((item) => {
          return {
            ...item,
            previousElectric: item.uti ? item.uti["currentElectric"] : 0,
            previousWater: item.uti ? item.uti["currentWater"] : 0,
          };
        });

        data.length = data.item.length;

        data.isInput = true;
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
        // const documentRoom = await roomService.getAll();
        const current = new Date();
        // thời gian hiện tại== thời gian đã chọn

        if (
          current.getMonth() + 1 == data.selectDate.month &&
          current.getFullYear() == data.selectDate.year
        ) {
          // đùng thời gian hiện tại
          await refresh();
        } else {
          //quá khứ hoặc tương lai
          const documentUti = await utilityReadingsService.getAll();
          data.item = documentUti.message;
          data.item = data.item.filter((item) => {
            let date = new Date(item.date);

            return (
              date.getMonth() + 1 == data.selectDate.month &&
              date.getFullYear() == data.selectDate.year
            );
          });
          data.isInput = false;
        }
        data.length = data.item.length;
      }
    );

    const handleCreate = async (value) => {
      console.log("create", value);
      try {
        value.date = new Date();
        value.roomId = value._id;
        const documentUti = await utilityReadingsService.create(value);
        console.log(documentUti);
        // await refresh();
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
      handleCreate,
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
    <span>
      <span class="text-primary">(*)</span> Trước khi thực hiện lọc cần lưu giá
      trị điện nước trước.</span
    >

    <Table
      class="text-center mt-2"
      :data="data.setPage"
      :fields="[
        'Phòng',
        'CS điện cũ (Kwh)',
        'CS điện mới (Kwh)',
        'CS nước cũ (m³)',
        'CS nước mới (m³)',
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
      :actionList="['save']"
      :isInput="data.isInput"
      @save="handleCreate"
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
