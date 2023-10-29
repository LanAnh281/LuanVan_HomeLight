<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount } from "vue";
// services
import bill_userService from "../../../service/bill_user.service";
import payService from "../../../service/pay.service";
//component
import Table from "../../../components/table/table.vue";
import paginationVue from "../../../components/pagination/pagination.vue";

//js
import {
  formatCurrency,
  formatDateTime,
} from "../../../assets/js/format.common";
export default {
  components: { Table, paginationVue },
  setup() {
    const data = reactive({
      item: [],
      selectDate: new Date(),
      active: "billUser",
      setPage: [],

      searchText: "",

      setPage: [],
      sizePage: 10,
      currentPage: 1,
      totalPage: 0,
      length: 0,
    });
    data.length = computed(() => (data.item ? data.item.length : 0));

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
    const now = new Date();
    const refresh = async () => {
      try {
        const document = await bill_userService.getAllUser();
        data.item = document.message;
        // data.item = data.item.filter((item) => {
        //   const date = new Date(item.createdAt);
        //   return (
        //     date.getMonth() + 1 == data.selectDate.getMonth() + 1 &&
        //     date.getFullYear() == data.selectDate.getFullYear()
        //   );
        // });

        data.item = data.item.map((item) => {
          return {
            ...item,
            createdAt: formatDateTime(item.createdAt),
            receive: formatCurrency(item.receive),
          };
        });
        // console.log(data.item);
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
        console.log("Ngày đã chọn", value.target.value);
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
    const numberToWords = (num) => {
      const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];
      const words = [
        "",
        "một",
        "hai",
        "ba",
        "bốn",
        "năm",
        "sáu",
        "bảy",
        "tám",
        "chín",
      ];
      const teens = [
        "mười",
        "mười một",
        "mười hai",
        "mười ba",
        "mười bốn",
        "mười năm",
        "mười sáu",
        "mười bảy",
        "mười tám",
        "mười chín",
      ];

      const convertChunk = (num) => {
        if (num === 0) return "";
        if (num < 10) return words[num];
        if (num < 20) return teens[num - 10];
        const ten = Math.floor(num / 10);
        const one = num % 10;
        return words[ten] + " mươi" + (one ? ` ${words[one]}` : "");
      };

      const convertGroup = (num, index) => {
        if (num === 0) return "";
        if (num < 1000) {
          return `${convertChunk(num)} ${units[index]}`;
        }
        const hundred = Math.floor(num / 100);
        const remainder = num % 100;
        if (remainder === 0) {
          return `${words[hundred]} trăm ${units[index]}`;
        }
        return `${words[hundred]} trăm ${convertChunk(remainder)} ${
          units[index]
        }`;
      };

      if (num === 0) return "Không đồng";

      let result = "";
      let chunkIndex = 0;

      while (num > 0) {
        const chunk = num % 1000;
        if (chunk !== 0) {
          result = convertGroup(chunk, chunkIndex) + " " + result;
        }
        num = Math.floor(num / 1000);
        chunkIndex++;
      }

      return result.trim() + " đồng";
    };

    onBeforeMount(async () => {
      try {
        data.selectDate = new Date();
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
    });
    return {
      handleDate,
      data,
      formatCurrency,
      formatDateTime,
      numberToWords,
    };
  },
};
</script>

<template>
  <div class="body container-fluid m-0 pr-5">
    <!-- <div class="row m-0 text-center mt-2">
      <div class="input-group col-2">
        <input
          type="month"
          @input="handleDate"
          class="p-1 w-100"
          style="background-color: var(--background); border: 1px solid #ebebeb"
        />
      </div>
    </div> -->
    <h4 class="text-center title my-3">Lịch sử thanh toán</h4>
    <Table
      :data="data.setPage"
      :fields="['Mã phiếu thu', 'Ngày thu', 'Số tiền']"
      :titles="['_id', 'createdAt', 'receive']"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      :action="false"
      :isInputChecked="false"
    >
    </Table>
    <paginationVue
      class="mt-3"
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
  height: 150vh;
}
</style>
