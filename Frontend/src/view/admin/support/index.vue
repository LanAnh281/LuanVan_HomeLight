<script>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { checkAccessToken } from "../../../assets/js/common.login";
import { formatCurrency } from "../../../assets/js/format.common";
import { successAd } from "../../../assets/js/common.alert";
import systemService from "../../../service/system.service";
import notificationService from "../../../service/notification.service";
import user_notificationService from "../../../service/user_notification.service";
import socket from "../../../socket";
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const data = reactive({
      system: [
        {
          content: "",
          email: "",
          phone: "",
          service: "",
          serviceName: "",
          servicePrice: "",
          serviceUnit: "",
          userId: "",
        },
      ],
      support: {
        content: "",
        sender: "to super-admin",
      },
    });
    let intervalId = null;
    const save = async () => {
      try {
        console.log(data.item);
        data.support.content = `${localStorage.getItem(
          "userName"
        )}  ${localStorage.getItem("phone")} - ${data.support.content} `;
        const documentNoti = await notificationService.create(data.support);
        const documentUserNoti = await user_notificationService.create({
          NotificationId: documentNoti.message["_id"],
          UserId: data.system[0].userId,
        });
        // send mail
        socket.emit("createNoti", data.item);
        // data.submit = "Gửi tin nhắn";
        refresh();
        successAd("Đã gửi");
        data.support.content = "";
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
    const refresh = async () => {
      try {
        data.system = await systemService.getAll();
        data.system = data.system.message;
        data.system = data.system.map((item) => {
          const service = item.service.split(" - ");
          return {
            ...item,
            serviceName: service[0],
            servicePrice: formatCurrency(service[1]),
            serviceUnit: service[2],
          };
        });
        console.log(data.system);
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

      await refresh();
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return { data, save };
  },
};
</script>

<template>
  <div class="body">
    <!-- Infomation -->
    <div class="row p-0 my-5">
      <h5 class="title text-center col-12 p-0">Hỗ trợ</h5>
      <span class="text-center p-0 mx-auto dash"> </span>
      <div class="col-12 row py-2">
        <!-- <div class="col-md-4 d-md-block d-none">
          <img src="../../../assets/image/homepage12.jpg" class="w-100 h-75" />
        </div> -->
        <div class="col">
          <div class="row mb-2">
            <div class="col-md-10 col-12 m-0 p-0">
              <div class="row justify-content-start p-0 m-0 roomInfo">
                <p class="col-md-2 col-5 m-0">Mô tả hệ thống :</p>
                <p class="col-md m-0">{{ data.system[0].content }}</p>
              </div>
              <div class="row justify-content-start p-0 m-0 roomInfo">
                <p class="col-md-2 col-5 m-0">Giá thuê:</p>
                <p class="col-md m-0">
                  {{ data.system[0].servicePrice }}/
                  {{ data.system[0].serviceUnit }}
                </p>
              </div>
              <div class="row justify-content-start p-0 m-0 roomInfo">
                <p class="col-md-2 col-5 m-0">Điện thoại :</p>
                <p class="col-md m-0">{{ data.system[0].phone }}</p>
              </div>
              <div class="row justify-content-start p-0 m-0 roomInfo">
                <p class="col-md-2 col-5 m-0">Email :</p>
                <p class="col-md m-0">{{ data.system[0].email }}</p>
              </div>
            </div>

            <div
              class="col-md d-none d-md-block card mx-2 p-0 text-center h-50"
            >
              <img
                :src="data.system[0].qrCodeUrl"
                alt="QR"
                class="mx-auto p-0"
              />

              <div class="card-body m-0 p-0 pb-2 roomInfo w-100">
                <p class="card-text text-info">Liên hệ qua SĐT</p>
              </div>
            </div>
          </div>
          <!--  -->
          <form @submit.prevent="save">
            <div class="form-group row roomInfo">
              <label for="inputroom" class="col-md-2 m-0">Phản ánh :</label>
              <div class="col-md">
                <textarea
                  type="text"
                  class="form-control"
                  id="inputContent"
                  rows="10"
                  v-model="data.support.content"
                  style="margin-left: -40px"
                ></textarea>
              </div>
            </div>
            <div
              class="form-group text-center justify-content-around mb-0 ml-3"
            >
              <button type="submit" class="btn btn-login col-sm-1 text-center">
                Gửi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.body {
  height: 100vh; /* Đặt chiều cao cho .body theo chiều cao của viewport */
  overflow: auto; /* Cho phép nội dung trượt khi vượt quá chiều cao của .body */
}
.dash {
  color: var(--chocolate);
  width: 80px;
  border: 1px var(--chocolate) solid;
}
</style>
