<script>
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
//js
import { checkAccessToken } from "../../../assets/js/common.login";

export default {
  components: {},

  setup() {
    const router = useRouter();
    const data = reactive({ item: [] });
    onMounted(async () => {
      await checkAccessToken(router);
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
    });
    return { data };
  },
};
</script>
<template>
  <div class="body">
    <div class="border-radius my-3 row m-0 justify-content-end">
      <div class="col-8 m-0 p-0 row justify-content-end">
        <button
          class="col-3 mr-3 btn btn-primary"
          style="max-width: 20%; height: 36px; margin-top: 6px"
          data-toggle="modal"
          data-target="#roleModal"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              add
            </span>
            <span style="color: var(--white)">Thêm dịch vụ</span>
          </div>
        </button>
        <!-- delete many services -->
        <button
          class="col-3 mr-3 btn btn-danger"
          style="max-width: 20%; height: 36px; margin-top: 6px"
          data-toggle="modal"
          data-target="#roleModal"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              close
            </span>
            <span style="color: var(--white)">xóa dịch vụ</span>
          </div>
        </button>
      </div>
    </div>
    <table class="table p-0 mt-3">
      <thead class="thead-dark">
        <th scope="col"></th>
        <th scope="col">Tên dịch vụ</th>
        <th scope="col">Đơn giá</th>
        <th scope="col"></th>
      </thead>
      <tbody>
        <tr>
          <th></th>
          <th>
            <span
              class="material-symbols-outlined mr-2 rounded-circle delete-icons"
              title="xóa thành viên"
            >
              close
            </span>
            <span
              class="material-symbols-outlined rounded-circle edit-icon"
              title="xóa thành viên"
            >
              edit
            </span>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scope>
.body {
  min-height: 100vh;
}
.delete-icons,
.edit-icon {
  color: rgb(222, 226, 229);
  font-size: 1.8rem;
  width: 14%;
  height: 48px;
  text-align: center;
  line-height: 1.6;
}
.delete-icons {
  background-color: red;
}
.edit-icon {
  background-color: rgb(255, 166, 0);
}
</style>
