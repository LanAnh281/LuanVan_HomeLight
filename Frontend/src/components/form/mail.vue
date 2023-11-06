<script>
import { reactive, onMounted, ref } from "vue";

//service
import mailService from "../../service/mail.service";
import { checkCookieExistence } from "../../assets/js/common.login";
import { successAd } from "../../assets/js/common.alert";
// js
import { sanitizeInput } from "../../assets/js/checkInput.common";
export default {
  components: {},
  props: { checkedList: { type: Array, default: [] } },
  setup(props, { emit }) {
    const data = reactive({
      item: { content: "", title: "", btnSubmit: "Gửi" },
      error: { title: "", content: "" },
      flag: false,
    });
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal MAIL user");
    };
    const closeModal = () => {
      console.log("close modal MAIL user");
      emit("closeModal");
    };
    const save = async () => {
      try {
        data.flag = false;
        for (let key in data.item) {
          if (data.item[key] == "" && key != "btnSubmit") {
            data.error[key] = "Chưa nhập thông tin";
            data.flag = true;
          }
        }
        if (!data.flag) {
          data.item.btnSubmit = "Đang gửi...";
          for (let index in props.checkedList) {
            const documentMail = await mailService.sendMail({
              title: data.item.title,
              content: data.item.content,
              mail: props.checkedList[index].email,
            });
          }
          successAd("Thành công");
          data.item.btnSubmit = "Gửi";
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
      $("#mailModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#mailModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });
    return { data, save };
  },
};
</script>
<template>
  <!-- 
        1. có khung soạn mail gửi khách trọ 
        2. Thao tác gửi mail đến khách trọ
     -->
  <div
    class="modal fade"
    id="mailModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">Thư mới</h5>
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
          <form @submit.prevent="save" class="form mr-3">
            <div class="row form-group">
              <label for="to" class="col-sm-2">Đến :</label>

              <span
                v-for="(value, index) in checkedList"
                :key="index"
                class="mr-2 border rounded px-1"
                >{{ value.email }}</span
              >
            </div>
            <div class="row form-group">
              <label for="title" class="col-sm-2">Tiêu đề :</label>
              <div class="col-sm-10 m-0 p-0">
                <input
                  type="text"
                  id="title"
                  v-model="data.item.title"
                  class="form-control"
                />
                <div v-if="data.error.title" class="invalid-error">
                  {{ data.error.title }}
                </div>
              </div>
            </div>
            <div class="row form-group">
              <label for="content" class="col-sm-2">Nội dung :</label>
              <div class="col-sm-10 m-0 p-0">
                <textarea
                  id="content"
                  cols="30"
                  rows="10"
                  class="form-control"
                  v-model="data.item.content"
                ></textarea>
                <div v-if="data.error.content" class="invalid-error">
                  {{ data.error.content }}
                </div>
              </div>
            </div>
            <div class="text-center row justify-content-around">
              <button
                class="btn btn-login"
                :disabled="data.btnSubmit == 'Đang gửi'"
              >
                {{ data.item.btnSubmit }}
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
</style>
