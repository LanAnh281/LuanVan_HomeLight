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
import { formatCurrency } from "../../../assets/js/format.common";
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
    });
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal add room");
    };
    const closeModal = () => {
      console.log("close modal add room");

      emit("closeModal");
    };

    onBeforeMount(async () => {
      const documentBill = await billService.get(props._id);
      data.item = documentBill.message;
      console.log(data.item, data.item.services);
      const documentBoarding = await boardinghouseService.get(
        data.item.Room.boardingId
      );
      data.boarding = documentBoarding.message;
      console.log(data.boarding);
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

      $("#visibilityBillModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#visibilityBillModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      formatCurrency,
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
          <div class="row justify-content-between mx-2">
            <div class="col-9 row">
              <div class="col-12">{{ data.boarding["name"] }}</div>
              <div class="col-12">{{ data.boarding["phone"] }}</div>
              <div class="col-12">{{ data.boarding["address"] }}</div>
            </div>
            <div class="col-3">
              Ngày lập: {{ data.item.day }}/{{ data.item.month }}/
              {{ data.item.year }}
            </div>
            <div class="col-12 text-center mt-2">
              <h3>Hóa đơn</h3>
              <p>Tháng {{ data.item.month }}/ {{ data.item.year }}</p>
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
                <tr class="">
                  <td>Phòng</td>
                  <td colspan="3"></td>
                  <td>{{ formatCurrency(data.item.Room.price) }}</td>
                  <td>{{ formatCurrency(data.item.Room.price) }}</td>
                </tr>
                <tr
                  v-for="(value, index) in data.servicesOther"
                  :key="index"
                  v-show="value != ''"
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
                          (data.item.Room.UtilityReadings[0].currentElectric -
                            data.item.Room.UtilityReadings[0].previousElectric)
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
                  <th>Tổng tiền</th>
                  <td colspan="4"></td>
                  <td>
                    <strong>{{ formatCurrency(data.item.total) }}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
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
</style>
