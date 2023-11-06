<script>
import { reactive, onBeforeMount, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

//service
import billService from "../../../service/bill.service";
import payService from "../../../service/pay.service";
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
    const route = useRoute();
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
            Bills: [{ createdAt: new Date(), total: 0, services: "", debt: 0 }],
            BoardingHouse: {
              name: "",
              address: "",
              phone: "",
            },
          },
        ],
      },
      selectDate: new Date(),
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
    const handlePay = async () => {
      try {
        const documentPay = await payService.create({
          boardingId: data.item.Rooms[0].boardingId,
          _id: data.item.Rooms[0].Bills[0]._id,
          total: data.item.Rooms[0].Bills[0].debt,
        });
        console.log(documentPay);
        // var url=await paypalService.taoTT(thanhtoan);
        window.location = documentPay;
        // window.open(documentPay, '_blank');
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

    const refresh = async () => {
      try {
        const documentBill = await billService.getAllCustomer();
        data.item = documentBill.message;

        data.item.Rooms[0].Bills = data.item.Rooms[0].Bills.filter((item) => {
          const createdAt = new Date(item.createdAt);

          return (
            data.selectDate.getMonth() + 1 == createdAt.getMonth() + 1 &&
            data.selectDate.getFullYear() == createdAt.getFullYear()
          );
        });

        if (data.item.Rooms[0].Bills[0]) {
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
      handleDate,
      handlePay,
      now,
      numberToWords,
    };
  },
};
</script>
<template>
  <div class="body container-fluid m-0 pr-5">
    <div class="row m-0 text-center mt-2">
      <div class="input-group col-2" style="">
        <input
          type="month"
          @input="handleDate"
          class="p-1"
          style="background-color: var(--background); border: 1px solid #ebebeb"
        />
      </div>
    </div>
    <div
      class="row justify-content-between mx-2"
      v-if="data.item.Rooms[0].Bills[0]"
    >
      <div class="col-9 row">
        <div class="col-12">
          Nhà trọ: {{ data.item.Rooms[0].BoardingHouse.name }}
        </div>
        <div class="col-12">
          Điện thoại: {{ data.item.Rooms[0].BoardingHouse.phone }}
        </div>
        <div class="col-12">
          Địa chỉ: {{ data.item.Rooms[0].BoardingHouse.address }}
        </div>
      </div>
      <div class="col-3">
        <p>
          Ngày lập:
          {{ formatDateTime(data.item.Rooms[0].Bills[0].createdAt) }}
        </p>
        <button
          v-if="data.item.Rooms[0].Bills[0].debt == 0"
          class="btn btn-success"
          disabled="true"
        >
          Đã thanh toán
        </button>
        <button
          v-else
          class="btn"
          :class="data.item.isPay == false ? 'btn-danger' : 'btn-primary'"
          :disabled="data.item.isPay == false"
          @click="handlePay"
        >
          {{
            data.item.isPay == false ? "Chưa thanh toán" : "Thanh toán PayPal"
          }}
        </button>
      </div>
      <div class="col-12 text-center m-0 p-0">
        <h5 class="title" style="color: black">
          Hóa đơn tiền trọ Tháng {{ data.selectDate.getMonth() + 1 }}/{{
            data.selectDate.getFullYear()
          }}
        </h5>
        <!-- <p>Tháng {{ now.getMonth() + 1 }} / {{ now.getFullYear() }}</p> -->
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
            <th>Thành tiền</th>
            <td colspan="4"></td>
            <td>
              <strong>
                {{ formatCurrency(data.item.Rooms[0].Bills[0].total) }}</strong
              >
            </td>
          </tr>
        </tbody>
      </table>
      <!-- <strong class="mx-2 text-center"
        >Thành tiền bằng chữ:
        {{ numberToWords(data.item.Rooms[0].Bills[0].total) }}</strong
      > -->
    </div>
    <div v-else class="text-center">Không có hóa đơn</div>
  </div>
</template>
<style scoped>
.body {
  height: 100vh; /* Đặt chiều cao cho .body theo chiều cao của viewport */
  overflow: auto; /* Cho phép nội dung trượt khi vượt quá chiều cao của .body */
}
</style>
