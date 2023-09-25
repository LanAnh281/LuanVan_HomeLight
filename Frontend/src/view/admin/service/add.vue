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
  sanitizeInput,
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
    const add = () => {
      console.log("add");
      data.item.push({ name: "", price: "", unit: "" });
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
    const handleCreate = async () => {
      try {
        data.item.forEach(async (value) => {
          value.name = sanitizeInput(value.name);
          value.price = sanitizeInput(value.price);
          value.unit = sanitizeInput(value.unit);
          const document = await serviceService.create(value);
          emit("add");
        });
        data.item = [
          {
            name: "",
            price: "",
            unit: "",
          },
        ];
        successAd("Thêm dịch vụ thành công");
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
      $("#addServiceModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#addServiceModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
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
          <div class="row justify-content-end mr-3">
            <span
              class="material-symbols-outlined add-icon mr-2 p-1"
              @click="add"
            >
              add
            </span>
            <span
              class="material-symbols-outlined remove-icon p-1"
              @click="remove"
            >
              remove
            </span>
          </div>
          <form @submit.prevent="handleCreate" class="container mt-3">
            <!--Table  -->
            <table class="table text-center">
              <thead class="thead-dark m-0 p-0">
                <tr>
                  <th scope="col">Tên dịch vụ</th>
                  <th scope="col">Đơn giá</th>
                  <th scope="col">Đơn vị tính</th>
                  <th scope="col">Hành động</th>
                </tr>
              </thead>
              <tbody class="text-center m-0 p-0">
                <tr
                  v-for="(value, index) in data.item"
                  :key="index"
                  :id="index"
                >
                  <th>
                    <input
                      type="text"
                      class="px-1 py-0 m-0 w-100"
                      style="height: 30px"
                      v-model="value.name"
                    />
                  </th>
                  <th>
                    <input
                      type="number"
                      v-model="value.price"
                      class="px-1 py-0 m-0 w-100"
                      style="height: 30px"
                    />
                  </th>
                  <th class="">
                    <input
                      type="text"
                      v-model="value.unit"
                      class="px-1 py-0 m-0 w-100"
                      style="height: 30px"
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
.add-icon {
  color: rgb(124, 205, 3);
  border-radius: 50%;
  background-color: #fff;
}
.add-icon:hover {
  font-weight: 600;
  background-color: #f9f7f7;
}
.remove-icon {
  color: red;
  border-radius: 50%;
  background-color: #fff;
}
.remove-icon:hover {
  font-weight: 600;
  background-color: #f9f7f7;
}
</style>
