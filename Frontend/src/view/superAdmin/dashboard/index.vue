<script>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import VueApexCharts from "vue3-apexcharts";

//service
import receiptService from "../../../service/receipt.service";
//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
//component
import Select from "../../../components/select/select.vue";
import Box from "./box.vue";
export default {
  components: { apexchart: VueApexCharts, Select, Box },
  setup() {
    const router = useRouter();
    const data = reactive({
      selectDate: new Date(),
      profit: { receipt: 0, expense: 0 },
    });
    let intervalId = null;
    //   Đếm hệ thống có bao nhiêu người có vai trò admin, đếm nhà trọ ở boardingHouse, đếm room, đếm vai trò user
    // -Biểu đồ thống kê doanh thu theo quý, (tính tổng doanh thu từ việc thu tiền từ hệ thống mặc định sẽ là quý hiện tại 7 8 9) với 2 select 1 là quý và 1 là năm
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
        // thu
        let documentReceipt = await receiptService.getAll();
        console.log(documentReceipt.message);
        documentReceipt = documentReceipt.message.filter((item) => {
          const date = new Date(item.updatedAt);
          if (item.billUserId) {
            if (
              data.selectDate.getMonth() + 1 == date.getMonth() + 1 &&
              data.selectDate.getFullYear() == date.getFullYear()
            ) {
              console.log(item, data.profit.receipt);
              data.profit.receipt =
                Number(data.profit.receipt) + Number(item.receive);
            }
            return (
              data.selectDate.getMonth() + 1 == date.getMonth() + 1 &&
              data.selectDate.getFullYear() == date.getFullYear()
            );
          }
        });
        console.log(data.profit.receipt);
        chartSeriesProfit.data[0] = {
          name: "Thu (đ)",
          data: [data.profit.receipt],
        };
        // chartSeriesProfit.data[1] = {
        //   name: "Chi (đ)",
        //   data: [data.profit.expense],
        // };
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

    const refresh = async () => {
      try {
        await chartProfit();
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

      data.selectDate = new Date();
      await refresh();
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,

      chartOptionsProfit,
      chartSeriesProfit,

      handleDate,
    };
  },
};
</script>

<template>
  <div class="body m-0">
    <!-- box -->
    <Box></Box>
    <!-- chart -->
    <div>
      <div class="border-radius row m-0 justify-content-end">
        <input
          type="month"
          class="col-2 mt-2 mr-3 select py-0"
          style="border: solid 1px #ccc; border-radius: 4px; height: 34px"
          @input="handleDate"
        />
      </div>
      <div class="border-radius my-3 row m-0 justify-content-start">
        <div class="col-md-12 col-12 border-radius">
          <h6 class="text-center title">
            Biểu đồ thể hiện doanh thu của hệ thống quản lý tháng
            {{ data.selectDate.getMonth() + 1 }}/{{
              data.selectDate.getFullYear()
            }}
          </h6>
          <apexchart
            :options="chartOptionsProfit"
            :series="chartSeriesProfit.data"
            height=""
          />
        </div>
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
