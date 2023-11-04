<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";

//service
import bill_userService from "../../../service/bill_user.service";
import payService from "../../../service/pay.service";

//component
import Select from "../../../components/select/select.vue";
//js
import {
  formatCurrency,
  formatDateTime,
} from "../../../assets/js/format.common";
// component
import Table from "../../../components/table/table.vue";
export default {
  components: { Select, Table },
  props: {
    _id: { type: String, default: "" },
    boardingId: { type: String, default: "" },
    list: [
      { name: "Hóa đơn", icon: "payments", active: "bill" },
      { name: "Lịch sử", icon: "history", active: "history" },
    ],
    active: "bill",
  },
  setup(props, { emit }) {
    const data = reactive({
      item: [],
      selectDate: new Date(),
      active: "billUser",
      list: [
        { name: "Hóa đơn", icon: "payments", active: "bill" },
        { name: "Lịch sử", icon: "history", active: "history" },
      ],
      active: "bill",
    });
    const now = new Date();
    const refresh = async () => {
      try {
        const document = await bill_userService.get(props._id);
        data.item = document.message;

        data.item = data.item.map((item) => {
          const content = item.content.split(" - ");

          return {
            ...item,
            serviceName: content[0],
            servicePrice: Number(content[1]),
            serviceUnit: content[2],
            userId: content[3], // id của super-admin
            count: item.total / Number(content[1]),
            total: item.total,
            // receiptedAt: item.receiptedAt
            //   ? formatDateTime(new Date(item.receiptedAt))
            //   : "Chưa thanh toán",
            isPaied: Number(item.receive) == Number(item.total) ? true : false, // true :chưa thanh toán,  false: đã thanh toán
            createdAt: new Date(item.createdAt),
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
      data,
      formatCurrency,
      formatDateTime,
      numberToWords,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="visibilityBillModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div
            class="row justify-content-between mx-2"
            v-if="data.item.length > 0 && data.active == 'bill'"
          >
            <div class="col-9 row">
              <div class="col-12"></div>
              <div class="col-12"></div>
              <div class="col-12"></div>
            </div>
            <div class="col-3">
              <p>
                Ngày lập:
                {{ formatDateTime(data.item[0].createdAt) }}
              </p>
              <div class="btn border border-danger w-75">
                <p class="m-0 text-danger">
                  {{
                    data.item[0].isPaied == true
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"
                  }}
                </p>
                {{ data.item.isPaied }}
                <span
                  class="m-0 text-danger"
                  v-if="data.item[0].isPaied == true"
                  >{{ formatDateTime(data.item[0].receiptedAt) }}</span
                >
              </div>
            </div>
            <div class="col-12 text-center m-0 p-0">
              <h5 class="title" style="color: black">
                Hóa đơn quản lý nhà trọ Tháng
                {{ data.item[0].createdAt.getMonth() + 1 }}/{{
                  data.item[0].createdAt.getFullYear()
                }}
              </h5>
            </div>
            <div class="col-12 row mx-1 m-0 px-1 p-0">
              <p class="col-1 m-0 p-0"></p>
              <p class="col-10 m-0 p-0"></p>
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
              >Thành tiền bằng chữ:
              {{ numberToWords(data.item[0].total) }}</strong
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-content {
  width: 160%;
  margin-left: -16%;
}

.isActive {
  color: #5243f6;
  font-weight: 500;
}
</style>
