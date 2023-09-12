<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";

//service
import boardinghouseService from "../../../service/boardinghouse.service";
import roomService from "../../../service/room.service";
//component
import Select from "../../../components/select/select.vue";
//js
import {
  checkStringAndNumber,
  checkAddress,
  checkNumber,
} from "../../../assets/js/checkInput.common";
import { successAd, warning } from "../../../assets/js/common.alert";
export default {
  components: { Select },
  setup(props, { emit }) {
    const data = reactive({
      item: [
        {
          name: "",
          price: "",
        },
      ],
    });
    const isModalOpen = ref(false);
    const filesRef = ref(null);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal room");
    };
    const closeModal = () => {
      console.log("close modal room");
      filesRef.value.value = "";
      emit("closeModal");
    };
    const add = () => {
      console.log("add");
      data.item.push({ name: "", price: "" });
      //   data.error.push({ name: "", price: "" });
    };
    const remove = () => {
      data.item.pop();
      //   data.error.pop();
      console.log("remove");
    };
    const handleDelete = (value) => {
      data.item = data.item.filter((item, index) => index != value);
    };
    const handleCreate = () => {
      console.log("Thêm service:", data.item);
    };
    onBeforeMount(async () => {
      console.log("Add service");
      $("#roomModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#roomModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      handleCreate,
      add,
      remove,
      handleDelete,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="addServiceModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">Thêm dịch vụ</h5>
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
          <span class="material-symbols-outlined" @click="add"> add </span>
          <span class="material-symbols-outlined" @click="remove">
            remove
          </span>
          <form @submit.prevent="handleCreate" class="container mt-3">
            <!--Table  -->
            <table class="table">
              <thead class="thead-dark">
                <tr>
                  <th>Tên dịch vụ</th>
                  <th>Đơn giá</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, index) in data.item"
                  :key="index"
                  :id="index"
                >
                  <th>
                    <input
                      type="text"
                      v-model="value.name"
                      class="p-1"
                      style="border-color: #ccc"
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      v-model="value.price"
                      class="p-1"
                      style="border-color: #ccc"
                    />
                  </th>
                  <th class="text-center">
                    <span
                      class="material-symbols-outlined text-danger"
                      @click="handleDelete(index)"
                    >
                      cancel
                    </span>
                  </th>
                </tr>
              </tbody>
            </table>
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
  width: 160%;
  margin-left: -16%;
}
</style>
