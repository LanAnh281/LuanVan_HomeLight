<script>
import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

//service
import bill_userService from "../../../service/bill_user.service";
//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
import { formatCurrency } from "../../../assets/js/format.common";
//component
import Select from "../../../components/select/select.vue";
import Table from "../../../components/table/table.vue";
import Pagination from "../../../components/pagination/pagination.vue";
// import Payment from "./addReceipt.vue";
import View from "./view.vue";
export default {
  components: {
    Select,
    Table,
    Pagination,
    //  Payment,
    View,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      item: [], //list
      totalPage: 0,
      currentPage: 1,
      sizePage: 10,
      setPage: [],
      length: 0,
      selectDate: { month: "", year: "" },
      boarding: [{}],
      boardingActice: "",
      isInput: true,
      activeBill: "",
      fee: [
        {
          _id: true,
          name: "Chưa thanh toán",
        },
        { _id: false, name: "Đã thanh toán" },
      ],
    });
    let intervalId = null;
    const selectFee = ref("true"); //chưa thanh toán
    // -DS hóa đơn (các hóa đơn đã thu và chưa thu từ việc thuê website quản lý)
    const ispayments = ref(false);
    const isView = ref(false);

    data.totalPage = computed(() => {
      return data.item.length > 0
        ? Math.ceil(data.item.length / data.sizePage)
        : 0;
    });
    data.length = computed(() => data.item.length);
    data.setPage = computed(() => {
      // console.log(data.searchPage);
      return data.item
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
      await refresh();
    };

    const refresh = async () => {
      try {
        const documentBill = await bill_userService.getAll();
        data.item = documentBill.message;
        data.item = data.item.map((item) => {
          const content = item.content.split(" - ");
          return {
            ...item,
            serviceName: content[0],
            servicePrice: formatCurrency(Number(content[1])),
            serviceUnit: content[2],
            count: item.total / Number(content[1]),
            total: formatCurrency(item.total),

            isPaied:
              Number(item.receive) == Number(item.total) ? "true" : "false", // true :chưa thanh toán,  false: đã thanh toán
          };
        });

        data.item = data.item.filter((value) => {
          const date = new Date(value.createdAt);

          return (
            data.selectDate.month == date.getMonth() + 1 &&
            data.selectDate.year == date.getFullYear() &&
            selectFee.value != value.isPaied
          );
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

    const handlefee = async (value) => {
      selectFee.value = value;
      await refresh();
    };
    onMounted(async () => {
      await checkAccessToken(router); //access token
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
      //khởi tạo selectDate là ngày hiện tại
      const date = new Date();
      data.selectDate = {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };

      await refresh();
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,
      selectFee,
      refresh,
      handleDate,
      ispayments,
      isView,
      handlefee,
    };
  },
};
</script>
<template>
  <div class="body m-0">
    <div class="border-radius mb-3 row m-0 p-0 justify-content-start">
      <div class="mt-1 mb-1 ml-3 mr-1">
        <input
          type="month"
          @input="handleDate"
          class="border rounded py-1 text-center"
          style="height: 36px; background-color: var(--background)"
        />
      </div>
      <div class="input-group col-2 m-0 align-items-center p-0 mr-1">
        <Select
          :title="`Thanh toán`"
          :data="data.fee"
          :selected="true"
          @choose="(value) => handlefee(value)"
          style="height: 36px; background-color: var(--background)"
        ></Select>
      </div>
    </div>
    <div>
      <h5 class="my-3 title text-center">
        Danh sách hóa đơn quản lý tháng {{ data.selectDate.month }}/{{
          data.selectDate.year
        }}
      </h5>
      <Table
        class="text-center mt-2"
        :data="data.setPage"
        :fields="[
          'Tên chủ trọ',
          'Số lượng phòng',
          'Đơn giá (₫)',
          'Thành tiền (₫)',
        ]"
        :titles="['username', 'count', 'servicePrice', 'total']"
        :currentPage="data.currentPage"
        :sizePage="data.sizePage"
        :action="true"
        :actionList="['visibility']"
        :isInput="data.isInput"
        :name="'Bill'"
        @visibility="
          (value) => {
            isView = !isView;
            data.activeBill = value;
          }
        "
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

    <View
      v-if="isView"
      :_id="data.activeBill"
      @closeModal="isView = !isView"
    ></View>
  </div>
</template>
<style scoped>
.body {
  height: 100vh; /* Đặt chiều cao cho .body theo chiều cao của viewport */
  overflow: auto; /* Cho phép nội dung trượt khi vượt quá chiều cao của .body */
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
.select {
  background-color: var(--background);
}
</style>
