<script>
import { reactive, onMounted, ref } from "vue";
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
      item: {
        userName: "",
        Rooms: [{ name: "", BoardingHouse: { name: "" } }],
      },
    });
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal visibility user");
    };
    const closeModal = () => {
      console.log("close modal visibility user");
      emit("closeModal");
    };
    onMounted(async () => {
      const documentUser = await userService.get(props._id);
      data.item = documentUser.message;
      $("#visibilityUserModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#visibilityUserModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });
    return { data, formatDateTime };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="visibilityUserModal"
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
          <div class="row p-0 m-0 px-2">
            <div class="col-6 p-0 m-0">
              <div class="row justify-content-start p-0 m-0">
                <label class="col-2 p-0 m-0">Nhà trọ:</label>
                <label class="col-10 p-0 m-0">{{
                  data.item.Rooms[0].BoardingHouse.name
                }}</label>
              </div>
              <div class="row justify-content-start p-0 mt-2 m-0">
                <label class="pr-2">Phòng :</label>
                <label class="">{{ data.item.Rooms[0].name }}</label>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Họ và tên:</label>
                <label class="">{{ data.item.userName }}</label>
              </div>

              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Ngày sinh:</label>
                <label class="">{{
                  data.item.birthday ? formatDateTime(data.item.birthday) : ""
                }}</label>
              </div>

              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Số CCCD:</label>
                <label class="">{{ data.item.identification }}</label>
              </div>
            </div>
            <div class="col-6 m-0 p-0">
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Giới tính:</label>
                <span class=""> {{ data.item.sex ? "Nữ" : "Nam" }}</span>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Email:</label>
                <label class="">{{ data.item.email }}</label>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">SĐT:</label>
                <label class="">{{ data.item.phone }}</label>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="col-2 p-0 m-0">Địa chỉ:</label>
                <label class="col-10 p-0 m-0">{{ data.item.address }}</label>
              </div>
              <div class="row justify-content-start p-0 m-0">
                <label class="pr-2">Biển số xe:</label>
                <label class="">{{ data.item.numberPlate }}</label>
              </div>
            </div>
            <div class="col-12 m-0 p-0">
              <label class="col-2 p-0 m-0">Ảnh CCCD: </label>
              <div class="px-2">
                <img
                  :src="`http://localhost:3000/api/users/getImg/${data.item.imagePrevious}`"
                  alt="Ảnh CCCD mặt sau"
                  class="mr-5"
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
