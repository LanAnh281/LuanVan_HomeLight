<script>
import { reactive, ref, onMounted } from "vue";
//service
import boardinghouseService from "../../service/boardinghouse.service";
//js
import {
  checkIdentification,
  checkString,
  checkAddress,
  checkPhone,
  checkMail,
} from "../../assets/js/checkInput.common";
import { successAd } from "../../assets/js/common.alert";
export default {
  components: {},
  setup(props, { emit }) {
    const data = reactive({
      item: { name: "", address: "", rules: "" },
      error: { name: "", address: "", rules: "" },
      flag: true,
    });
    const isModalOpen = ref(false);
    const save = async () => {
      console.log("save");
      try {
        const document = await boardinghouseService.create(data.item);
        if (document["status"] === "success") {
          successAd(`Đã thêm nhà trọ ${document.message["name"]}`);
          emit("add", data.item);
        }
      } catch (error) {
        console.error(">>Error:", error);
      }
    };
    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal boarding");
    };
    const closeModal = () => {
      console.log("close modal boarding");
      emit("closeModal");
    };
    onMounted(() => {
      //lắng nghe mở modal
      $("#boardingModal").on("show.bs.modal", openModal);
      //lắng nghe đóng modal
      $("#boardingModal").on("hidden.bs.modal", closeModal);
    });
    return {
      data,
      save,
      checkString,
      checkIdentification,
      checkAddress,
      checkPhone,
      checkMail,
    };
  },
};
</script>
<template>
  <div class="body">
    <div
      class="modal fade"
      id="boardingModal"
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
                <label for="inputname" class="col-sm-3 col-form-label p-0"
                  >Tên nhà trọ :</label
                >
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control"
                    id="inputname"
                    @blur="
                      () => {
                        let isCheck = checkString(data.item.name);
                        if (isCheck) {
                          data.error.name = 'Tên nhà trọ phải là ký tự';
                          data.flag = true;
                        }
                      }
                    "
                    @input="
                      data.error.name = '';
                      data.flag = false;
                    "
                    v-model="data.item.name"
                  />
                  <div v-if="data.error.name" class="invalid-error">
                    {{ data.error.name }}
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputaddress" class="col-sm-3 col-form-label p-0"
                  >Địa chỉ :</label
                >
                <div class="col-sm-9">
                  <textarea
                    class="form-control"
                    id="inputaddress"
                    @blur="
                      () => {
                        let isCheck = checkAddress(data.item.address);
                        if (isCheck) {
                          data.error.address =
                            'Địa chỉ không chứa các kí tự đặc biệt';
                          data.flag = true;
                        }
                      }
                    "
                    @input="
                      data.error.address = '';
                      data.flag = false;
                    "
                    v-model="data.item.address"
                  ></textarea>
                  <div v-if="data.error.address" class="invalid-error">
                    {{ data.error.address }}
                  </div>
                </div>
              </div>

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

              <div class="form-group row justify-content-around mb-0">
                <button type="submit" class="btn btn-login col-sm-3">
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
