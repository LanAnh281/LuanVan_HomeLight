<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";

//service
import boardinghouseService from "../../../../service/boardinghouse.service";
import roomService from "../../../../service/room.service";
import mediaService from "../../../../service/media.service";
//Form
import addCustomerForm from "./addCustomer.form.vue";
import addMemberForm from "./addMember.form.vue";
import Service from "./service.vue";
export default {
  components: { addCustomerForm, addMemberForm, Service },
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: [
        { name: "Khách thuê", icon: "person", active: "customer" },
        { name: "Thành viên", icon: "group_add", active: "member" },
        {
          name: "Dịch vụ ",
          icon: "energy_program_time_used",
          active: "service",
        },
      ],
      active: "room",
      room: { name: "", price: "", area: "" },
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
      console.log("PropsId room:", props._id);
      data.active = "customer";
      $("#addCustomerModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#addCustomerModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });
    return { data };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="addCustomerModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Thêm khách trọ
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
          <!-- nhà trọ -->
          <div class="form-group row" style="margin-right: -82px">
            <ul class="col-sm-2 m-0 p-0">
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
            <!-- component Customer -->
            <div class="col-sm-9 px-4 pt-1 mt-2">
              <addCustomerForm
                v-if="data.active == 'customer'"
              ></addCustomerForm>
              <div>
                <span
                  class="material-symbols-outlined rounded-circle float-right mb-1"
                  style="
                    color: var(--white);
                    background-color: green;
                    margin-top: -14px;
                  "
                  title="Thêm thành viên"
                  v-if="data.active == 'member'"
                  @click="data.active = 'customer'"
                >
                  add
                </span>
                <addMemberForm
                  class="m-0 p-0"
                  v-if="data.active == 'member'"
                ></addMemberForm>
              </div>
              <Service
                class="m-0 p-0"
                v-if="data.active == 'service'"
              ></Service>
            </div>
            <!-- Component Member -->
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
