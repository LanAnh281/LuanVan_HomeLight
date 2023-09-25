<script>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";

//service
import boardinghouseService from "../../../service/boardinghouse.service";
import roomService from "../../../service/room.service";
import mediaService from "../../../service/media.service";

//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";

export default {
  components: {},
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      items: [{ name: "" }], //list
    });
    let intervalId = null;
    const refresh = async () => {
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
    onMounted(async () => {
      await checkAccessToken(router); //access token
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,
    };
  },
};
// 1.Thống kê tổng thu nhập:
// Điều này bao gồm tổng số tiền thu được từ việc cho thuê nhà trọ trong
// một khoảng thời gian cụ thể (thường là hàng tháng hoặc hàng năm).
// 2.Thống kê Trạng thái phòng (trống, đang thuê)
//3Thống kê khách hàng: Số lượng khách thuê,
//  thông tin liên hệ của họ và thời gian họ đã ở trong nhà trọ.
//Thống kê về tình hình sửa chữa và bảo trì:
//  Các công việc sửa chữa và bảo trì cần
// được ghi lại để đảm bảo rằng nhà trọ luôn ở trong tình trạng tốt.
/*
xác định quyền và kiểm tra lỗi
*/
</script>

<template>
  <div class="body m-0">
    <nav></nav>
    <div class="border-radius my-3 row m-0 justify-content-start">
      <div class="input-group col-2 align-items-center"></div>
      <div class="input-group col-2 align-items-center"></div>
      <!-- btn add boarding house -->
      <div class="col-8 mr-1 p-0 row justify-content-end">
        <div class="mr-1">
          <button
            class="btn btn-primary p-0"
            style="width: 103px; height: 36px; margin-top: 6px"
          >
            <div class="row justify-content-center plus">
              <span
                class="material-symbols-outlined"
                style="color: var(--white)"
              >
                domain_add
              </span>
              <span style="color: var(--white)">Thêm nhà</span>
            </div>
          </button>
        </div>
        <!-- component  -->

        <div class="mr-1">
          <button
            class="btn btn-primary p-0 mr-0"
            style="width: 103px; height: 36px; margin-top: 6px"
          >
            <div class="row justify-content-center">
              <span
                class="material-symbols-outlined"
                style="color: var(--white)"
              >
                post_add
              </span>
              <span style="color: var(--white)">Quy định</span>
            </div>
          </button>
        </div>
        <!--  btn edit room -->
        <div class="">
          <button
            class="btn btn-warning"
            style="width: 118px; height: 36px; margin-top: 6px"
          >
            <div class="row justify-content-center plus">
              <span
                class="material-symbols-outlined mr-1"
                style="color: var(--white)"
              >
                edit
              </span>
              <span style="color: var(--white)">Sửa nhà trọ</span>
            </div>
          </button>
          <!-- component" -->
        </div>
        <!-- component  -->
      </div>
    </div>
  </div>
</template>
<style scoped>
.body {
  min-height: 100vh;
}
</style>
