<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";
//component
//service

import serviceService from "../../../service/service.service";
import systemService from "../../../service/system.service";
//js
import {
  checkStringAndNumber,
  sanitizeInput,
} from "../../../assets/js/checkInput.common";
import { successAd } from "../../../assets/js/common.alert";

// view
export default {
  components: {},
  props: {},
  setup(props, { emit }) {
    const data = reactive({
      item: [{ content: "", service: "", email: "", phone: "" }],
      service: [{ name: "", price: 0, unit: "" }],
    });

    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal view service");
    };
    const closeModal = () => {
      console.log("close modal view service");
      emit("closeModal");
    };

    const refresh = async () => {
      try {
        // thông tin hệ thống
        data.item = await systemService.getAll();
        data.item = data.item.message;

        // danh sách dịch vụ của người đang đăng nhập
        data.service = await serviceService.getAllUser();
        data.service = data.service.message;
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
      try {
        data.item[0].service = `${data.service[0].name} - ${data.service[0].price} - ${data.service[0].unit}`;
        const documentUpdateSystem = await systemService.update(
          data.item[0]._id,
          data.item[0]
        ); //
        const documentUpdateService = await serviceService.update(
          data.service[0]._id,
          data.service[0]
        );
        if (
          documentUpdateService["status"] == "success" &&
          documentUpdateSystem["status"] == "success"
        ) {
          successAd("Cập nhật thành công");
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
      try {
        $("#serviceModal").on("show.bs.modal", openModal); //lắng nghe mở modal
        $("#serviceModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
        await refresh();
        // *******
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    });
    return {
      data,
      save,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="serviceModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Thông tin thuê hệ thống
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
        <div class="modal-body mx-3">
          <form @submit.prevent="save">
            <div class="form-group">
              <label for="email">Email : </label>
              <input
                class="form-control"
                id="email"
                type="email"
                placeholder="địa chỉ email liên hệ"
                v-model="data.item[0].email"
              />
            </div>
            <div class="form-group">
              <label for="phone">Số điện thoại : </label>
              <input
                class="form-control"
                id="phone"
                type="phone"
                placeholder="số điện thoại  liên hệ"
                v-model="data.item[0].phone"
              />
            </div>
            <div class="form-group">
              <label for="content">Mô tả hệ thống : </label>
              <textarea
                class="form-control"
                id="content"
                placeholder="Mô tả hệ thống"
                v-model="data.item[0].content"
                cols="30"
                rows="5"
              />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Giá thuê hệ thống : </label>

              <table class="table m-0 p-0">
                <thead class="thead-dark">
                  <tr class="m-0 p-0">
                    <th scope="col">Tên dịch vụ</th>
                    <th scope="col">Đơn giá</th>
                    <th scope="col">Đơn vị tính</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th class="p-0">
                      <input
                        type="text"
                        class="w-100 px-1"
                        v-model="data.service[0].name"
                        style="border: 1px solid #ccc"
                      />
                    </th>
                    <th class="p-0">
                      <input
                        type="text"
                        v-model="data.service[0].price"
                        class="w-100 px-1"
                        style="border: 1px solid #ccc"
                      />
                    </th>
                    <th class="p-0">
                      <input
                        type="text"
                        class="w-100 px-1"
                        v-model="data.service[0].unit"
                        style="border: 1px solid #ccc"
                      />
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="form-group mt-2 text-center row justify-content-around">
              <button type="submit" class="btn btn-login col-2">
                cập nhật
              </button>
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

.imagesDiv,
.imageAfter {
  position: relative;
  display: inline;
}

.delete-icon {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  opacity: 1;
  color: var(--red);
  background-color: #f6f1f1;

  border-radius: 50%;
  line-height: 1;
  text-align: center;
}
.delete-icon:hover {
  color: red;
  font-size: 1.1rem;
  border-radius: 50%;

  background-color: var(--gray);
}
</style>
