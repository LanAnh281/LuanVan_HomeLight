<script>
import { reactive, onMounted, ref } from "vue";
import _ from "lodash";

//service
import roomService from "../../../../service/room.service";
// view
import room from "./room.view.vue";
import customerView from "./customer.view.vue";
import serviceView from "./service.view.vue";
export default {
  components: { room, customerView, serviceView },
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: [
        { name: "Phòng trọ", icon: "house", active: "room" },
        { name: "Khách trọ", icon: "person", active: "customer" },
        {
          name: "Dịch vụ ",
          icon: "energy_program_time_used",
          active: "service",
        },
      ],
      active: "room",
      room: { name: "", price: "", long: "", wide: "", content: "" },
    });
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal view room");
    };
    const closeModal = () => {
      console.log("close modal view room");
      // refresh();
      emit("closeModal");
    };
    onMounted(async () => {
      //get all boarding house

      const documentRoom = await roomService.get(props._id);
      data.room = documentRoom.message;

      $("#viewRoomModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#viewRoomModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });
    return { data };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="viewRoomModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Thông tin phòng trọ
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
          <div class="form-group row">
            <ul class="col-sm-3 p-0" style="margin-top: -3%">
              <li
                v-for="(value, index) in data.item"
                :key="index"
                @click="data.active = value.active"
              >
                <div class="row ml-2 my-3 list">
                  <span class="material-symbols-outlined mr-2 py-1 icon">
                    {{ value.icon }}
                  </span>
                  <span
                    class="mr-2 py-2 name"
                    :class="value.active == data.active ? 'isActive' : ''"
                  >
                    {{ value.name }}</span
                  >
                </div>
              </li>
            </ul>

            <div class="col-sm-9">
              <room v-if="data.active == 'room'" :_id="_id"></room>
              <customerView
                v-if="data.active == 'customer'"
                :_id="_id"
              ></customerView>
              <serviceView
                v-if="data.active == 'service'"
                :_id="_id"
              ></serviceView>
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
ul {
  list-style: none;
}
li {
  display: block;
}
.list {
  text-align: center;
  line-height: 1;
}
.icon {
  background-color: #7367f0;
  color: var(--beige);
  border-radius: 6px;
  width: 18%;
  text-align: center;
}
.name {
  text-transform: uppercase;
  font-size: 0.8rem;
}
.list:hover > * {
  text-shadow: 0 0 2px #fff;
  cursor: pointer;
  font-weight: 400;
}
.list:hover > .name,
.isActive {
  color: #5243f6;
  font-weight: 500;
}
</style>
