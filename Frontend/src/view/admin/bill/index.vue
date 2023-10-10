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
import billService from "../../../service/bill.service";
import roomService from "../../../service/room.service";
import utilityReadingsService from "../../../service/UtilityReadings.service";
//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
import { formatCurrency } from "../../../assets/js/format.common";
//component
import Select from "../../../components/select/select.vue";
import Table from "../../../components/table/table.vue";
import Pagination from "../../../components/pagination/pagination.vue";
import Payment from "./addReceipt.vue";
import View from "./view.vue";
export default {
  components: { Select, Table, Pagination, Payment, View },
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
      searchText: "",
      searchPage: [],
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
      selectFee: "1 ₫",
    });
    let intervalId = null;
    const ispayments = ref(false);
    const isView = ref(false);

    data.searchPage = computed(
      () => (
        (data.currentPage = 1),
        data.item
          ? data.item.filter((item) =>
              item.boardingName
                .toLowerCase()
                .includes(data.searchText.toLocaleLowerCase())
            )
          : []
      )
    );
    data.totalPage = computed(() => {
      return data.searchPage.length > 0
        ? Math.ceil(data.searchPage.length / data.sizePage)
        : 0;
    });
    data.length = computed(() => data.searchPage.length);
    data.setPage = computed(() => {
      // console.log(data.searchPage);
      return data.searchPage
        ? data.searchPage.slice(
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
        const documentBill = await billService.getAll();
        data.item = documentBill.message;
        data.item = data.item.filter((value) => {
          const date = new Date(value.createdAt);

          return (
            value.Room.boardingId == data.boardingActice &&
            data.selectDate.month == date.getMonth() + 1 &&
            data.selectDate.year == date.getFullYear()
          );
        });
        data.item = data.item.map((item) => {
          return {
            ...item,
            roomId: item.Room["_id"],
            name: item.Room["name"],
            boardingName: item.Room.BoardingHouse.name,
            total: formatCurrency(item.total),
            receive: item.Receipts[0]
              ? formatCurrency(Number(item.Receipts[0].receive))
              : formatCurrency(0),
            debt: item.Receipts[0]
              ? formatCurrency(
                  Number(item.total) - Number(item.Receipts[0].receive)
                )
              : formatCurrency(item.total),
          };
        });
        if (data.selectFee == "0 ₫")
          data.item = data.item.filter((item) => {
            return item.debt == "0 ₫";
          });
        else
          data.item = data.item.filter((item) => {
            return item.debt != "0 ₫";
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

    watch(
      () => data.boardingActice,
      async (newValue, oldValue) => {
        if (oldValue == "") return;
        else if (newValue == "0") {
          data.boardingActice = oldValue;
          console.log("new:", newValue);
          await refresh();
        } else {
          await refresh();
        }
      }
    );
    const handlefee = async (value) => {
      if (value == "true") {
        data.selectFee = "2 ₫";
      } else data.selectFee = "0 ₫";
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
      const documentBoarding = await boardinghouseService.getAllUser();
      data.boarding = documentBoarding.message;
      if (data.boarding.length > 0) {
        data.boardingActice = data.boarding[0]._id;
      }
      await refresh();
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,
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
    <div class="border-radius my-3 row m-0 p-0 justify-content-start">
      <div class="mt-1 mb-1 ml-3 mr-1">
        <input
          type="date"
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
      <div class="input-group col-2 m-0 align-items-center p-0 mr-1">
        <Select
          :title="`Chọn nhà trọ`"
          :data="data.boarding"
          :selected="data.boardingActice"
          @choose="
            async (value) => {
              data.boardingActice = value;
            }
          "
          class="select"
          style="height: 36px"
        ></Select>
      </div>
      <!-- <div class="input-group col m-0 align-items-center p-0">
        <input
          type="search"
          placeholder="tìm kiếm theo tên nhà trọ"
          class="p-2 border rounded"
          style="
            background-color: var(--background);
            width: 40%;
            font-size: 0.9rem;
          "
          v-model="data.searchText"
        />
      </div> -->
    </div>
    <!-- <div class="border-radius my-3 mx-0 row justify-content-start">
      <div class="col-8 boarding">
        <button
          class="btn px-2 mr-2 board-item"
          v-for="(value, index) in data.boarding"
          :key="index"
          @click="
            async () => {
              data.boardingActice = value._id;
            }
          "
        >
          {{ value.name }}
        </button>
       :class="value._id == data.boardingActice ? 'isActiveBoarding' : ''"
      </div>
    </div> -->

    <Table
      class="text-center mt-2"
      :data="data.setPage"
      :fields="['Nhà trọ', 'Phòng', 'Tổng tiền(₫)', 'Đã trả(₫)', 'Còn lại(₫)']"
      :titles="['boardingName', 'name', 'total', 'receive', 'debt']"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      :action="true"
      :actionList="['visibility', 'payments']"
      :isInput="data.isInput"
      :name="'Bill'"
      @payments="
        (value) => {
          ispayments = !ispayments;
          data.activeBill = value;
        }
      "
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

    <!-- component -->
    <!-- payments -->
    <Payment
      v-if="ispayments"
      :_id="data.activeBill"
      @closeModal="ispayments = !ispayments"
    ></Payment>
    <!--    @payments="data.boardingActice = '0'" -->
    <View
      v-if="isView"
      :_id="data.activeBill"
      @closeModal="isView = !isView"
    ></View>
    <!--  :boardingId="data.boardingActice" -->
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
.select {
  background-color: var(--background);
}
</style>
