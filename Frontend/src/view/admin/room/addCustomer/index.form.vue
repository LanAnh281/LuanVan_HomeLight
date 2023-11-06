<script>
import { reactive, onMounted, ref } from "vue";
import _ from "lodash";

//service
//Form
import addCustomerForm from "./addCustomer.form.vue";
import addOldMemberForm from "./addOldMember.form.vue";
import addMemberForm from "./addMember.form.vue";

import Service from "./addService.vue";
export default {
  components: { addCustomerForm, addOldMemberForm, addMemberForm, Service },
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
      active: "customer",
      form: "addNewMember",
      room: { name: "", price: "", wide: "", long: "" },
    });
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal view room");
    };
    const closeModal = () => {
      console.log("close modal view room");
      emit("closeModal");
      // location.reload();
    };
    onMounted(async () => {
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
          <h5 class="modal-title title py-0" id="exampleModalLabel">
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
        <div class="modal-body mt-0 py-0">
          <!-- nhà trọ -->
          <div class="form-group row" style="margin-right: -82px">
            <ul class="col-sm-2 m-0 mt-2 p-0">
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
            <div class="col-sm-10 row px-4 pt-1 mt-0">
              <addCustomerForm
                class="col-11 m-0 p-0"
                v-if="data.active == 'customer' && data.form == 'addNewMember'"
                :_id="_id"
                @changeStatus="
                  (value) => {
                    $emit('changeStatus');
                  }
                "
              ></addCustomerForm>

              <!-- Member -->
              <div class="col-11 m-0 p-0">
                <addMemberForm
                  class="m-0 p-0"
                  v-if="data.active == 'member'"
                  :_id="_id"
                  @changeStatus="
                    (value) => {
                      $emit('changeStatus');
                    }
                  "
                ></addMemberForm>
              </div>

              <Service
                class="m-0 p-0 col-11 mt-3"
                v-if="data.active == 'service'"
                :_id="_id"
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
  width: 180%;
  margin-left: -36%;
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
.btn-modal {
  color: var(--white);
  background-color: var(--chocolate);
  margin-top: -14px;
  font-size: 1rem;
  padding: 4px;
  text-align: center;
  display: flex;
  align-items: center; /* Căn giữa theo chiều dọc */
}
.btn-modal > * {
  color: var(--white);
}
.btn-modal :hover {
  text-shadow: 0 0 3px #fff;
}
.isAddCustomer {
  background-color: var(--ruby);
}
</style>
