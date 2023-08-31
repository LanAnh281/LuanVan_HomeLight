<script>
import { reactive, onMounted, ref } from "vue";
//service
import boardinghouseService from "../../service/boardinghouse.service";
//component
import Select from "../../components/select/selectdependent.vue";

//js
import {
  checkStringAndNumber,
  checkAddress,
} from "../../assets/js/checkInput.common";
import { successAd } from "../../assets/js/common.alert";
export default {
  components: { Select },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        rules: "",
      },
      error: { rules: "" },
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
    const refresh = () => {
      data.item = {
        rules: "",
      };
      data.error = { rules: "" };
      data.flag = true;
    };
    const save = async () => {
      console.log("save");
      try {
        for (const key of data.error) {
          console.log("key", data.item[key]);
          if (data.item[key] == "") {
            data.error[key] = "Chưa nhập thông tin.";
            data.flag = true;
          }
        }
        console.log("data.flag:", data.flag);
        if (!data.flag) {
          console.log("Data.item:", data.item);
          refresh();
          emit("submit");
        }
      } catch (error) {
        console.error(">>Error:", error);
      }
    };
    onMounted(async () => {
      $("#ruleModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#ruleModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      save,
      checkStringAndNumber,
      checkAddress,
    };
  },
};
</script>
<template>
  <div class="body">
    <div
      class="modal fade"
      id="ruleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title title" id="exampleModalLabel">
              Thêm nhà trọ
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
              <div class="form-group row">
                <label for="inputrules" class="col-sm-3 col-form-label p-0"
                  >Quy định :</label
                >
                <div class="col-sm-9">
                  <textarea
                    class="form-control"
                    id="inputrules"
                    @blur="
                      () => {
                        let isCheck = checkAddress(data.item.rules);
                        if (isCheck) {
                          data.error.rules =
                            'Quy định không chứa các kí tự đặc biệt';
                          data.flag = true;
                        }
                      }
                    "
                    @input="
                      data.error.rules = '';
                      data.flag = false;
                    "
                    v-model="data.item.rules"
                  ></textarea>
                  <div v-if="data.error.rules" class="invalid-error">
                    {{ data.error.rules }}
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputchoose" class="col-sm-3 col-form-label p-0"
                  >Áp dụng :</label
                >
                <div class="col-sm-9">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="exampleCheck1"
                  />
                  <label class="form-check-label" for="exampleCheck1"
                    >Nhà trọ</label
                  >
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
  </div>
</template>
