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
import serviceService from "../../../service/service.service";
export default {
  components: { Select },
  setup(props, { emit }) {
    const data = reactive({
      item: [
        {
          name: "",
          price: "",
          unit: "",
        },
      ],
    });
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal room");
    };
    const closeModal = () => {
      console.log("close modal room");

      emit("closeModal");
    };

    const handleEdit = async () => {
      console.log("Thêm service:", data.item);
      try {
        data.item.forEach(async (value) => {
          console.log(value._id, value);
          const document = await serviceService.update(value._id, value);
          emit("edit");
        });
        successAd("Cập nhật thành công");
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
      data.item = await serviceService.getAll();
      data.item = data.item.message;
      $("#editServiceModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#editServiceModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      handleEdit,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="editServiceModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Cập nhật dịch vụ
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
          <form @submit.prevent="handleEdit" class="container mt-3">
            <!--Table  -->
            <table class="table">
              <thead class="thead-dark">
                <tr>
                  <th>Tên dịch vụ</th>
                  <th>Đơn giá</th>
                  <th>Đơn vị tính</th>
                </tr>
              </thead>
              <tbody class="text-center">
                <tr
                  v-for="(value, index) in data.item"
                  :key="index"
                  :id="index"
                >
                  <th>
                    <input
                      type="text"
                      class="p-1 w-100"
                      v-model="value.name"
                      style="border: none"
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      v-model="value.price"
                      class="p-1 w-100"
                      style="border: none"
                    />
                  </th>
                  <th>
                    <input
                      type="text"
                      class="p-1 w-100"
                      v-model="value.unit"
                      style="border: none"
                    />
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
