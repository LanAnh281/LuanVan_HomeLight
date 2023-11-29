<script>
import { reactive, onMounted, ref } from "vue";
import socket from "../../../socket";
//service
import notificationService from "../../../service/notification.service";
import user_notificationService from "../../../service/user_notification.service";
import mailService from "../../../service/mail.service";
import userService from "../../../service/user.service";

//js
import {
  checkString,
  checkPhone,
  checkStringAndNumber,
  checkMail,
} from "../../../assets/js/checkInput.common";
import { successAd } from "../../../assets/js/common.alert";
export default {
  components: {},
  props: {
    roomName: { type: String, default: "" },
    boardingName: { type: String, default: "" },
    userId: { type: String, default: "" },
  },
  setup(props, { emit }) {
    const data = reactive({
      item: { name: "", phone: "", email: "", comment: "", content: "" },
      error: { name: "", phone: "", email: "", comment: "" },
      flag: true,
      submit: "Gửi tin nhắn",
    });
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal map");
    };
    const closeModal = () => {
      console.log("close modal map");
      emit("closeModal");
    };
    const refresh = () => {
      data.item = { name: "", phone: "", email: "", comment: "", content: "" };
      data.error = { name: "", phone: "", email: "", comment: "" };
    };
    const save = async () => {
      try {
        for (let key in data.error) {
          if (data.item[key] == "") {
            data.error[key] = "Chưa nhập thông tin";
            data.flag = true;
          }
        }
        if (!data.flag) {
          data.submit = "Đang gửi tin...";
          data.item.content = `Khách hàng: ${data.item.name} - Thông tin liên lạc: ${data.item.phone} , ${data.item.email} -  Yêu cầu: ${data.item.comment}`;
          const documentNoti = await notificationService.createCustomer(
            data.item
          );

          const documentUserNoti = await user_notificationService.create({
            NotificationId: documentNoti.message["_id"],
            UserId: props.userId,
          });
          socket.emit("createNoti", data.item);
          data.submit = "Gửi tin nhắn";
          const landlord = await userService.get(props.userId);
          // console.log(landlord.message);
          const documentMail = await mailService.sendMail({
            title: "[Thông báo] Có khách trọ đang quan tâm đến nhà trọ của bạn",
            content: `<h3>Quản lý nhà trọ HomeLight kính chào Anh/Chị: ${landlord.message.userName}</h3>
                  <p> Anh/Chị vừa nhận được sự quan tâm của khách trọ đối với phòng trọ ${props.roomName} của nhà trọ ${props.boardingName}.
                    <p>Dưới đây là thông tin liên hệ của khách trọ :</p>
                  <ul>
                    <li>Họ và tên : ${data.item.name}</li>
                    <li>SĐT : ${data.item.phone}</li>
                    <li>Email : ${data.item.email}</li>
                    <li>Nội dung quan tâm của khách hàng : ${data.item.comment}</li>
                  </ul>
                
                  <p>Mọi thắc mắc và góp ý, xin Anh/Chị vui lòng liên hệ với chúng tôi qua:</p>
                  <p> Email hỗ trợ: info@maple.com.vn </p>
                  <p> Điện thoại: 0915 85 0918</p>
                  <p>HomeLight trân trọng cảm ơn và rất hân hạnh được phục vụ Anh/Chị.</p>`,
            mail: landlord.message.email,
          });

          refresh();
          successAd("Đã gửi tin nhắn");
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
      console.log(props);
      $("#messageModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#messageModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      checkString,
      checkPhone,
      checkStringAndNumber,
      checkMail,
      save,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="messageModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">Gửi tin nhắn</h5>
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
              <label for="inputroom" class="col-sm-2 col-form-label p-0"
                >Họ và tên <sup class="text-danger">(*)</sup></label
              >
              <div class="col-sm-10">
                <input
                  type="text"
                  class="form-control"
                  id="inputroom"
                  @blur="
                    () => {
                      let isCheck = checkStringAndNumber(data.item.name);
                      if (isCheck) {
                        data.error.name = 'Họ và tên không chứa ký tự đặc biệt';
                        data.flag = true;
                      }
                    }
                  "
                  @input="
                    data.error.name = '';
                    data.flag = false;
                  "
                  v-model="data.item.name"
                />
                <div v-if="data.error.name" class="invalid-error">
                  {{ data.error.name }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputroom" class="col-sm-2 col-form-label p-0"
                >SĐT <sup class="text-danger">(*)</sup></label
              >
              <div class="col-sm-10">
                <input
                  type="tel"
                  class="form-control"
                  id="inputroom"
                  @blur="
                    () => {
                      let isCheck = checkPhone(data.item.phone);
                      if (isCheck) {
                        data.error.phone = 'SĐT gồm 10 số';
                        data.flag = true;
                      }
                    }
                  "
                  @input="
                    data.error.phone = '';
                    data.flag = false;
                  "
                  v-model="data.item.phone"
                />
                <div v-if="data.error.phone" class="invalid-error">
                  {{ data.error.phone }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputroom" class="col-sm-2 col-form-label p-0"
                >Email <sup class="text-danger">(*)</sup></label
              >
              <div class="col-sm-10">
                <input
                  type="tel"
                  class="form-control"
                  id="inputroom"
                  @blur="
                    () => {
                      let isCheck = checkMail(data.item.email);
                      if (isCheck) {
                        data.error.email = 'Sai định dạng email';
                        data.flag = true;
                      }
                    }
                  "
                  @input="
                    data.error.email = '';
                    data.flag = false;
                  "
                  v-model="data.item.email"
                />
                <div v-if="data.error.email" class="invalid-error">
                  {{ data.error.email }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputComment" class="col-sm-2 col-form-label p-0"
                >Tin nhắn <sup class="text-danger">(*)</sup></label
              >
              <div class="col-sm-10">
                <textarea
                  type="text"
                  class="form-control"
                  id="inputContent"
                  v-model="data.item.comment"
                ></textarea>
              </div>
            </div>
            <div class="form-group row justify-content-around mb-0">
              <button type="submit" class="btn btn-login col-sm-3">
                {{ data.submit }}
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
  width: 100%;
  height: 100%;
}
.modal-body {
  width: 100%;
}
</style>
