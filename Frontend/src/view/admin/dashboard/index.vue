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
import VueApexCharts from "vue3-apexcharts";

//service
import boardinghouseService from "../../../service/boardinghouse.service";
import roomService from "../../../service/room.service";

import userService from "../../../service/user.service";
import receiptService from "../../../service/receipt.service";
import spendingService from "../../../service/spending.service";
import UtilityReadingsService from "../../../service/UtilityReadings.service";
//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
//component
import Select from "../../../components/select/select.vue";
import Box from "./box.vue";
export default {
  components: { apexchart: VueApexCharts, Select, Box },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      boarding: [],
      selectBoarding: "",
      selectDate: new Date(),
      //1
      roomList: [],
      roomStatusList: { rentedRooms: 0, notRentedRooms: 0 },
      //2
      customerList: [],
      customer: { new: 0, total: 0 },
      //3
      profit: { receipt: 0, expense: 0 },
      //4
      ElectricWater: { electric: 0, water: 0 },
    });
    // const now = new Date();

    let intervalId = null;
    //Biểu đồ 1
    const roomStatus = reactive({
      chart: {
        type: "pie", // Thay đổi loại biểu đồ thành "line"
      },
      labels: ["Chưa thuê", "Đã thuê"],
      // series: ["a", 50],
      colors: ["#FFDD94", "#FD8F52", "#FFd700", "#FFC125", "#EEAD0F"],
    });
    const roomStatusSeries = ref([]);
    const chartRoomStatus = async () => {
      try {
        roomStatusSeries.value[0] = 0;
        data.roomStatusList["notRentedRooms"] = 0;
        roomStatusSeries.value[1] = 0;
        data.roomStatusList["rentedRooms"] = 0;
        data.roomList = await roomService.getAll();
        data.roomList = data.roomList.message;
        data.roomList = data.roomList.filter((item) => {
          if (item.boardingId === data.selectBoarding) {
            if (item.status === true) {
              data.roomStatusList.rentedRooms++;
            } else {
              data.roomStatusList.notRentedRooms++;
            }
          }
        });
        if (data.roomStatusList["notRentedRooms"] == 0) {
          roomStatusSeries.value[0] = 1;
        } else {
          roomStatusSeries.value[0] = data.roomStatusList["notRentedRooms"];
          roomStatusSeries.value[1] = data.roomStatusList["rentedRooms"];
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
    //Biểu đổ 2
    const chartCustomer = async () => {
      try {
        data.customerList = await userService.getAllTenant("Landord");
        data.customerList = data.customerList.message;
        data.customer.total = data.customerList.length;
        for (let value of data.customerList) {
          const date = new Date(value.updatedAt);
          if (
            date.getMonth() + 1 == data.selectDate.getMonth() + 1 &&
            date.getFullYear() == data.selectDate.getFullYear()
          ) {
            data.customer.new++;
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

    //Biểu đồ 3
    const chartOptionsProfit = reactive({
      chart: {
        id: "basic-bar",
        type: "bar",
      },
      xaxis: {
        categories: ["Tháng 9/2023"],
      },
      colors: ["rgb(255, 99, 132)", "#3300cc", "rgb(250, 90, 80)"],
    });
    const chartSeriesProfit = reactive({
      data: [
        {
          name: "Thu",
          data: [25],
        },
        {
          name: "Chi",
          data: [20],
        },
      ],
    });
    const chartProfit = async () => {
      try {
        data.profit = { receipt: 0, expense: 0 }; // thu và chi
        chartSeriesProfit.data = [{}];
        // tính khoảng chi của 1 nhà trọ đã chọn
        let documentSpending = await spendingService.getAll(); // lấy danh sách phiếu thu
        documentSpending = documentSpending.message.filter((item) => {
          const date = new Date(item.updatedAt);
          //Thời gian đã chọn == tgian trong csdl và đúng nhà trọ đang chọn
          if (
            data.selectDate.getMonth() + 1 == date.getMonth() + 1 &&
            data.selectDate.getFullYear() == date.getFullYear() &&
            item.boardingId == data.selectBoarding
          ) {
            data.profit.expense += Number(item.price); // tính tổng chi phí đã chi
          }
          return (
            data.selectDate.getMonth() + 1 == date.getMonth() + 1 &&
            data.selectDate.getFullYear() == date.getFullYear() &&
            item.boardingId == data.selectBoarding
          );
        });

        // thu
        let documentReceipt = await receiptService.getAll(); // lấy danh sách phiếu thu
        documentReceipt = documentReceipt.message.filter((item) => {
          const date = new Date(item.createdAt);
          // lọc lấy danh sách những phiếu thu đã tạo trong tháng,
          // do khi tạo hóa đơn cũng đồng thời tạo 1 phiếu thu với receive là 0đ
          if (item.Bill) {
            if (
              item.Bill.Room.boardingId == data.selectBoarding &&
              data.selectDate.getMonth() + 1 == date.getMonth() + 1 &&
              data.selectDate.getFullYear() == date.getFullYear()
            ) {
              data.profit.receipt =
                Number(data.profit.receipt) + Number(item.receive);
            }
            return (
              item.Bill.Room.boardingId == data.selectBoarding &&
              data.selectDate.getMonth() + 1 == date.getMonth() + 1 &&
              data.selectDate.getFullYear() == date.getFullYear()
            );
          }
        });
        chartSeriesProfit.data[0] = {
          name: "Thu (đ)",
          data: [data.profit.receipt],
        };
        chartSeriesProfit.data[1] = {
          name: "Chi (đ)",
          data: [data.profit.expense],
        };
        chartOptionsProfit.xaxis.categories[0] = `Tháng ${
          data.selectDate.getMonth() + 1
        }/ ${data.selectDate.getFullYear()}`;
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
    // biểu đồ 4
    const chartOptionsEW = reactive({
      chart: {
        id: "basic-bar",
        type: "bar",
      },
      xaxis: {
        categories: ["Tháng 9/2023"],
      },
      colors: ["rgb(250, 90, 80)", "#0209aa", "rgb(250, 90, 80)"],
    });
    const chartSeriesEW = reactive({
      data: [
        {
          name: "Điện",
          data: [],
        },
        {
          name: "Nước",
          data: [],
        },
      ],
    });
    const chartEW = async () => {
      try {
        data.ElectricWater = { electric: 0, water: 0 };
        chartSeriesEW.data = [{}];
        let documentEW = await UtilityReadingsService.getAll();
        documentEW = documentEW.message.filter((item) => {
          const date = new Date(item.date);
          if (
            item.Room.boardingId == data.selectBoarding &&
            date.getMonth() + 1 == data.selectDate.getMonth() + 1 &&
            date.getFullYear() == data.selectDate.getFullYear()
          ) {
            data.ElectricWater.electric =
              data.ElectricWater.electric +
              (item.currentElectric - item.previousElectric);
            data.ElectricWater.water =
              data.ElectricWater.water +
              (item.currentWater - item.previousWater);
          }
        });

        chartSeriesEW.data[0] = {
          name: "Điện (Kwh)",
          data: [data.ElectricWater.electric],
        };
        chartSeriesEW.data[1] = {
          name: "Nước (m³)",
          data: [data.ElectricWater.water],
        };
        chartOptionsEW.xaxis.categories[0] = `Tháng ${
          data.selectDate.getMonth() + 1
        }/ ${data.selectDate.getFullYear()}`;
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
    const refresh = async () => {
      try {
        await chartRoomStatus();
        // await chartCustomer();
        await chartProfit();
        // await chartEW();
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
      () => data.selectBoarding,
      async (newValue, oldValue) => {
        if (oldValue == "") return;
        await refresh();
      }
    );
    const handleDate = async (value) => {
      try {
        data.selectDate = new Date(value.target.value);
        await refresh();
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
      const documnetBoarding = await boardinghouseService.getAllUser();
      data.boarding = documnetBoarding.message;
      if (data.boarding.length > 0) {
        data.selectBoarding = data.boarding[0]._id;
      }
      data.selectDate = new Date();
      await refresh();
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,
      // now,
      //1
      roomStatus,
      roomStatusSeries,
      //2
      //3
      chartOptionsProfit,
      chartSeriesProfit,
      // 4.
      chartOptionsEW,
      chartSeriesEW,
      //
      handleDate,
    };
  },
};
</script>

<template>
  <div class="body m-0">
    <!-- box -->
    <div>
      <Box></Box>
    </div>
    <!-- chart -->
    <div>
      <div class="border-radius row m-0 justify-content-end">
        <input
          type="month"
          class="col-2 mt-2 mr-3 select py-0"
          style="border: solid 1px #ccc; border-radius: 4px; height: 34px"
          @input="handleDate"
        />
        <Select
          class="col-1 mt-2 mr-3 select"
          :title="'Chọn nhà trọ'"
          :data="data.boarding"
          :selected="data.selectBoarding"
          @choose="(value) => (data.selectBoarding = value)"
        ></Select>
      </div>
      <div class="border-radius my-3 row m-0 justify-content-start">
        <div class="col-md-6 col-12 border-radius">
          <h6 class="text-center title">Biểu đồ thể hiện trạng thái phòng</h6>
          <apexchart
            :options="roomStatus"
            :series="roomStatusSeries"
            height="300"
          />
        </div>
        <!-- <div class="input-group col-6 m-0 p-0 row border-radius">
        <img
          class="card-img-top"
          src="../../../assets/image/users.jpg"
          style="width: 50%; height: 60%; display: inline; align-item: center"
          alt="ảnh người dùng"
        />
        <p class="card-text" style="width: 50%; display: inline">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
      </div> -->
        <div class="col-md-6 col-12 border-radius">
          <h6 class="text-center title">
            Biểu đồ thể hiện doanh thu và chi phí của nhà trọ tháng
            {{ data.selectDate.getMonth() + 1 }}/{{
              data.selectDate.getFullYear()
            }}
          </h6>
          <apexchart
            :options="chartOptionsProfit"
            :series="chartSeriesProfit.data"
            height="400"
          />
        </div>
        <!-- <div class="col-6 border-radius mt-3">
        Biểu đồ thể hiện điện nước tiêu thụ
        <apexchart
          :options="chartOptionsEW"
          :series="chartSeriesEW.data"
          height="400"
        />
      </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.body {
  min-height: 110vh;
}
.select {
  background-color: var(--background);
}
</style>
