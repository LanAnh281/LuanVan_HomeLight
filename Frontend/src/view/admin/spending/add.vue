<script>
import { reactive, onMounted, ref } from "vue";

//service
import boardinghouseService from "../../../service/boardinghouse.service";
import spendingService from "../../../service/spending.service";
//component
import Select from "../../../components/select/select.vue";

//js
import { checkStringAndNumber } from "../../../assets/js/checkInput.common";
import { successAd } from "../../../assets/js/common.alert";
export default {
  components: { Select },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        date: "",
        price: "",
        reason: "",
        boardingId: "",
      },
      boarding: [],
      error: { price: "", number: "", phone: "" },
      flag: true,
    });
    const isModalOpen = ref(false);
    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal boarding");
    };
    const closeModal = () => {
      console.log("close modal boarding");
      emit("closeModal");
    };

    const refresh = async () => {
      try {
        const documentBoarding = await boardinghouseService.getAllUser();
        data.boarding = documentBoarding.message;
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
    const save = async () => {
      console.log("save", data.item);
      try {
        const documentSpending = await spendingService.create(data.item);
        if (documentSpending["status"] == "success") {
          successAd("Thêm thành công chi phí phát sinh");
          emit("add");
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
    onMounted(async () => {
      $("#addSpendingModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#addSpendingModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
      await refresh();
    });

    return {
      data,
      save,
      checkStringAndNumber,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="addSpendingModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Thêm Chi phí phát sinh
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
          >
            <!-- nhà trọ -->
            <div class="form-group row">
              <label for="inputprice" class="col-sm-3 col-form-label p-0 m-0">
                Nhà trọ :</label
              >
              <div class="col-sm-9">
                <Select
                  :title="'Chọn nhà trọ'"
                  :data="data.boarding"
                  @choose="(value) => (data.item.boardingId = value)"
                ></Select>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputdate" class="col-sm-3 col-form-label p-0"
                >Ngày chi :</label
              >
              <div class="col-sm-9">
                <input
                  type="date"
                  class="form-control"
                  id="inputdate"
                  v-model="data.item.date"
                />
                <div v-if="data.error.date" class="invalid-error">
                  {{ data.error.date }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputprice" class="col-sm-3 col-form-label p-0"
                >Số tiền :</label
              >
              <div class="col-sm-9">
                <input
                  type="number"
                  class="form-control"
                  id="inputprice"
                  v-model="data.item.price"
                />
                <div v-if="data.error.price" class="invalid-error">
                  {{ data.error.price }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputreason" class="col-sm-3 col-form-label p-0"
                >Lý do :</label
              >
              <div class="col-sm-9">
                <textarea
                  name=""
                  cols="30"
                  rows="4"
                  type="number"
                  class="form-control"
                  id="inputreason"
                  @blur="
                    () => {
                      let isCheck = checkStringAndNumber(data.item.reason);
                      if (isCheck) {
                        data.error.reason = 'Không chứa các ký tự đặc biệt.';
                        data.flag = true;
                      }
                    }
                  "
                  @input="
                    data.error.reason = '';
                    data.flag = false;
                  "
                  v-model="data.item.reason"
                ></textarea>

                <div v-if="data.error.reason" class="invalid-error">
                  {{ data.error.reason }}
                </div>
              </div>
            </div>

            <div class="form-group row justify-content-around mb-0">
              <button type="submit" class="btn btn-login col-sm-3">Thêm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-content {
  width: 120%;
  margin-left: -8%;
}
</style>
