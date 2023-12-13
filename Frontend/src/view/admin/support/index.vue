<script>
import { reactive, ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

//services
import notificationService from "../../../service/notification.service";
import user_notificationService from "../../../service/user_notification.service";
import socket from "../../../socket";
//component
import supportChat from "./supportChat.vue";
//service
import boardinghouseService from "../../../service/boardinghouse.service";
//component
import Table from "../../../components/table/table.vue";
import paginationVue from "../../../components/pagination/pagination.vue";
import Select from "../../../components/select/select.vue";
// js
import { formatDateTime } from "../../../assets/js/format.common";

import { checkAccessToken } from "../../../assets/js/common.login";
import { formatCurrency } from "../../../assets/js/format.common";
import { successAd } from "../../../assets/js/common.alert";
import systemService from "../../../service/system.service";

export default {
  // components: { supportUser },
  components: { Select, Table, paginationVue, supportChat },
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
      supportName: "user",
      //
      item: [{}],
      userId: "",
      setPage: [],
      currentPage: 1,
      sizePage: 10,
      length: 0,
      totalPage: 0,
      selectDate: new Date(),
      notiActive: "",
      informationNoti: "",
    });
    //
    const now = new Date();
    data.length = computed(() => (data.item ? data.item.length : 0));
    data.totalPage = computed(() => {
      return data.item ? Math.ceil(data.item.length / data.sizePage) : 0;
    });

    data.setPage = computed(() => {
      return data.item
        ? data.item.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : [];
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
    //
    const handleDate = async (value) => {
      data.selectDate = new Date(value.target.value);
      await refresh();
    };
    const respone = async (value) => {
      try {
        // console.log("nội dung:", value, "id noti:", data.notiActive);
        const documentNoti = await notificationService.get(data.notiActive);
        // console.log(documentNoti);
        const documentNotification = await notificationService.create({
          content: value.content,
          sender: data.userId,
          receiver: documentNoti.message[0].sender,
        });
        // update
        const documentNotificationUpdate = await notificationService.update(
          data.notiActive,
          {
            isResponse: true,
            response: value.content,
          }
        );
        console.log(documentNotificationUpdate);
        const documentUserNoti = await user_notificationService.create({
          NotificationId: documentNotification.message["_id"],
          UserId: documentNoti.message[0].sender,
        });
        // console.log(documentUserNoti);
        socket.emit("createNoti", documentNoti);
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
    const infoNoti = async (value) => {
      try {
        data.notiActive = value;
        const documentNoti = await notificationService.get(data.notiActive);
        data.informationNoti = documentNoti.message[0];
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
        //
        const documentBoarding = await boardinghouseService.getAllUser();
        data.userId = documentBoarding.message[0].userId;

        const document = await notificationService.getAll();
        data.item = document.message.filter((item) => {
          const date = new Date(item.createdAt);
          return (
            item.receiver == data.userId &&
            date.getMonth() + 1 == data.selectDate.getMonth() + 1 &&
            date.getFullYear() == data.selectDate.getFullYear()
          );
        });
        console.log("noti:", data.item);
        data.item = data.item.map((item) => {
          const content = item.content.split(" - ");
          console.log(content);
          return {
            ...item,
            boarding: `${content[0]}-${content[1]}`,
            user: `${content[2].split(":")[1]}- ${content[3].split(":")[1]}`,
            content: content[4].split(":")[1],
            createdAt: formatDateTime(item.createdAt),
            isStatus: item.isResponse ? "Đã phản hồi" : "Chưa phản hồi",
          };
        });
        data.item.sort((a, b) => a.isResponse - b.isResponse);
        console.log("noti:", data.item);
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
    return { data, save, handleDate, respone, infoNoti };
  },
};
</script>

<template>
  <div class="body">
    <div class="border-radius mb-3 row m-0 row justify-content-end">
      <div class="mr-1">
        <button
          class="btn btn-primary p-0"
          style="width: 103px; height: 36px; margin-top: 6px"
          data-toggle="modal"
          data-target="#boardingModal"
          @click="data.supportName = 'user'"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              people
            </span>
            <span style="color: var(--white); font-size: 16px">Khách trọ</span>
          </div>
        </button>
      </div>

      <div class="mr-1">
        <button
          class="btn btn-success p-0"
          style="width: 103px; height: 36px; margin-top: 6px"
          @click="data.supportName = 'admin'"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              settings_applications
            </span>
            <span style="color: var(--white); font-size: 16px">Hệ thống</span>
          </div>
        </button>
      </div>
    </div>
    <!--  support user-->
    <!-- <supportUser v-if="data.supportName == 'user'"></supportUser> -->
    <div v-if="data.supportName == 'user'">
      <div class="border-radius mb-3 row m-0 justify-content-start">
        <input
          type="month"
          class="border rounded py-1 text-center col-2 mt-2 mx-1"
          style="height: 33px; background-color: var(--background)"
          @input="handleDate"
        />
      </div>
      <h5 class="title text-center">
        Phản ánh của khách trọ tháng {{ data.selectDate.getMonth() + 1 }}/{{
          data.selectDate.getFullYear()
        }}
      </h5>
      <Table
        :data="data.setPage"
        :fields="[
          'Nhà trọ',
          'Khách trọ',
          'Nội dung',
          'Thời gian',
          'Trạng thái',
        ]"
        :titles="['boarding', 'user', 'content', 'createdAt', 'isStatus']"
        :name="'support'"
        :action="true"
        :actionList="['chat']"
        @chat="
          (value) => {
            infoNoti(value);
          }
        "
      >
      </Table>
      <supportChat
        :dataProps="data.informationNoti"
        @add="
          (value) => {
            respone(value);
          }
        "
      ></supportChat>
      <paginationVue
        :currentPage="data.currentPage"
        :totalPage="data.totalPage"
        :size="data.sizePage"
        :length="data.length"
        @page="(value) => (data.currentPage = value)"
        @previous="
          () => {
            if (data.currentPage > 1) {
              data.currentPage = data.currentPage - 1;
            }
          }
        "
        @next="
          () => {
            if (data.currentPage < data.totalPage) {
              data.currentPage = data.currentPage + 1;
            }
          }
        "
      ></paginationVue>
    </div>
    <!-- Infomation Admin-->
    <div class="row p-0 my-5" v-if="data.supportName == 'admin'">
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
