<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";

//service
import userService from "../../../service/user.service";
//js
import { formatDateTime } from "../../../assets/js/format.common";
// view
export default {
  components: {},
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: { userName: "" },
    });
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal info user");
    };
    const closeModal = () => {
      console.log("close modal info user");
      emit("closeModal");
    };
    onMounted(async () => {
      console.log("PropsId:", props._id);
      const documentUser = await userService.get(props._id);
      data.item = documentUser.message;
      console.log(data.item);
      $("#infoUserModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#infoUserModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });
    return { data, formatDateTime };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="infoUserModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Thông tin khách trọ
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
          <div class="row p-0 m-0">
            <div class="col-6 p-0 m-0">
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Họ và tên:</label>
                <label class="">{{ data.item.userName }}</label>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Giới tính:</label>
                <span class=""> {{ data.item.sex ? "Nữ" : "Nam" }}</span>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Ngày sinh:</label>
                <label class="">{{ formatDateTime(data.item.birthday) }}</label>
              </div>

              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">CCCD:</label>
                <label class="">{{ data.item.identification }}</label>
              </div>
            </div>
            <div class="col-6 m-0 p-0">
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Email:</label>
                <label class="">{{ data.item.email }}</label>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">SĐT:</label>
                <label class="">{{ data.item.phone }}</label>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Biển số xe:</label>
                <label class="">{{ data.item.numberPlate }}</label>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="col-2 p-0 m-0">Địa chỉ:</label>
                <label class="col-10 p-0 m-0">{{ data.item.address }}</label>
              </div>
            </div>
          </div>
          <div class="col-12 m-0 p-0">
            <label class="col-2 p-0 m-0">Ảnh CCCD: </label>
            <div class="text-center">
              <img
                :src="`http://localhost:3000/api/users/getImg/${data.item.imagePrevious}`"
                alt="Ảnh CCCD mặt sau"
                class="mr-3"
              />
              <img
                :src="`http://localhost:3000/api/users/getImg/${data.item.imageAfter}`"
                alt="Ảnh CCCD mặt sau"
              />
            </div>
          </div>
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
img {
  width: 200px;
  height: 200px;
  object-fit: contain;
}
</style>
