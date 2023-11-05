<script>
import { ref, reactive, onMounted } from "vue";
import socket from "../../../socket";
import { useRoute, useRouter } from "vue-router";

//service
import billService from "../../../service/bill.service";
import serviceService from "../../../service/service.service";
import service_roomService from "../../../service/service_room.service";
import notificationService from "../../../service/notification.service";
import user_notificationService from "../../../service/user_notification.service";
// js
import { formatCurrency } from "../../../assets/js/format.common";
import { successAd } from "../../../assets/js/common.alert";
import { checkAccessToken } from "../../../assets/js/common.login";
//component
import Table from "../../../components/table/table.vue";

export default {
  components: { Table },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      item: {
        Rooms: [
          {
            name: "",
            address: "",
            price: 0,
            BoardingHouse: {
              name: "",
              User: {
                userName: "",
                address: "",
                phone: "",
                email: "",
                qrCodeUrl: "",
              },
            },
          },
        ],
      },
      services: [],
      serviceRoom: [],
      message: { comment: "", content: "" },
    });
    let intervalId = null;
    const refresh = async () => {
      try {
        const documentBill = await billService.getAllCustomer();
        data.item = documentBill.message;
        //lấy danh sách dịch vụ

        const documentService = await serviceService.getAll();
        data.services = documentService.message;
        // lấy ds dịch vụ của phòng
        const documentServiceRoom = await service_roomService.get(
          data.item.Rooms[0]._id
        );
        data.serviceRoom = documentServiceRoom.message;
        data.services = data.services.map((item) => {
          return {
            ...item,
            price: formatCurrency(item.price),
            checked: data.serviceRoom.some((obj) => obj.ServiceId == item._id),
          };
        });
        // lọc từ danh sách dịch vụ , lấy đầy đủ thông tin của dịch vụ
        data.services = data.services.filter((item) => item.checked == true);
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
    const save = async () => {
      try {
        if (!data.flag) {
          // data.submit = "Đang gửi tin...";
          data.message.content = `Nhà trọ ${data.item.Rooms[0].BoardingHouse.name} - Phòng ${data.item.Rooms[0].name} - Vấn đề ${data.message.comment}`;
          const documentNoti = await notificationService.create(data.message);

          const documentUserNoti = await user_notificationService.create({
            NotificationId: documentNoti.message["_id"],
            UserId: data.item.Rooms[0].BoardingHouse.User._id,
          });
          socket.emit("createNoti", data.item);
          // data.submit = "Gửi tin nhắn";
          refresh();
          successAd("Đã gửi");
          data.message.comment = "";
          data.message.content = "";
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
      try {
        await checkAccessToken(router); //access token
        intervalId = setInterval(async () => {
          await checkAccessToken(router);
        }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
        //khởi tạo selectDate là ngày hiện tại
        await refresh();
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    });
    return {
      data,
      formatCurrency,
      save,
    };
  },
};
</script>
<template>
  <div class="body m-0 container-fluid">
    <h6 class="title text-center my-3">Thông tin phòng trọ</h6>
    <div class="row mx-2">
      <div class="col-6 m-0 mr-1 p-0">
        <div class="row justify-content-start p-0 m-0">
          <p class="col-2 m-0 p-0">Tên nhà trọ:</p>
          <p class="col-8 m-0 p-0">
            {{ data.item.Rooms[0].BoardingHouse.name }}
          </p>
        </div>
        <div class="row justify-content-start p-0 m-0">
          <p class="col-2 m-0 p-0">Địa chỉ:</p>
          <p class="col-8 m-0 p-0">
            {{ data.item.Rooms[0].BoardingHouse.address }}
          </p>
        </div>
        <div class="col-12 row justify-content-start p-0 m-0">
          <p class="col-2 m-0 p-0">Mô tả :</p>
          <p class="col-6 p-0 m-0">
            {{ data.item.Rooms[0].content }}
          </p>
        </div>
        <div class="col-12 row justify-content-start p-0 m-0">
          <p class="col-2 m-0 p-0">Tiện ích :</p>
          <p
            class="p-0 m-0"
            v-for="(value, index) in data.item.Rooms[0].Amenities"
            :key="index"
          >
            {{ value.name }},
          </p>
        </div>
      </div>
      <div class="col-4 p-0 m-0">
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Tên phòng :</p>
          <p class="col-6 p-0 m-0">{{ data.item.Rooms[0].name }}</p>
        </div>
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Diện tích:</p>
          <p class="col-6 p-0 m-0">
            {{ data.item.Rooms[0].long }} x {{ data.item.Rooms[0].wide }} m²
          </p>
        </div>
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Đơn giá :</p>
          <p class="col-6 p-0 m-0">
            {{ formatCurrency(data.item.Rooms[0].price) }}
          </p>
        </div>
      </div>
    </div>
    <hr />
    <h6 class="title text-center my-3">Dịch vụ</h6>
    <Table
      :data="data.services"
      :fields="['Tên dịch vụ', 'Đơn giá', 'Đơn vị tính']"
      :titles="['name', 'price', 'unit']"
    ></Table>
    <hr />
    <div class="row m-0 p-0 mr-5">
      <h6 class="title text-center col-12">Hỗ trợ</h6>
      <div class="col-6">
        <form @submit.prevent="save" class="col m-0 p-0 ml-2">
          <div class="form-group row">
            <label for="inputroom" class="col-sm-2 m-0 col-form-label p-0"
              >Vấn đề :</label
            >
            <div class="col-sm-10">
              <textarea
                type="text"
                class="form-control"
                id="inputContent"
                rows="5"
                v-model="data.message.comment"
              ></textarea>
            </div>
          </div>
          <div class="form-group text-center justify-content-around mb-0 ml-3">
            <button type="submit" class="btn btn-login col-sm-2 text-center">
              Gửi
            </button>
          </div>
        </form>
      </div>
      <div class="col-4 m-0 ml-2 p-0">
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Tên chủ trọ :</p>
          <p class="col-6 p-0 m-0">
            {{ data.item.Rooms[0].BoardingHouse.User.userName }}
          </p>
        </div>

        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Điện thoại :</p>
          <p class="col-6 p-0 m-0">
            {{ data.item.Rooms[0].BoardingHouse.User.phone }}
          </p>
        </div>
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Email :</p>
          <p class="col-6 p-0 m-0">
            {{ data.item.Rooms[0].BoardingHouse.User.email }}
          </p>
        </div>
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Địa chỉ :</p>
          <p class="col-6 p-0 m-0">
            {{ data.item.Rooms[0].BoardingHouse.User.address }}
          </p>
        </div>
      </div>
      <div class="col m-0 p-0 card">
        <img :src="data.item.Rooms[0].qrCodeUrl" alt="QR" class="mx-2" />
        <p class="card-text text-center text-info">Liên hệ qua SĐT</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.body {
  height: 150vh;
}
</style>
