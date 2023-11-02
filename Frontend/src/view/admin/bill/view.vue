<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";

//service
import boardinghouseService from "../../../service/boardinghouse.service";
import billService from "../../../service/bill.service";
import receiptService from "../../../service/receipt.service";

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
  },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        receive: "",
        Room: {
          name: "",
          UtilityReadings: [
            {
              previousElectric: 0,
              currentElectric: 0,
              previousWater: 0,
              currentWater: 0,
            },
          ],
        },
        billId: "",
        servicesOther: [],
      },
      boarding: {},
      list: [
        { name: "Hóa đơn", icon: "payments", active: "bill" },
        { name: "Lịch sử", icon: "history", active: "history" },
      ],
      active: "bill",
    });
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal view bill");
    };
    const closeModal = () => {
      console.log("close modal view bill");

      emit("closeModal");
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
      const documentBill = await billService.get(props._id);
      data.item = documentBill.message;
      data.item.PAYMENTHISTORies = data.item.PAYMENTHISTORies.map((item) => {
        return {
          ...item,
          money: formatCurrency(item.money),
          createdAt: formatDateTime(item.createdAt),
        };
      });
      const documentBoarding = await boardinghouseService.get(
        data.item.Room.boardingId
      );
      data.boarding = documentBoarding.message;

      let services = "";
      if (data.item.services) {
        services = data.item.services.split(",");
      }

      data.servicesOther = services.filter(
        (item) => !item.includes("Điện") && !item.includes("Nước")
      );
      let serviceEW = services.filter(
        (item) => item.includes("Điện") || item.includes("Nước")
      );
      let priceElectric = 0;
      let priceWater = 0;
      serviceEW = serviceEW.filter((item) => {
        if (item.includes("Điện")) {
          const price = item.split(" - ")[1];
          priceElectric = price;
          return item;
        } else if (item.includes("Nước")) {
          const price = item.split(" - ")[1];
          priceWater = price;
          return item;
        } else {
          return 0;
        }
      });
      data.item["priceElectric"] = priceElectric;
      data.item["priceWater"] = priceWater;
      data.item["createdAt"] = new Date(data.item["createdAt"]);
      data.item.day = data.item.createdAt.getDate();
      data.item.month = data.item.createdAt.getMonth() + 1;
      data.item.year = data.item.createdAt.getFullYear();
      data.item.content = data.item.Receipts[0].content;
      $("#visibilityBillModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#visibilityBillModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      formatCurrency,
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
          <div class="form-group row">
            <ul class="col-sm-2 p-0 m-0" style="margin-top: -3%">
              <li
                v-for="(value, index) in data.list"
                :key="index"
                @click="data.active = value.active"
              >
                <div class="row ml-2 my-3 list">
                  <span class="material-symbols-outlined mr-2 py-1 icon">
                    {{ value.icon }}
                  </span>
                  <span
                    class="mr-2 py-2 name"
                    :class="value.active == data.active ? 'isActive' : ''"
                  >
                    {{ value.name }}</span
                  >
                </div>
              </li>
            </ul>

            <div class="col-sm-9 m-0 p-0" v-if="data.active == 'bill'">
              <div class="row justify-content-between mx-2">
                <div class="col-9 row">
                  <div class="col-12">Nhà trọ: {{ data.boarding["name"] }}</div>
                  <div class="col-12">
                    Điện thoại: {{ data.boarding["phone"] }}
                  </div>
                  <div class="col-12">
                    Địa chỉ: {{ data.boarding["address"] }}
                  </div>
                </div>
                <div class="col-3">
                  Ngày lập: {{ data.item.day }}/{{ data.item.month }}/
                  {{ data.item.year }}
                </div>
                <div class="col-12 text-center mt-2">
                  <h6 class="title text-dark">
                    Hóa đơn tiền trọ tháng {{ data.item.month }}/{{
                      data.item.year
                    }}
                  </h6>
                </div>
                <div class="col-12 row mx-1 m-0 px-1 p-0">
                  <p class="col-1 m-0 p-0">Phòng :</p>
                  <p class="col-10 m-0 p-0">1</p>
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
                    <tr
                      v-for="(value, index) in data.servicesOther"
                      :key="index"
                    >
                      <td>{{ value.split(" - ")[0] }}</td>
                      <td colspan="3"></td>

                      <td>{{ formatCurrency(value.split(" - ")[1]) }}</td>
                      <td>{{ formatCurrency(value.split(" - ")[1]) }}</td>
                    </tr>
                    <tr>
                      <td>Điện</td>
                      <td>
                        {{ data.item.Room.UtilityReadings[0].previousElectric }}
                      </td>
                      <td>
                        {{ data.item.Room.UtilityReadings[0].currentElectric }}
                      </td>
                      <td>
                        {{
                          data.item.Room.UtilityReadings[0].currentElectric -
                          data.item.Room.UtilityReadings[0].previousElectric
                        }}
                        Kwh
                      </td>
                      <td>{{ formatCurrency(data.item.priceElectric) }}</td>
                      <td>
                        {{
                          formatCurrency(
                            data.item.priceElectric *
                              (data.item.Room.UtilityReadings[0]
                                .currentElectric -
                                data.item.Room.UtilityReadings[0]
                                  .previousElectric)
                          )
                        }}
                      </td>
                    </tr>

                    <tr>
                      <td>Nước</td>
                      <td>
                        {{ data.item.Room.UtilityReadings[0].previousWater }}
                      </td>
                      <td>
                        {{ data.item.Room.UtilityReadings[0].currentWater }}
                      </td>
                      <td>
                        {{
                          data.item.Room.UtilityReadings[0].currentWater -
                          data.item.Room.UtilityReadings[0].previousWater
                        }}
                        m³
                      </td>
                      <td>{{ formatCurrency(data.item.priceWater) }}</td>
                      <td>
                        {{
                          formatCurrency(
                            data.item.priceWater *
                              (data.item.Room.UtilityReadings[0].currentWater -
                                data.item.Room.UtilityReadings[0].previousWater)
                          )
                        }}
                      </td>
                    </tr>

                    <tr>
                      <th>Thành tiền</th>
                      <td colspan="4"></td>
                      <td>
                        <strong>{{ formatCurrency(data.item.total) }}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <strong class="mx-2 text-center"
                  >Thành tiền bằng chữ:
                  {{ numberToWords(data.item.total) }}</strong
                >
              </div>
            </div>
            <div class="col-sm-9" v-else>
              <!-- <div class="row justify-content-between mx-2"></div> -->
              <Table
                :data="data.item.PAYMENTHISTORies"
                :fields="[
                  'Người trả',
                  'Số tiền',
                  'Phương thức',
                  'Ngày thanh toán',
                ]"
                :titles="['content', 'money', 'method', 'createdAt']"
              ></Table>
            </div>
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
