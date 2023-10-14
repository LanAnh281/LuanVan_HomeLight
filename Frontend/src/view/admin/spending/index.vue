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
import spendingService from "../../../service/spending.service";
import boardinghouseService from "../../../service/boardinghouse.service";
//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
import {
  formatCurrency,
  formatDateTime,
} from "../../../assets/js/format.common";
import { deleted, successAd } from "../../../assets/js/common.alert";
//component
import Select from "../../../components/select/select.vue";
import Table from "../../../components/table/table.vue";
import Pagination from "../../../components/pagination/pagination.vue";
import Add from "./add.vue";
import Edit from "./edit.vue";
export default {
  components: { Select, Table, Pagination, Add, Edit },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      item: [], //list
      setPage: [],
      searchPage: [],
      currentPage: 1,
      totalPage: 1,
      sizePage: 10,
      length: 0,
      searchText: "",
      selectDate: { month: "", year: "" },
      activeSpending: "",
      boarding: [],
      boardingActice: "",
    });
    const isSpending = ref(false);
    let intervalId = null;
    const isEdit = ref(false);
    data.totalPage = computed(() =>
      data.searchPage ? Math.ceil(data.searchPage.length / data.sizePage) : 0
    );
    data.length = computed(() => data.searchPage.length);
    data.searchPage = computed(() => {
      data.currentPage = 1;
      return data.item
        ? data.item.filter((item) =>
            item.name
              .toLowerCase()
              .includes(data.searchText.toLocaleLowerCase())
          )
        : [];
    });
    data.setPage = computed(() =>
      data.searchPage
        ? data.searchPage.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : []
    );

    const handleDate = async (value) => {
      const date = new Date(value.target.value);

      data.selectDate = {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };
      await refresh();
    };
    const handleDelete = async (value) => {
      try {
        const isDelete = await deleted(
          "Xóa phát sinh",
          "Bạn có chắc chắn xóa phát sinh này."
        );
        if (isDelete) {
          const documentDelete = await spendingService.delete(value);
          if (documentDelete["status"] == "success") {
            successAd("Xóa phát sinh thành công");
            await refresh();
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
    watch(
      () => data.boardingActice,
      async (newValue, oldValue) => {
        await refresh();
      }
    );
    const refresh = async () => {
      try {
        const boarding = await boardinghouseService.getAllUser();
        if (boarding.message.length > 0) {
          const documentSpending = await spendingService.getAll();
          data.item = documentSpending.message;

          data.item = data.item.filter((item) => {
            const date = new Date(item.date);
            return (
              data.selectDate.month == date.getMonth() + 1 &&
              data.selectDate.year == date.getFullYear() &&
              item.boardingId == data.boardingActice
            );
          });
          data.item = data.item.map((item) => {
            return {
              ...item,
              price: formatCurrency(item.price),
              date: formatDateTime(item.date),
              name: item.BoardingHouse["name"],
            };
          });
          // data.length = data.item.length;
        } else data.item = [];
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

      const date = new Date();
      data.selectDate = {
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };
      data.boarding = await boardinghouseService.getAllUser();
      data.boarding = data.boarding.message;
      if (data.boarding.length > 0) {
        data.boardingActice = data.boarding[0]._id;
        await refresh();
      }
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,
      refresh,
      isSpending,
      handleDate,
      handleDelete,
      //component
      isEdit,
    };
  },
};
</script>
<template>
  <div class="body m-0">
    <div class="border-radius my-3 row m-0 justify-content-start">
      <input
        type="date"
        @input="handleDate"
        class="border rounded ml-3 mr-2 text-center col-1 p-0"
      />
      <Select
        :title="`Chọn nhà trọ`"
        :data="data.boarding"
        :selected="data.boardingActice"
        @choose="
          async (value) => {
            data.boardingActice = value;
          }
        "
        class="select p-2 border rounded col-2 w-100 mt-2"
        style="height: 36px"
      ></Select>
      <!-- <input
        type="search"
        placeholder="tìm kiếm theo nhà trọ"
        class="p-2 border rounded col-4 w-100"
        v-model="data.searchText"
      /> -->
      <div class="col row justify-content-end p-0">
        <button
          class="btn btn-primary p-0 mr-5 col-2"
          style="width: 14%; height: 36px; margin-top: 6px; margin-right: -9%"
        >
          <div
            class="row justify-content-center plus"
            data-toggle="modal"
            data-target="#addSpendingModal"
            @click="isSpending = !isSpending"
          >
            <span class="material-symbols-outlined" style="color: var(--white)">
              add
            </span>
            <span style="color: var(--white); font-size: 16px">Chi phi</span>
          </div>
        </button>
      </div>
      <!-- component  -->
      <Add
        v-if="isSpending"
        @add="refresh"
        @closeModal="isSpending = !isSpending"
      ></Add>
    </div>

    <Table
      :data="data.setPage"
      :name="'Spending'"
      :fields="['Nhà trọ', 'Ngày chi', 'Lý do', 'Số tiền']"
      :titles="['name', 'date', 'reason', 'price']"
      :action="true"
      :actionList="['edit', 'cancel']"
      :isInputChecked="true"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      @editSpending="refresh"
      @edit="
        (value) => {
          isEdit = !isEdit;
          data.activeSpending = value;
        }
      "
      @cancel="handleDelete"
    ></Table>
    <!-- pagination -->
    <Pagination
      class="m-0 p-0 mt-1"
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
    <Edit
      v-if="isEdit"
      :_id="data.activeSpending"
      @edit="refresh"
      @closeModal="isEdit = !isEdit"
    ></Edit>
  </div>
</template>
<style scoped>
.body {
  min-height: 100vh;
}
input {
  background-color: var(--background);
  font-size: 0.9rem;
  width: 120px;
  height: 36px;
  margin-top: 6px;
}
.select {
  background-color: var(--background);
}
</style>
