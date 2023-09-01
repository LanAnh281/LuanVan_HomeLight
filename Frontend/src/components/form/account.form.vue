<script>
import { reactive, onMounted, onBeforeMount, ref } from "vue";
//service
import roleService from "../../service/role.service";
import positionService from "../../service/position.service";
//js
import { checkString, checkAddress } from "../../assets/js/checkInput.common";
import { successAd, warning } from "../../assets/js/common.alert";
export default {
  components: {},
  setup(props, { emit }) {
    const data = reactive({
      item: {
        userName: "",
      },
      error: { userName: "" },
      position: [],
      flag: true,
      selectedItem: null,
    });
    const isModalOpen = ref(false);
    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal account");
    };
    const closeModal = () => {
      console.log("close modal account");
      emit("closeModal");
    };

    const refresh = () => {
      data.item = {
        name: "",
      };
      data.error = { name: "" };
      data.flag = true;
    };

    const save = async () => {
      console.log("save", data.selectedItem);
      // try {
      //   const length = data.item.length;
      //   console.log("Data.item:", data.item);
      //   for (let i = 0; i < length; i++) {
      //     const document = await roleService.create(data.item[i]);
      //     if (document["status"] === "success") {
      //       data.flag = true;
      //     } else {
      //       data.flag = false;
      //     }
      //   }
      //   if (data.flag) {
      //     successAd(`Đã thêm tất cả quyền.`);
      //     refresh();
      //     emit("add");
      //   }
      // } catch (error) {
      //   if (error) {
      //     warning("Thất bại", "Bạn không có quyền.");
      //   }
      //   console.log(error);
      // }
    };
    onMounted(async () => {
      $("#accountModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#accountModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });
    onBeforeMount(async () => {
      const document = await positionService.getAll();
      data.position = document.message;
    });
    return {
      data,
      save,
      checkString,
      checkAddress,
    };
  },
};
</script>
<template>
  <div class="body">
    <div
      class="modal fade"
      id="accountModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title title" id="exampleModalLabel">
              Thêm tài khoản
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
            <form @submit.prevent="save" class="container mt-3">
              <div class="form-group row">
                <label for="inputrole" class="col-sm-3 col-form-label p-0"
                  >Email :</label
                >
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control"
                    id="inputrole"
                    v-model="data.item.userName"
                  />
                  <div v-if="data.error.userName" class="invalid-error">
                    {{ data.error.userName }}
                  </div>
                </div>
              </div>

              <div class="form-group row" v-if="data.position">
                <label for="inputrole" class="col-sm-3 col-form-label p-0"
                  >Vai trò :</label
                >
                <label
                  class=""
                  style="min-width: 110px"
                  v-for="(value, index) in data.position"
                  :key="index"
                >
                  <input
                    type="radio"
                    :value="value._id"
                    v-model="data.selectedItem"
                  />
                  {{ value.name }}
                </label>
              </div>

              <div class="form-group row justify-content-around mb-0">
                <button type="submit" class="btn btn-login col-sm-3">
                  Thêm
                </button>
              </div>
            </form>
            <!-- @blur="
            () => {
              let isCheck = checkString(data.item[index].name);
              if (isCheck) {
                data.error[index].name =
                  'Không chứa các ký tự đặc biệt.';
                data.flag = true;
              }
            }
          "
          @input="
            data.error[index].name = '';
            data.flag = false;
          " -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
