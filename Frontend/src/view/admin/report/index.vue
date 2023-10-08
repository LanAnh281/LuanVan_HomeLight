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

import userService from "../../../service/user.service";
import receiptService from "../../../service/receipt.service";
import spendingService from "../../../service/spending.service";
import UtilityReadingsService from "../../../service/UtilityReadings.service";

//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
import {
  formatDateTime,
  formatCurrency,
} from "../../../assets/js/format.common";
//component
import Select from "../../../components/select/select.vue";
import Box from "./box.vue";
import Table from "../../../components/table/table.vue";
export default {
  components: { Select, Box, Table },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      boarding: [],
      selectBoarding: { _id: "", name: "" },
      //
      choose: [
        { name: "Báo cáo thu chi " },
        { name: "a" },
        { name: "Báo cáo thu chi " },
        { name: "a" },
      ],
      selected: "",
      //
      start: "",
      end: "",
      item: [
        {
          receipt: 0,
          expense: 0,
          profit: 0,
          name: "",
        },
      ],
    });
    const now = new Date();
    let intervalId = null;
    const handleSpending = async (boardingId) => {
      // CHI
      let expense = 0;
      const documentSpending = await spendingService.getAll();
      const spending = documentSpending.message.filter((item) => {
        let date = new Date(item.date);
        if (
          date >= data.start &&
          date <= data.end &&
          item.boardingId == boardingId
        ) {
          expense = expense + Number(item.price);
          return item;
        }
      });
      return expense;
    };
    const handleReceipt = async (boardingId) => {
      let receipt = 0;
      let documentReceipt = await receiptService.getAll();
      documentReceipt = documentReceipt.message.filter((item) => {
        const date = new Date(item.updatedAt);
        if (
          date >= data.start &&
          date <= data.end &&
          item.Bill.Room.boardingId == boardingId
        ) {
          receipt += Number(item.receive);
          return item;
        }
      });
      return receipt;
    };
    const refresh = async () => {
      try {
        data.item = [];
        // so sánh giá trị selectBoarding =='all' hay khác all
        if (data.selectBoarding._id != "all") {
          // CHI PHÍ
          const expense = await handleSpending(data.selectBoarding["_id"]);
          //DOANH THU
          const receipt = await handleReceipt(data.selectBoarding["_id"]);

          data.item[0] = {
            receipt: receipt,
            expense: expense,
            profit: receipt - expense,
            name: data.selectBoarding["name"],
          };

          data.item[1] = {
            receipt: receipt,
            expense: expense,
            profit: receipt - expense,
            name: "Tổng",
          };
        } else {
          console.log("Tất cả");
          for (let value of data.boarding) {
            console.log(value);
            if (value._id == "all") continue;
            const receipt = await handleReceipt(value._id);
            const expense = await handleSpending(value._id);
            console.log(receipt);
            data.item.push({
              receipt: receipt,
              expense: expense,
              profit: receipt - expense,
              name: value.name,
            });
          }
          let totalReceipt = 0;
          let totalExpense = 0;

          for (let value of data.item) {
            console.log(value);
            totalReceipt = totalReceipt + Number(value.receipt);
            totalExpense = totalExpense + Number(value.expense);
          }
          data.item[data.item.length] = {
            receipt: totalReceipt,
            expense: totalExpense,
            profit: totalReceipt - totalExpense,
            name: "Tổng",
          };
        }
        data.item = data.item.map((item) => {
          return {
            ...item,
            receipt: formatCurrency(item.receipt),
            expense: formatCurrency(item.expense),
            profit: formatCurrency(item.profit),
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
    const handleStart = async (value) => {
      data.start = new Date(value.target.value);
      await refresh();
    };
    const handleEnd = async (value) => {
      data.end = new Date(value.target.value);
      await refresh();
    };
    const handleBoarding = (value) => {
      data.selectBoarding["_id"] = value;
      for (let item of data.boarding) {
        console.log(item);
        if (item._id == value) {
          data.selectBoarding["name"] = item.name;
          return;
        }
      }
    };

    watch(
      () => data.selectBoarding["_id"],
      async (newValue, oldValue) => {
        if (newValue == "") return;
        await refresh();
      }
    );
    onMounted(async () => {
      await checkAccessToken(router); //access token
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
      const documnetBoarding = await boardinghouseService.getAllUser();
      data.boarding = documnetBoarding.message;
      console.log(data.boarding);
      data.start = data.end = now;
      if (data.boarding.length > 0) {
        data.selectBoarding = {
          _id: data.boarding[0]._id,
          name: data.boarding[0].name,
        };
        data.boarding.push({ _id: "all", name: "Tất cả" });
      }

      data.selected = data.choose[0].name;
      await refresh();
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,
      handleStart,
      handleEnd,
      handleBoarding,
      formatDateTime,
    };
  },
};
/*
1.Báo cáo lời lỗ, số thu và số chi
2. ds khách nợ tiền phòng
3. doanh thu
*/
</script>
<template>
  <div class="body m-0">
    <div class="border-radius my-3 row m-0 justify-content-start">
      <label
        class="py-1 text-center mt-2 ml-3"
        style="height: 33px; background-color: var(--background)"
        >Từ
      </label>
      <input
        type="date"
        class="border rounded py-1 text-center col-2 mt-2 ml-1"
        style="height: 33px; background-color: var(--background)"
        @input="handleStart"
      />
      <label
        class="py-1 text-center mt-2 mx-1"
        style="height: 33px; background-color: var(--background)"
        >đến</label
      >
      <input
        type="date"
        class="border rounded py-1 text-center col-2 mt-2 mr-1"
        style="height: 33px; background-color: var(--background)"
        @input="handleEnd"
      />
      <Select
        class="col-1 mt-2 select"
        :title="'Chọn nhà trọ'"
        :data="data.boarding"
        :selected="data.selectBoarding['_id']"
        @choose="handleBoarding"
      ></Select>
    </div>

    <!-- <Box
      :data="data.choose"
      :selected="data.selected"
      @selected="
        (value) => {
          data.selected = value;
        }
      "
    ></Box> -->
    <h5 class="text-center">
      Báo cáo doanh thu và chi phí từ ngày {{ formatDateTime(data.start) }} đến
      {{ formatDateTime(data.end) }}
    </h5>
    <Table
      :data="data.item"
      :fields="['Tên nhà trọ', 'Doanh thu(₫)', 'Chi phi(₫)', 'Lãi(₫)']"
      :titles="['name', 'receipt', 'expense', 'profit']"
    >
    </Table>
  </div>
</template>
<style scoped>
.body {
  min-height: 150vh;
}
.select {
  background-color: var(--background);
}
</style>
