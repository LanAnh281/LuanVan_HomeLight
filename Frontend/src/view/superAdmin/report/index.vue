<!-- -Báo cáo doanh thu (báo cáo danh thu theo tháng) -->
<script>
import { reactive, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

//service
import reportService from "../../../service/report.service";
import receiptService from "../../../service/receipt.service";
import spendingService from "../../../service/spending.service";

//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
import {
  formatDateTime,
  formatCurrency,
} from "../../../assets/js/format.common";
//component
import Select from "../../../components/select/select.vue";
import Table from "../../../components/table/table.vue";
import paginationVue from "../../../components/pagination/pagination.vue";

export default {
  components: { Select, Table, paginationVue },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
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
      setPage: [],
      currentPage: 1,
      sizePage: 10,
      length: 0,
      totalPage: 0,
    });
    const now = new Date();
    let intervalId = null;
    data.length = computed(() => (data.item ? data.item.length : 0));
    data.totalPage = computed(() => {
      return data.item ? Math.ceil(data.item.length / data.sizePage) : 0;
    });

    data.setPage = computed(() => {
      return data.item
        ? data.item.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : [];
    });

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
    const handleReceipt = async () => {
      let receipt = 0;
      let documentReceipt = await receiptService.getAll();
      documentReceipt = documentReceipt.message.filter((item) => {
        const date = new Date(item.updatedAt);
        if (date >= data.start && date <= data.end) {
          receipt += Number(item.receive);
          return item;
        }
      });
      return receipt;
    };
    const refresh = async () => {
      try {
        data.item = [];
        let total = 0;
        //DOANH THU
        const documentReceipt = await reportService.getAll();
        console.log(documentReceipt.message);
        data.item = documentReceipt.message;
        let i = 0;
        for (let value of data.item) {
          // tìm trong ds hóa đơn có phiếu thu không ? và có hóa đơn nằm trong khoảng thời gian đang tìm kiếm
          const Bill_Users = value.Bill_Users.filter((item) => {
            total = 0;
            const date = new Date(item.createdAt);

            if (
              date >= data.start &&
              date <= data.end &&
              item.Receipt != null
            ) {
              total = Number(total) + Number(item.Receipt.receive);
              console.log("lợi nhuận", total);
              item.profit = total;
              return item;
            }
          });
          console.log(Bill_Users, Bill_Users["profit"]);
          // if (total > 0) {
          data.item[i].Bill_Users.profit = Bill_Users.profit;
          // data.item[i].Bill_Users.profit=0;
          // }

          i++;
        }

        console.log(data.item);
        // data.item[0] = {
        //   receipt: total,
        //   name: "a",
        // };

        // data.item[1] = {
        //   receipt: total,
        //   name: "Tổng",
        // };

        // data.item = data.item.map((item) => {
        //   return {
        //     ...item,
        //     receipt: formatCurrency(item.receipt),
        //   };
        // });
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

    onMounted(async () => {
      await checkAccessToken(router); //access token
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes

      data.start = data.end = now;

      await refresh();
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,
      handleStart,
      handleEnd,
      formatDateTime,
    };
  },
};
</script>
<template>
  <div class="body m-0">
    <div class="border-radius mb-3 row m-0 justify-content-start">
      <label
        class="py-1 text-center mt-2 ml-3"
        style="height: 33px; background-color: var(--background)"
        >Từ
      </label>
      <input
        type="date"
        class="border rounded py-1 text-center col-1 mt-2 ml-1"
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
        class="border rounded py-1 text-center col-1 mt-2 mr-1"
        style="height: 33px; background-color: var(--background)"
        @input="handleEnd"
      />
    </div>

    <h5 class="text-center">Báo cáo doanh thu</h5>
    <h6 class="text-center mb-3">
      từ ngày {{ formatDateTime(data.start) }} đến
      {{ formatDateTime(data.end) }}
    </h6>
    <Table
      :data="data.setPage"
      :fields="['Tên chủ trọ', 'Doanh thu(₫)']"
      :titles="['name', 'receipt']"
    >
    </Table>
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
<!-- 
  Thông kê doanh thu của hệ thống
  - Thông kê doanh thu qua bảng phiếu thu 1 phiếu thu của 1 người, k tốt
  - Thông kê ds phiếu thu của 1 người từ ngày đến ngày , thực hiện controller user, thống kê doanh thu
  
 -->
