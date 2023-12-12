<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";

//service
import billService from "../../../service/bill.service";
import receiptService from "../../../service/receipt.service";
//component
import Select from "../../../components/select/select.vue";
//js

import { formatCurrency } from "../../../assets/js/format.common";
import { successAd } from "../../../assets/js/common.alert";
export default {
  components: { Select },
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        receive: "",
        Room: { name: "" },
        billId: "",
        method: "tiền mặt",
        content: "",
      },
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

        const receipt = data.item.Receipts[0]
          ? data.item.Receipts[0].receive
          : 0;
        const dataUpdate = {
          receive: Number(data.item.receive) + Number(receipt),
          debt:
            Number(data.item.total) -
            (Number(data.item.receive) + Number(receipt)),
          method: "tiền mặt",
          billId: props._id,
          content: data.item.content,
        };
        // console.log(data.item, data.item.Receipts[0]._id);
        const documentReceipt = await receiptService.update(
          data.item.Receipts[0]._id,
          dataUpdate
        );
        // console.log(props._id);
        if (documentReceipt["status"] == "success") {
          successAd("Thanh toán thành công");
          const documentBill = await billService.update(props._id, {
            debt:
              Number(data.item.total) -
              (Number(data.item.receive) + Number(receipt)),
          });
        }

        await refresh();
        emit("payments");
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
          <h5 class="modal-title title" id="exampleModalLabel">Thanh toán</h5>
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
                >Số tiền thanh toán :</label
              >
              <div class="col-sm-9">
                <input
                  type="number"
                  class="form-control"
                  id="inputreceive"
                  v-model="data.item.receive"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="inputreceive" class="col-sm-3 col-form-label p-0"
                >Người thanh toán:</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputreceive"
                  v-model="data.item.content"
                />
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
