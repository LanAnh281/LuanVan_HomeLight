<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";

//service
import billService from "../../../service/bill.service";
import receiptService from "../../../service/receipt.service";
//component
import Select from "../../../components/select/select.vue";
//js
import {
  checkStringAndNumber,
  checkAddress,
  checkNumber,
} from "../../../assets/js/checkInput.common";
import { formatCurrency } from "../../../assets/js/format.common";
import { successAd, warning } from "../../../assets/js/common.alert";
export default {
  components: { Select },
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: { receive: "", Room: { name: "" }, billId: "" },
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
    const save = async () => {
      try {
        data.item.debt = data.item.total - data.item.receive;
        data.item.billId = props._id;
        // chưa trả ==0 đ
        if (data.item["received"] == "0 ₫") {
          const documentReceipt = await receiptService.create(data.item);
          if (documentReceipt["status"] == "success") {
            successAd("Thành công thanh toán");
            console.log(documentReceipt);
            await refresh();
            emit("payments");
          }
        }
        // đã trả
        else if (data.item["received"] != "0 ₫") {
          //đã có thanh toàn trc đó
          const receipt = data.item.Receipts[0]
            ? data.item.Receipts[0].receive
            : 0;
          console.log(receipt, Number(data.item.receive) + Number(receipt));
          const dataUpdate = {
            receive: Number(data.item.receive) + Number(receipt),
            debt:
              Number(data.item.total) -
              (Number(data.item.receive) + Number(receipt)),
          };
          const documentReceipt = await receiptService.update(
            data.item.Receipts[0]._id,
            dataUpdate
          );
          if (documentReceipt["status"] == "success") {
            successAd("Thành công thanh toán");
            await refresh();
            emit("payments");
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
    const refresh = async () => {
      try {
        const document = await billService.get(props._id);
        data.item = document.message;
        const receipt = data.item.Receipts[0]
          ? data.item.Receipts[0].receive
          : 0;
        data.item.received = formatCurrency(receipt);
        data.item.debt = Number(data.item.total) - receipt;
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
    onBeforeMount(async () => {
      await refresh();

      // nếu như tồn tại recet thì sẽ show dữ liệu receive và debt => update receipt
      //nếu không tồn tại sẽ => create receipt
      $("#paymentsBillModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#paymentsBillModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      save,
      formatCurrency,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="paymentsBillModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Thêm phòng trọ
          </h5>
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
          <form
            @submit.prevent="save"
            enctype="multipart/form-data"
            class="container mt-3"
            style="text-align: start"
          >
            <div class="form-group row">
              <label for="inputRoom" class="col-sm-3 col-form-label p-0"
                >Phòng :</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputRoom"
                  disabled
                  :value="data.item.Room.name"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="inputTotal" class="col-sm-3 col-form-label p-0"
                >Tổng tiền :</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputTotal"
                  disabled
                  :value="formatCurrency(data.item.total)"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="inputTotal" class="col-sm-3 col-form-label p-0"
                >Đã trả :</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputTotal"
                  disabled
                  :value="data.item.received"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="inputTotal" class="col-sm-3 col-form-label p-0"
                >Còn lại :</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputTotal"
                  disabled
                  :value="formatCurrency(data.item.debt)"
                />
              </div>
            </div>
            <!--  -->
            <div class="form-group row">
              <label for="inputreceive" class="col-sm-3 col-form-label p-0"
                >Thanh toán :</label
              >
              <div class="col-sm-9">
                <input
                  type="number"
                  class="form-control"
                  id="inputreceive"
                  v-model="data.item.receive"
                />
                <!-- <div v-if="data.error.name" class="invalid-error">
                  {{ data.error.name }}
                </div> -->
              </div>
            </div>

            <div class="form-group row justify-content-around mb-0">
              <button type="submit" class="btn btn-login col-sm-3">
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
