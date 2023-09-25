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
      item: { receive: "", Room: { name: "" }, billId: "" },
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
      const documentBoarding = await boardinghouseService.get(props.boardingId);
      data.boarding = documentBoarding.message;
      console.log(data.boarding);
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
          <div class="row justify-content-between">
            <div class="col-9 row">
              <div class="col-12">{{ data.boarding["name"] }}</div>
              <div class="col-12">{{ data.boarding["phone"] }}</div>
              <div class="col-12">{{ data.boarding["address"] }}</div>
            </div>
            <div class="col-3">Ngày lập:</div>
            <div class="col-12 text-center my-2">
              <h3>Hóa đơn</h3>
              <p>Tháng /</p>
            </div>
            <div class="col-12 row">
              <p class="col-2">Họ tên :</p>
              <p class="col-10">ss</p>
              <p class="col-2">Phòng :</p>
              <p class="col-10">1</p>
            </div>

            <table class="table mt-2 mx-2">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Nội dung</th>
                  <th scope="col">Điện cũ (Kwh)</th>
                  <th scope="col">Điện mới (Kwh)</th>
                  <th scope="col">Nước cũ (m³)</th>
                  <th scope="col">Nước mới (m³)</th>
                  <th scope="col">Đơn giá (₫)</th>
                  <th scope="col">Thành tiền (₫)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Phòng</td>

                  <td colspan="5" style="text-align: end">1</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>Điện</td>
                  <td>1</td>
                  <td>2</td>
                  <td>1</td>
                  <td>2</td>
                  <td>2</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>Nước</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Dịch vụ v-for</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <th>Tổng tiền</th>
                  <td colspan="5"></td>
                  <td>10000đ</td>
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
