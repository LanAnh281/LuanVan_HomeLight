<script>
import { ref, reactive, watch, computed, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import "leaflet/dist/leaflet.css"; // Import CSS của Leaflet
import L from "leaflet";
//service
import roomService from "../../../service/room.service";
import serviceService from "../../../service/service.service";
//js
import { formatCurrency } from "../../../assets/js/format.common";

//component
import paginationVue from "../../../components/pagination/pagination.vue";
import Message from "./message.vue";

export default {
  components: { paginationVue, Message },
  setup() {
    const router = useRoute();
    const route = useRoute();
    const data = reactive({
      item: { name: "" },
    });
    const room = reactive({
      items: [
        {
          name: "",
          long: "",
          wide: "",
          BoardingHouse: { name: "" },
          Media: [{ name: "lightHouse.png" }],
          url: "",
        },
      ],
      services: [{ name: "", price: "" }],
      city: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
      address: "",

      setPage: "",

      totalPage: 0,
      currentPage: 1,
      length: 0,
      sizePage: 12,
    });
    let intervalId = null;
    const isMessage = ref(false);
    room.totalPage = computed(() =>
      room.items ? Math.ceil(room.items.length / room.sizePage) : 0
    );
    room.length = computed(() => (room.items ? room.items.length : 0));
    room.setPage = computed(() =>
      room.items
        ? room.items.slice(
            (room.currentPage - 1) * room.sizePage,
            room.currentPage * room.sizePage
          )
        : []
    );
    const refresh = async () => {
      try {
        const documentRoom = await roomService.get(router.query["_id"]);
        data.item = documentRoom.message;
        data.item.content = data.item.content.split("-");
        if (data.item.Media.length == 0) {
          data.item.Media[0] = { name: "lightHouse.png" };
        }
        room.address = data.item.BoardingHouse.address.split("-");
        room.address = room.address[2];

        const documentRooms = await roomService.getAll();
        room.items = documentRooms.message;
        // room.items = room.items.filter((item) => item.status == false);
        if (room.address != "") {
          room.items = room.items.filter((item) => {
            return (
              item.BoardingHouse.address.includes(room.address) &&
              Number(item.price) <= Number(data.item.price)
            );
          });
        }
        const documentService = await serviceService.getAll();
        data.services = documentService.message;

        data.services = data.services.filter((item) => {
          return item.userId == data.item.BoardingHouse.userId;
        });
        //gg map

        // data.item.url = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAfBTUmNCOXHwBa0KNlsv4Eaxx_jBFY0EQ&q=${data.item.BoardingHouse.address}`;
        // // AIzaSyCqNLriKAssr6bSDriqJg2YdfwqdBAYy30
        // // console.log(data.item);

        //Map
        // Tạo bản đồ
        const map = L.map("map").setView([0, 0], 12);

        // Sử dụng dữ liệu OpenStreetMap miễn phí
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
          map
        );

        // Tên địa điểm bạn muốn tìm
        const locationName = data.item.BoardingHouse.address;

        // Sử dụng dịch vụ OpenStreetMap Nominatim
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${locationName}`
        );
        const dataMap = await response.json();

        // Kiểm tra xem có kết quả trả về từ dịch vụ geocoding không
        if (dataMap && dataMap.length > 0) {
          // Trích xuất tọa độ từ kết quả đầu tiên
          const firstResult = dataMap[0];
          const coordinates = [
            parseFloat(firstResult.lat),
            parseFloat(firstResult.lon),
          ];

          // Chuyển đến vị trí tìm thấy trên bản đồ
          map.setView(coordinates, 50);

          // Thêm marker cho địa điểm tìm thấy
          L.marker(coordinates).addTo(map);
        } else {
          console.error("Không tìm thấy địa điểm.");
        }

        room.items = room.items.sort((a, b) => a.price - b.price);
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
    watch(
      () => route.fullPath,
      async (newValue, oldValue) => {
        // console.log("path:", newValue);
        await refresh();
      }
    );
    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
    onBeforeMount(async () => {
      await refresh();
    });

    return {
      data,
      room,
      formatCurrency,
      isMessage,
      capitalizeFirstLetter,
    };
  },
};
</script>
<template>
  <div class="body container-fluid m-0 px-5 py-3">
    <router-link :to="{ name: 'boarding' }" class="text-primary">
      <span style="font-size: 16px; text-transform: uppercase">Nhà trọ / </span>
    </router-link>

    <span class="title" style="font-size: 16px">Phòng </span>
    <div class="row" v-if="data.item.BoardingHouse">
      <!-- <img
        v-if="data.item.status == true"
        src="https://theme.hstatic.net/1000367813/1000963523/14/sold.png?v=170"
        alt="ảnh sold out"
        style="margin-left: 42%; width: 8%"
        class="col-1"
      /> -->

      <div
        id="carouselExampleCaptions"
        class="carousel slide col-md-6 col-12 mt-1"
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
            v-for="(value, index) in data.item.Media"
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
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-target="#carouselExampleCaptions"
          data-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </button>
      </div>
      <!-- Infor -->
      <div class="col p-0">
        <div class="row p-0">
          <div class="col-md-6 col-10">
            <h4 style="font-family: Amarillo; font-weight: 700">
              Nhà trọ {{ data.item.BoardingHouse.name }} - Phòng
              {{ data.item.name }}
            </h4>
            <h6 class="">
              <span
                class="text-danger"
                style="font-size: 18px; font-family: Amarillo; font-weight: 700"
                >Giá thuê:

                {{ formatCurrency(data.item.price) }}

                /tháng</span
              >
              - {{ data.item.long * data.item.wide }}m²
            </h6>
          </div>

          <img
            v-if="data.item.status == true"
            src="https://theme.hstatic.net/1000367813/1000963523/14/sold.png?v=170"
            alt="ảnh sold out"
            style="width: 10%"
          />
        </div>

        <div class="row p-0 roomInfo">
          <h6 class="m-0 col-12">Mô tả chi tiết:</h6>

          <p class="col-md-12 col-12 p-0 ml-3 mb-0 roomInfo">
            <span class="mr-3 m-0"> Chiều dài: {{ data.item.long }}m </span>
            <span>Chiều rộng: {{ data.item.wide }}m</span>
          </p>
        </div>

        <div class="row p-0 roomInfo">
          <h6 v-if="data.item.content != 'undefined'" class="col-12 m-0">
            Mô tả thêm:
          </h6>
          <p
            v-show="data.item.content != 'undefined'"
            v-for="(value, index) in data.item.content"
            :key="index"
            class="col-md-12 col-12 m-0 py-0"
          >
            {{ value }}
          </p>
        </div>

        <div class="row p-0 roomInfo">
          <h6 class="col-12 m-0">Tiện ích:</h6>
          <p
            v-for="(value, index) in data.item.Amenities"
            :key="index"
            class="ml-3 m-0 pt-0"
          >
            {{ value.name }} ,
          </p>
        </div>

        <div class="row p-0 roomInfo">
          <h6 class="col-md-12 col-12 m-0">Giá dịch vụ:</h6>
          <div
            v-for="(value, index) in data.services"
            :key="index"
            class="col-md-4 col-12 m-0 pt-0"
          >
            - {{ capitalizeFirstLetter(value.name) }} :
            {{ formatCurrency(value.price) }}/ {{ value.unit }}
          </div>
        </div>

        <div class="row p-0 mb-2 roomInfo">
          <h6 class="col-md-12 col-12 m-0">Liên hệ:</h6>
          <p class="m-0 p-0 ml-3 col-12">
            <span class="material-symbols-outlined text-danger">
              home_pin
            </span>
            Địa chỉ: {{ data.item.BoardingHouse.address }}
          </p>
          <p class="m-0 p-0 ml-3">
            <span class="material-symbols-outlined m-0 p-0 text-info"
              >phone
            </span>
            Điện thoại:
            <span
              class="text-info"
              style="font-family: Amarillo; font-size: 18px"
            >
              {{ data.item.BoardingHouse.phone }}</span
            >
            <!-- <img :src="data.item.qrCodeUrl" alt="QR" class="mx-2" /> -->
          </p>
        </div>

        <div class="row align-items-center roomInfo mx-2">
          <button
            class="btn btn-login mr-1"
            style="height: 40px"
            data-toggle="modal"
            data-target="#messageModal"
            @click="isMessage = !isMessage"
          >
            Nhắn tin với chủ trọ
          </button>
          <strong> Hoặc</strong>
          <div class="col-md-3 col card mx-2 p-0 text-center">
            <img :src="data.item.qrCodeUrl" alt="QR" class="mx-auto p-0" />
            <div class="card-body m-0 p-0 pb-2 roomInfo w-100">
              <p class="card-text text-info">Liên hệ qua SĐT</p>
            </div>
          </div>
        </div>

        <!-- <img :src="data.item.qrCodeUrl" alt="QR" class="mx-2" /> -->

        <!-- component -->
        <Message
          v-if="isMessage"
          :userId="data.item.BoardingHouse.userId"
          :boardingName="data.item.BoardingHouse.name"
          :roomName="data.item.name"
          @closeModal="isMessage = !isMessage"
        ></Message>
      </div>
      <!-- <div class="col">
        <img
          v-if="data.item.status == true"
          src="https://theme.hstatic.net/1000367813/1000963523/14/sold.png?v=170"
          alt="ảnh sold out"
          class="col-3 m-0 p-0"
          style="width: 100%"
        />
      </div> -->
      <!-- <div class="col my-3 m-0 px-3 p-0">
        <h6 class="my-3">Bản đồ</h6>
        <div id="map" style="height: 500px; width: 100%"></div>
      </div> -->
    </div>
    <hr />
    <h5 class="my-3 title">Bản đồ</h5>
    <a
      :href="`https://www.google.com/maps/place/${data.item.BoardingHouse.address}`"
      >{{ data.item.BoardingHouse.address }}</a
    >

    <div id="map" style="height: 400px; width: 100%"></div>

    <!-- <iframe
      width="100%"
      height="450"
      frameborder="0"
      style="border: 0"
      :src="`${data.item.url}`"
      allowfullscreen
    ></iframe> -->

    <!-- Rooms -->
    <hr />
    <h5 class="my-3 title">Phòng trọ tương tự</h5>
    <div class="row m-2">
      <router-link
        :to="{ name: 'roomDetail', query: { _id: value._id } }"
        class="card p-2 mb-2 col-md-2 col-6"
        v-for="(value, index) in room.setPage"
        :key="index"
      >
        <img
          v-if="value.status == true"
          src="https://theme.hstatic.net/1000367813/1000963523/14/sold.png?v=170"
          alt="ảnh sold out"
          style="position: absolute; z-index: 1; margin-left: 72%; width: 25%"
        />
        <img
          class="card-img-top"
          :src="
            value.Media.length > 0
              ? `http://localhost:3000/static/images/${value.Media[0].name}`
              : `http://localhost:3000/static/images/lightHouse.png`
          "
          alt="ảnh phòng trọ"
          style="width: 100%; height: 200px; object-fit: cover"
        />

        <div class="card-body m-0 p-0">
          <h6>Nhà trọ : {{ value.BoardingHouse.name }}</h6>
          <p class="card-text">Phòng {{ value.name }}</p>
          <p class="card-text">
            Diện tích: {{ value.long }} x {{ value.wide }} m²
          </p>
          <p class="card-text">Giá phòng: {{ formatCurrency(value.price) }}</p>
        </div>
      </router-link>
    </div>
    <paginationVue
      class="m-0 p-0 mt-1"
      :currentPage="room.currentPage"
      :totalPage="room.totalPage"
      :size="room.sizePage"
      :length="room.length"
      @page="(value) => (room.currentPage = value)"
      @previous="
        () => {
          if (room.currentPage > 1) {
            room.currentPage = room.currentPage - 1;
          }
        }
      "
      @next="
        () => {
          if (room.currentPage < room.totalPage) {
            room.currentPage = room.currentPage + 1;
          }
        }
      "
    ></paginationVue>
  </div>
</template>
<style scoped>
.body {
  height: 100vh; /* Đặt chiều cao cho .body theo chiều cao của viewport */
  overflow: auto; /* Cho phép nội dung trượt khi vượt quá chiều cao của .body */
}
.address:hover {
  text-decoration: underline;
}
#map {
  z-index: 0;
}
a:hover {
  text-decoration: none;
  background: #f9f9f9;
}
.roomInfo > * {
  font-family: "Amarillo";
  font-size: 18px;
}
h6 {
  font-weight: bold;
}
</style>
