<script>
import { reactive, onMounted, ref } from "vue";
//service
import roleService from "../../service/role.service";
//js
import { checkString, checkAddress } from "../../assets/js/checkInput.common";
import { successAd, warning } from "../../assets/js/common.alert";
export default {
  components: {},
  setup(props, { emit }) {
    const data = reactive({
      item: [
        {
          name: "",
        },
      ],
      error: [{ name: "" }],
      flag: true,
    });
    const isModalOpen = ref(false);
    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal role");
    };
    const closeModal = () => {
      console.log("close modal role");
      emit("closeModal");
    };

    const refresh = () => {
      data.item = {
        name: "",
      };
      data.error = { name: "" };
      data.flag = true;
    };
    const add = () => {
      console.log("add");
      data.item.push({ name: "" });
      data.error.push({ name: "" });
    };
    const remove = () => {
      data.item.pop();
      data.error.pop();
      console.log("remove");
    };
    const save = async () => {
      console.log("save");
      try {
        const length = data.item.length;
        console.log("Data.item:", data.item);
        for (let i = 0; i < length; i++) {
          const document = await roleService.create(data.item[i]);
          if (document["status"] === "success") {
            data.flag = true;
          } else {
            data.flag = false;
          }
        }
        if (data.flag) {
          successAd(`Đã thêm tất cả quyền.`);
          refresh();
          emit("add");
        }
      } catch (error) {
        if (error) {
          warning("Thất bại", "Bạn không có quyền.");
        }
        console.log(error);
      }
    };
    onMounted(async () => {
      $("#roleModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#roleModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      save,
      checkString,
      checkAddress,
      add,
      remove,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="roleModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">Thêm quyền</h5>
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
          <form @submit.prevent="save" class="container mt-1">
            <div class="form-group row justify-content-end mr-2">
              <span class="radius mr-1" style="color: yellowgreen" @click="add"
                >+</span
              >
              <span class="radius" style="color: red" @click="remove"> - </span>
            </div>
            <div
              class="form-group row"
              v-for="(value, index) in data.item"
              :key="index"
            >
              <label for="inputrole" class="col-sm-3 col-form-label p-0"
                >Tên quyền :</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputrole"
                  v-model="data.item[index].name"
                />
                <div v-if="data.error[index].name" class="invalid-error">
                  {{ data.error[index].name }}
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
