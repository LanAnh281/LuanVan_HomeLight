<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";

//service
// view
export default {
  components: {},
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: [],
    });
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal edit user");
    };
    const closeModal = () => {
      console.log("close modal edit user");
      emit("closeModal");
    };
    onMounted(async () => {
      console.log("PropsId:", props._id);

      $("#editUserModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#editUserModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });
    return { data };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="editUserModal"
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
        <div class="modal-body"></div>
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
