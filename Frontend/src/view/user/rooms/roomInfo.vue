<script>
import { reactive, onMounted } from "vue";
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
  <div class="body">
    <div class="row my-3">
      <h5 class="title text-center col-12 p-0">Thông tin phòng trọ</h5>
      <span class="text-center p-0 mx-auto dash col-12"> </span>

      <div class="row mx-2 col-12">
        <div class="col-md-4 col-12">
          <div
            id="carouselExampleCaptions"
            class="carousel slide"
            style="z-index: 0"
            data-ride="carousel"
          >
            <ol class="carousel-indicators">
              <li
                data-target="#carouselExampleCaptions"
                data-slide-to="0"
                class="active"
              ></li>
              <li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
              <li data-target="#carouselExampleCaptions" data-slide-to="2"></li>
            </ol>

            <div class="carousel-inner">
              <div
                class="carousel-item"
                :class="index == 0 ? 'active' : ''"
                v-for="(value, index) in data.item.Rooms[0].Media"
                :key="(index = 1)"
              >
                <img
                  :src="`http://localhost:3000/static/images/${value.name}`"
                  class="d-block w-100"
                  alt="ảnh nhà trọ"
                />
              </div>
            </div>

            <button
              class="carousel-control-prev"
              type="button"
              data-target="#carouselExampleCaptions"
              data-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Previous</span>
            </button>
            <button
              class="carousel-control-next"
              type="button"
              data-target="#carouselExampleCaptions"
              data-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Next</span>
            </button>
          </div>
        </div>
        <!--  -->
        <div class="col-md-7 col-12">
          <div class="row justify-content-start p-0 m-0 roomInfo">
            <p class="col-md-2 col-4">Tên nhà trọ:</p>
            <p class="col">
              {{ data.item.Rooms[0].BoardingHouse.name }}
            </p>
          </div>
          <div class="row justify-content-start p-0 m-0 roomInfo">
            <p class="col-md-2 col-4">Phòng trọ :</p>
            <p class="col p-0 m-0">{{ data.item.Rooms[0].name }}</p>
          </div>
          <div class="row justify-content-start p-0 m-0 roomInfo">
            <p class="col-md-2 col-4">Diện tích:</p>
            <p class="col p-0 m-0">
              {{ data.item.Rooms[0].long }} x {{ data.item.Rooms[0].wide }} m²
            </p>
          </div>

          <div class="row justify-content-start p-0 m-0 roomInfo">
            <p class="col-md-2 col-4">Giá thuê :</p>
            <p class="col">
              {{ formatCurrency(data.item.Rooms[0].price) }}
            </p>
          </div>
          <div class="col-12 row justify-content-start p-0 m-0 roomInfo">
            <p class="col-md-2 col-4">Mô tả :</p>
            <p class="col">
              {{ data.item.Rooms[0].content }}
            </p>
          </div>
          <div class="col-12 row justify-content-start p-0 m-0 roomInfo">
            <p class="col-md-2 col-4">Tiện ích :</p>
            <p
              class="p-1"
              v-for="(value, index) in data.item.Rooms[0].Amenities"
              :key="index"
            >
              {{ value.name }},
            </p>
          </div>
          <div class="row justify-content-start p-0 m-0 roomInfo">
            <p class="col-md-2 col-4">Địa chỉ:</p>
            <p class="col">
              {{ data.item.Rooms[0].BoardingHouse.address }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- Services -->
    <div class="row my-5 ml-3">
      <h5 class="title text-center col-12 p-0">Dịch vụ</h5>
      <span class="text-center p-0 mx-auto dash col-12"> </span>
      <div class="row col-12">
        <div class="col-md-8 col-12">
          <!-- <Table
            class="col-12 p-0"
            :data="data.services"
            :fields="['Tên dịch vụ', 'Đơn giá', 'Đơn vị tính']"
            :titles="['name', 'price', 'unit']"
          ></Table> -->
          <table class="table">
            <thead class="thead-dark">
              <tr class="roomInfo">
                <th scope="col">Tên dịch vụ</th>
                <th scope="col">Đơn giá</th>
                <th scope="col">Đơn vị tính</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(value, index) in data.services"
                :key="index"
                style="line-height: 2"
                class="roomInfo"
              >
                <td class="p-1">
                  {{ value["name"] }}
                </td>
                <td class="p-1">
                  {{ value["price"] }}
                </td>
                <td class="p-1">
                  {{ value["unit"] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-md d-md-block d-none w-100">
          <img
            src="https://images.pexels.com/photos/1439373/pexels-photo-1439373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="ảnh dịch vụ"
            class="w-100"
          />
        </div>
      </div>
    </div>
    <!-- Support -->
    <div class="row p-0 ml-3 my-5">
      <h5 class="title text-center col-12 p-0">Hỗ trợ</h5>
      <span class="text-center p-0 mx-auto dash"> </span>
      <div class="col-12 row">
        <div class="col-md d-md-block d-none">
          <img src="../../../assets/image/roominfo.jpg" class="w-100 h-75" />
        </div>
        <div class="col">
          <!--  -->
          <div class="row">
            <div class="col-md-8 col-12 m-0 ml-3 p-0">
              <div class="row justify-content-start p-0 m-0 roomInfo">
                <p class="col-md-2 col-5 m-0">Tên chủ trọ :</p>
                <p class="col-6 m-0">
                  {{ data.item.Rooms[0].BoardingHouse.User.userName }}
                </p>
              </div>

              <div class="row justify-content-start p-0 m-0 roomInfo">
                <p class="col-md-2 col-5 m-0">Điện thoại :</p>
                <p class="col-6 m-0">
                  {{ data.item.Rooms[0].BoardingHouse.User.phone }}
                </p>
              </div>
              <div class="row justify-content-start p-0 m-0 roomInfo">
                <p class="col-md-2 col-5 m-0">Email :</p>
                <p class="col-6 m-0">
                  {{ data.item.Rooms[0].BoardingHouse.User.email }}
                </p>
              </div>
              <div class="row justify-content-start p-0 m-0 roomInfo">
                <p class="col-md-2 col-5 m-0">Địa chỉ :</p>
                <p class="col-6 m-0">
                  {{ data.item.Rooms[0].BoardingHouse.User.address }}
                </p>
              </div>
            </div>
            <!-- <div class="col-md-2 d-none d-md-block m-0 p-0 card mb-5 roomInfo">
              <img :src="data.item.Rooms[0].qrCodeUrl" alt="QR" class="mx-2" />
              <p class="card-text text-center text-info mb-3">
                Liên hệ qua SĐT
              </p>
            </div> -->
            <div
              class="col-md-3 d-none d-md-block card mx-2 p-0 text-center h-50"
            >
              <img
                :src="data.item.Rooms[0].qrCodeUrl"
                alt="QR"
                class="mx-auto p-0"
              />

              <div class="card-body m-0 p-0 pb-2 roomInfo w-100">
                <p class="card-text text-info">Liên hệ qua SĐT</p>
              </div>
            </div>
          </div>
          <!--  -->
          <form @submit.prevent="save" class="col m-0 p-0 ml-2">
            <div class="form-group row roomInfo">
              <label for="inputroom" class="col-sm-2 m-0 col-form-label"
                >Phản ánh :</label
              >
              <div class="col">
                <textarea
                  type="text"
                  class="form-control"
                  id="inputContent"
                  rows="10"
                  v-model="data.message.comment"
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
.roomInfo > * {
  font-family: "Amarillo";
  font-size: 18px;
}
</style>
