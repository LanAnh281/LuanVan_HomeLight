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

//service
import boardinghouseService from "../../../service/boardinghouse.service";
import roomService from "../../../service/room.service";
import cycleService from "../../../service/cycle.service";
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
      item: [{ name: "", uti: { currentElectric: 0, currentWater: 0 } }], //list
      months: [
        { _id: 1, name: "Tháng 1" },
        { _id: 2, name: "Tháng 2" },
        { _id: 3, name: "Tháng 3" },
        { _id: 4, name: "Tháng 4" },
        { _id: 5, name: "Tháng 5" },
        { _id: 6, name: "Tháng 6" },
        { _id: 7, name: "Tháng 7" },
        { _id: 8, name: "Tháng 8" },
        { _id: 9, name: "Tháng 9" },
        { _id: 10, name: "Tháng 10" },
        { _id: 11, name: "Tháng 11" },
        { _id: 12, name: "Tháng 12" },
      ],
      monthCurrent: "",
      cycles: [{ name: "" }],
      boarding: [{}],
      boardingActice: "",
      cycle: "",
      totalPage: 1,
      currentPage: 1,
      sizePage: 2,
      setPage: [],
      length: 0,
    });
    let intervalId = null;
    data.totalPage = computed(() =>
      data.item ? Math.ceil(data.item.length / data.sizePage) : 0
    );

    data.setPage = computed(() =>
      data.item
        ? data.item.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : []
    );
    const handleMonth = (value) => {
      console.log(value);
      if (value == "''") {
        console.log("chọn tất cả");
      }
    };
    const handleCycle = (value) => {
      if (value == "''") {
        console.log("chọn tất cả");
      }
    };
    const getUti = async (id) => {
      const documentElectric = await utilityReadingsService.get(id);
      return documentElectric.message;
    };
    const refresh = async () => {
      try {
        //monthCurrent
        data.monthCurrent = new Date();
        data.monthCurrent = data.monthCurrent.getMonth() + 1;
        const documentCycle = await cycleService.getAll();
        //cycles
        data.cycles = documentCycle.message;
        data.cycle = data.cycles[0]._id;
        //boarding
        const documentBoarding = await boardinghouseService.getAll();
        data.boarding = documentBoarding.message;
        data.boardingActice = data.boarding[0]._id;
        //utilityreadings

        // room
        const documentRoom = await roomService.getAll();
        data.item = documentRoom.message;
        data.item = data.item.filter((value) => value.status == true);
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

        data.item = data.item.filter(
          (item) => item.boardingId == data.boardingActice
        );
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
      () => data.boardingActice,
      async (newValue, oldValue) => {
        const documentRoom = await roomService.getAll();
        data.item = documentRoom.message;
        data.item = data.item.map((item) => {
          return {
            ...item,
            previousElectric: 0,
            currentElectric: 0,
            previousWater: 0,
            currentWater: 0,
          };
        });
        data.item = data.item.filter(
          (item) => item.boardingId == data.boardingActice
        );
        data.length = data.item.length;
      }
    );
    const isNumber = (value) => {
      console.log(typeof value);
      return typeof value === "number";
    };
    const handleCreate = async (value) => {
      // data.item[0].date = new Date();
      // data.item[0].roomId = data.item[0]._id;
      // console.log("create", data.item[0]._id);
      console.log("create", value);
      try {
        value.date = new Date();
        value.roomId = value._id;
        const documentUti = await utilityReadingsService.create(value);
        console.log(documentUti);
        // for (let value of data.item) {
        //   if (value.currentElectric != 0 && value.currentWater != 0) {
        //     console.log(
        //       value,
        //       // isNumber(value.previousElectric),
        //       isNumber(value.currentElectric)
        //       // isNumber(value.previousWater),
        //       // isNumber(value.currentWater)
        //     );
        //     if (
        //       isNumber(value.previousElectric) &&
        //       isNumber(value.currentElectric) &&
        //       isNumber(value.previousWater) &&
        //       isNumber(value.currentWater)
        //     ) {
        //       console.log("Tất cả đều là số");
        //       value.date = new Date();
        //       value.roomId = value._id;
        //       const documentUti = await utilityReadingsService.create(value);
        //     }
        //   }
        //   // else {
        //   //   const isDelete = await deleted(
        //   //     "Cảnh báo",
        //   //     "Còn phòng chưa nhập chỉ số điện nước."
        //   //   );
        //   //   if (isDelete == true) {
        //   //     break;
        //   //   }
        //   // }
        // }
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
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,
      handleMonth,
      handleCycle,
      handleCreate,
    };
  },
};
</script>
<template>
  <div class="body m-0">
    <div class="border-radius my-3 row m-0 p-0 justify-content-start">
      <div class="input-group col-2 align-items-center m-0 mr-1 pr-0">
        <Select
          :title="`Tất cả`"
          :data="data.months"
          :selected="data.monthCurrent"
          @choose="(value) => handleMonth(value)"
        ></Select>
      </div>
      <div class="input-group col-1 m-0 align-items-center p-0">
        <Select
          :title="`Tất cả`"
          :data="data.cycles"
          :selected="data.cycle"
          @choose="(value) => handleCycle(value)"
        ></Select>
      </div>
      <!-- btn add boarding house -->
      <div class="col-9 mr-1 p-0 row justify-content-end">
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

        <div class="mr-1">
          <button
            class="btn btn-primary p-0 mr-0"
            style="width: 103px; height: 36px; margin-top: 6px"
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
        <!--  btn edit room -->
        <div class="">
          <button
            class="btn btn-warning"
            style="width: 118px; height: 36px; margin-top: 6px"
          >
            <div class="row justify-content-center plus">
              <span
                class="material-symbols-outlined mr-1"
                style="color: var(--white)"
              >
                edit
              </span>
              <span style="color: var(--white)">Sửa nhà trọ</span>
            </div>
          </button>
          <!-- component" -->
        </div>
        <!-- component  -->
      </div>
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
        'CS điện cũ',
        'CS điện mới',
        'CS nước cũ',
        'CS nước mới',
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
