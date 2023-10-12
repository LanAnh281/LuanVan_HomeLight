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
import {
  formatCurrency,
  formatDateTime,
} from "../../../assets/js/format.common";
export default {
  components: { Select, selectNormal, paginationVue, Table },

  setup() {
    const data = reactive({
      item: {
        total: 0,
        Rooms: [
          {
            name: "",
            UtilityReadings: [
              {
                previousElectric: 0,
                currentElectric: 0,
                previousWater: 0,
                currentWater: 0,
              },
            ],
            Bills: [{ createdAt: new Date(), total: 0, services: "" }],
            BoardingHouse: {
              name: "",
              address: "",
              phone: "",
            },
          },
        ],
      },

      service: [],
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
    const now = new Date();
    let intervalId = null;
    // data.searchPage = computed(
    //   () => (
    //     (data.currentPage = 1),s
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
    // data.totalPage = computed(() =>
    //   data.items ? Math.ceil(data.items.length / data.sizePage) : 0
    // );
    // data.length = computed(() => (data.items ? data.items.length : 0));
    // data.setPage = computed(() =>
    //   data.items
    //     ? data.items.slice(
    //         (data.currentPage - 1) * data.sizePage,
    //         data.currentPage * data.sizePage
    //       )
    //     : []
    // );
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
        const documentBill = await billService.getAllCustomer();
        data.item = documentBill.message;

        const services =
          documentBill.message.Rooms[0].Bills[0].services.split(" ,");
        let electricPrice = services.filter((item) => item.includes("Điện"));
        electricPrice = electricPrice.join("");
        let waterPrice = services.filter((item) => item.includes("Nước"));
        waterPrice = waterPrice.join("");
        data.item.electricPrice = electricPrice.split(" - ")[1];
        data.item.waterPrice = waterPrice.split(" - ")[1];
        data.service = services.filter((item) => {
          return !item.includes("Điện") && !item.includes("Nước");
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
      formatDateTime,
      change,
      handleDate,
      now,
    };
  },
};
</script>
<template>
  <div class="body container-fluid m-0 pr-5" v-if="data.item.Rooms[0]">
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
    <div class="row justify-content-between mx-2">
      <div class="col-9 row">
        <div class="col-12">
          Nhà trọ: {{ data.item.Rooms[0].BoardingHouse.name }}
        </div>
        <div class="col-12">
          SĐT: {{ data.item.Rooms[0].BoardingHouse.phone }}
        </div>
        <div class="col-12">
          Địa chỉ: {{ data.item.Rooms[0].BoardingHouse.address }}
        </div>
      </div>
      <div class="col-3">
        Ngày lập:
        {{ formatDateTime(data.item.Rooms[0].Bills[0].createdAt) }}
      </div>
      <div class="col-12 text-center mt-2">
        <h3>Hóa đơn</h3>
        <p>Tháng {{ now.getMonth() + 1 }} / {{ now.getFullYear() }}</p>
      </div>
      <div class="col-12 row mx-1 m-0 px-1 p-0">
        <p class="col-1 m-0 p-0">Phòng :</p>
        <p class="col-10 m-0 p-0">{{ data.item.Rooms[0].name }}</p>
      </div>

      <table class="table mt-2 mx-2 text-center">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Nội dung</th>
            <th scope="col">Chỉ số cũ</th>
            <th scope="col">Chỉ số mới</th>
            <th scope="col">Tiêu thụ</th>
            <th scope="col">Đơn giá (₫)</th>
            <th scope="col">Thành tiền (₫)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, index) in data.service" :key="index">
            <td>{{ value.split(" - ")[0] }}</td>
            <td colspan="3"></td>

            <td>{{ formatCurrency(value.split(" - ")[1]) }}</td>
            <td>{{ formatCurrency(value.split(" - ")[1]) }}</td>
          </tr>
          <tr>
            <td>Điện</td>
            <td>
              {{ data.item.Rooms[0].UtilityReadings[0].previousElectric }}
            </td>
            <td>{{ data.item.Rooms[0].UtilityReadings[0].currentElectric }}</td>
            <td>
              {{
                data.item.Rooms[0].UtilityReadings[0].currentElectric -
                data.item.Rooms[0].UtilityReadings[0].previousElectric
              }}
              Kwh
            </td>
            <td>{{ formatCurrency(data.item.electricPrice) }}</td>
            <td>
              {{
                formatCurrency(
                  data.item.electricPrice *
                    (data.item.Rooms[0].UtilityReadings[0].currentElectric -
                      data.item.Rooms[0].UtilityReadings[0].previousElectric)
                )
              }}
            </td>
          </tr>

          <tr>
            <td>Nước</td>
            <td>{{ data.item.Rooms[0].UtilityReadings[0].previousWater }}</td>
            <td>{{ data.item.Rooms[0].UtilityReadings[0].currentWater }}</td>
            <td>
              {{
                data.item.Rooms[0].UtilityReadings[0].currentWater -
                data.item.Rooms[0].UtilityReadings[0].previousWater
              }}m³
            </td>
            <td>{{ formatCurrency(data.item.waterPrice) }}</td>
            <td>
              {{
                formatCurrency(
                  data.item.waterPrice *
                    (data.item.Rooms[0].UtilityReadings[0].currentWater -
                      data.item.Rooms[0].UtilityReadings[0].previousWater)
                )
              }}
            </td>
          </tr>

          <tr>
            <th>Tổng tiền</th>
            <td colspan="4"></td>
            <td>
              <strong>
                {{ formatCurrency(data.item.Rooms[0].Bills[0].total) }}</strong
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
.body {
  height: 240vh;
}
</style>
