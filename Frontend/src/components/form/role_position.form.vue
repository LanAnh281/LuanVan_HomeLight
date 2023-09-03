<script>
import { reactive, onMounted, ref } from "vue";
//service
import roleService from "../../service/role.service";
import role_positionService from "../../service/role_position.service";
//component
import Select from "../../components/select/selectdependent.vue";

//js
import {
  checkStringAndNumber,
  checkAddress,
} from "../../assets/js/checkInput.common";
import { successAd, warning } from "../../assets/js/common.alert";
export default {
  components: { Select },
  props: { position: "" },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        name: "",
      },
      rolePosition: {},
      checkList: [],
    });
    const isModalOpen = ref(false);
    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal role position");
    };
    const closeModal = () => {
      console.log("close modal role position");
      emit("closeModal");
    };

    const save = async () => {
      try {
        const roles = data.item.filter((value) => value.checked);
        const remove = data.checkList.filter((item) => !roles.includes(item));
        for (let index in remove) {
          const removeRolePosition = await role_positionService.delete(
            props.position,
            { RoleId: remove[index]._id, PositionId: props.position }
          );
        }
        for (let index in roles) {
          const document = await role_positionService.create({
            RoleId: roles[index]._id,
            PositionId: props.position,
          });
        }
        emit("add");
        successAd("Đã áp dụng các quyền");
      } catch (error) {
        console.error(">>Error:", error);
        warning("Thất bại", "");
      }
    };
    const refresh = async () => {
      const document = await roleService.getAll();
      data.item = document.message;
      const documentRolePosition = await role_positionService.get(
        props.position
      );
      data.rolePosition = documentRolePosition.message;
      const length = data.item.length;
      const value = false;
      const lengthRolePosition = data.rolePosition.length;
      for (let i = 0; i < length; i++) {
        for (let j = 0; j < lengthRolePosition; j++) {
          if (data.item[i]._id == data.rolePosition[j].RoleId) {
            data.item[i].checked = true;
            continue;
          }
        }
        if (!data.item[i].checked) data.item[i].checked = value;
      }
      data.checkList = data.item.filter((item) => item.checked);
    };
    onMounted(async () => {
      refresh();
      $("#rolePositionModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#rolePositionModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      save,
      checkStringAndNumber,
      checkAddress,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="rolePositionModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Áp dụng quyền
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
          <form
            @submit.prevent="save"
            enctype="multipart/form-data"
            class="container mt-3"
          >
            <div
              class="form-group"
              v-for="(value, index) in data.item"
              :key="index"
            >
              <input
                type="checkbox"
                v-model="value.checked"
                :checked="value.checked"
              />

              {{ value.name }}
            </div>

            <div class="form-group row justify-content-around mb-0">
              <button type="submit" class="btn btn-login col-sm-3">
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
