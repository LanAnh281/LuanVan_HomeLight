<script>
import { reactive, onMounted, ref, onBeforeMount } from "vue";
import _ from "lodash";

//service
//component
import Select from "../../../components/select/select.vue";
//js
export default {
  components: { Select },
  props: { boarding: { type: Array, default: [] } },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        content: "",
      },
    });
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal add room");
    };
    const closeModal = () => {
      console.log("close modal add room");
      filesRef.value.value = "";
      emit("closeModal");
    };

    const save = async () => {
      try {
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
      $("#noteModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#noteModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
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
    id="noteModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Thêm phòng trọ
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
            style="text-align: start"
          >
            <div class="form-group row">
              <label for="inputContent" class="col-sm-3 col-form-label p-0"
                >Mô tả thêm :</label
              >
              <div class="col-sm-9">
                <textarea
                  type="text"
                  class="form-control"
                  id="inputContent"
                  v-model="data.item.content"
                ></textarea>
              </div>
            </div>

            <div class="form-group row justify-content-around mb-0">
              <button type="submit" class="btn btn-login col-sm-2">Thêm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-content {
  width: 120%;
  margin-left: -12%;
}
</style>
