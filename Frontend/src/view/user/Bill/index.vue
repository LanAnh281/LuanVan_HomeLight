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
import billService from "../../../service/bill.service";
//component
import Select from "../../../components/select/selectdependent.vue";
import selectNormal from "../../../components/select/select.vue";
import paginationVue from "../../../components/pagination/pagination.vue";
import Table from "../../../components/table/table.vue";
//asset/js
import { formatCurrency } from "../../../assets/js/format.common";
export default {
  components: { Select, selectNormal, paginationVue, Table },

  setup() {
    const data = reactive({
      items: [],

      setPage: "",
      totalPage: 0,
      currentPage: 1,
      length: 0,
      sizePage: 4,
      status: [
        {
          _id: true,
          name: "Đã thanh toán",
        },
        { _id: false, name: "Chưa thanh toán" },
      ],
    });
    let intervalId = null;
    // data.searchPage = computed(
    //   () => (
    //     (data.currentPage = 1),
    //     data.items
    //       ? data.items.filter((item) => {
    //           if (item.BoardingHouse && item.BoardingHouse.name) {
    //             return item.BoardingHouse.name
    //               .toLowerCase()
    //               .includes(data.searchText.toLocaleLowerCase());
    //           }
    //         })
    //       : []
    //   )
    // );
    data.totalPage = computed(() =>
      data.items ? Math.ceil(data.items.length / data.sizePage) : 0
    );
    data.length = computed(() => (data.items ? data.items.length : 0));
    data.setPage = computed(() =>
      data.items
        ? data.items.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : []
    );
    const change = async (value) => {
      try {
        console.log(value);
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
        console.log(value.target.value);
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
        const documentBill = await billService.getAll();
        data.items = documentBill.message;
        console.log(data.items);
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
    onBeforeMount(async () => {
      try {
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
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });

    return {
      data,
      formatCurrency,
      change,
      handleDate,
    };
  },
};
</script>
<template>
  <div class="body container-fluid m-0 pr-5" v-if="data.items">
    <div class="row m-0 text-center mt-2">
      <div class="input-group col-2 mr-2" style="margin-left: 5%">
        <input type="month" @input="handleDate" />
      </div>
      <div class="input-group col-2">
        <selectNormal
          :title="`Chọn trạng thái`"
          :data="data.status"
          @choose="(value) => change(value)"
        ></selectNormal>
      </div>
    </div>
    <h5 class="text-center title my-3">Danh sách Hóa đơn</h5>

    <Table
      :data="data.setPage"
      :fields="['Nhà trọ', 'Phòng', 'Tổng tiền(₫)', 'Đã trả(₫)', 'Còn lại(₫)']"
      :titles="['boardingName', 'name', 'total', 'receive', 'debt']"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      :action="true"
      :actionList="['visibility', 'payments']"
      :isInput="data.isInput"
      :name="'Bill'"
    ></Table>
    <!--   @payments="
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
      " -->
    <paginationVue
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
    ></paginationVue>
  </div>
</template>
<style scoped>
.body {
  height: 240vh;
}
</style>
