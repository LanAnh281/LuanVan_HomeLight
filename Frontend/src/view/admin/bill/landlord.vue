<script>
import { reactive, onMounted, onBeforeMount } from "vue";
// services
import bill_userService from "../../../service/bill_user.service";
import payService from "../../../service/pay.service";
//js
import {
  formatCurrency,
  formatDateTime,
} from "../../../assets/js/format.common";
export default {
  setup() {
    const data = reactive({
      item: [],
      selectDate: new Date(),
      active: "billUser",
    });
    const now = new Date();
    const refresh = async () => {
      try {
        console.log("refresh");
        const document = await bill_userService.getAllUser();
        data.item = document.message;
        console.log(data.item);
        if (data.item) {
          //   console.log(data.item[0]);
          data.item = data.item.filter((item) => {
            const date = new Date(item.createdAt);

            return (
              date.getMonth() + 1 == data.selectDate.getMonth() + 1 &&
              date.getFullYear() == data.selectDate.getFullYear()
            );
          });
          console.log(data.item);
          // Mỗi tháng chỉ có 1 hóa đơn quản lý
          data.item = data.item.map((item) => {
            const content = item.content.split(" - ");

            return {
              ...item,
              serviceName: content[0],
              servicePrice: Number(content[1]),
              serviceUnit: content[2],
              userId: content[3], // id của super-admin
              count: item.total / Number(content[1]),
              isPaied: item.receive ? true : false,
            };
          });
          console.log(data.item);
        } else {
          data.item = [];
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
    const handleDate = async (value) => {
      try {
        data.selectDate = new Date(value.target.value);
        console.log("Ngày đã chọn", value.target.value);
        await refresh();
        console.log(data.item);
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
    const handlePay = async () => {
      try {
        console.log("Thanh toán", data.item[0].total);

        const documentPay = await payService.create({
          userId: data.item[0].userId,
          _id: data.item[0]._id,
          total: data.item[0].total,
        });
        console.log(documentPay);
        // var url=await paypalService.taoTT(thanhtoan);
        //  console.log(url)
        window.location = documentPay;
        window.open(documentPay, "_blank");
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
        data.selectDate = now;
        await refresh();
        console.log(data.item.length == 0);
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
      handlePay,
    };
  },
};
</script>
<template>
  <div class="body container-fluid m-0 pr-5">
    <div class="row m-0 text-center mt-2">
      <div class="input-group col-2">
        <input
          type="month"
          @input="handleDate"
          class="p-1 w-100"
          style="background-color: var(--background); border: 1px solid #ebebeb"
        />
      </div>
      <!-- <div class="input-group col-2">
        <button
          class="btn btn-primary"
          @click="
            () => {
              data.active = 'histories';
            }
          "
        >
          Lịch sử thanh toán
        </button>
      </div> -->
    </div>

    <div v-if="data.item.length > 0">
      <div class="row justify-content-between mx-2">
        <div class="col-9 row">
          <div class="col-12">{{ data.item[0].isPaied }}</div>
          <div class="col-12"></div>
          <div class="col-12"></div>
        </div>
        <div class="col-3">
          <p>Ngày lập: {{ formatDateTime(data.item[0].createdAt) }}</p>
          <button
            class="btn"
            :class="data.item[0].isPaied ? 'btn-success' : 'btn-primary'"
            :disabled="data.item[0].isPaied"
            @click="handlePay"
          >
            {{ data.item[0].isPaied ? "Đã thanh toán" : "Thanh toán" }}
          </button>
        </div>
        <div class="col-12 text-center m-0 p-0">
          <h5 class="title" style="color: black">
            Hóa đơn quản lý nhà trọ Tháng
            {{ data.selectDate.getMonth() + 1 }}/{{
              data.selectDate.getFullYear()
            }}
          </h5>
        </div>

        <table class="table mt-2 mx-2">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Nội dung</th>
              <th scope="col">Số lượng phòng</th>
              <th scope="col">Đơn giá (₫)</th>
              <th scope="col">Thành tiền (₫)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tiền quản lý nhà trọ</td>
              <td class="text-center">
                {{ data.item[0].count }}
              </td>
              <td class="text-center">
                {{ formatCurrency(data.item[0].servicePrice) }}
              </td>
              <td class="text-center">
                {{ formatCurrency(data.item[0].total) }}
              </td>
            </tr>
            <tr>
              <th>Thành tiền</th>
              <td colspan="2"></td>
              <td class="text-center">
                {{ formatCurrency(data.item[0].total) }}
              </td>
            </tr>
          </tbody>
        </table>
        <strong class="mx-2 text-center"
          >Thành tiền bằng chữ: {{ numberToWords(data.item[0].total) }}</strong
        >
      </div>

      <div
        v-if="data.active == 'histories'"
        class="row justify-content-between mx-2"
      >
        lịch sử thanh toán
      </div>
    </div>
    <div class="text-center" v-if="data.item.length == 0">Không có hóa đơn</div>
  </div>
</template>
<style scoped>
.body {
  height: 150vh;
}
</style>
<!-- Tại đây show hóa đơn ra , thanh toán, lọc và ngày đã thanh toán -->
