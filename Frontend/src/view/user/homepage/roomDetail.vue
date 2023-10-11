<script>
import { ref, reactive, watch, computed, onMounted, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import "leaflet/dist/leaflet.css"; // Import CSS của Leaflet
import L from "leaflet";
//service
import roomService from "../../../service/room.service";
//js
import { formatCurrency } from "../../../assets/js/format.common";
export default {
  setup() {
    const router = useRoute();
    const data = reactive({
      item: { name: "" },
    });
    // const isMap = ref(false);
    // watch(
    //   () => isMap.value,
    //   async (newValue, oldValue) => {
    //     console.log(isMap.value);
    //     try {
    //       console.log(oldValue, ":", newValue);
    //       if (newValue == false) {
    //         return;
    //       } else {
    //         console.log("else");
    //         // Tạo bản đồ
    //         const map = L.map("map").setView([0, 0], 12);

    //         // Sử dụng dữ liệu OpenStreetMap miễn phí
    //         L.tileLayer(
    //           "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //         ).addTo(map);

    //         // Tên địa điểm bạn muốn tìm
    //         const locationName = data.item.BoardingHouse.address;
    //         // "Phường Trà Nóc - Quận Bình Thủy - Thành phố Cần Thơ ";

    //         // Sử dụng dịch vụ OpenStreetMap Nominatim
    //         const response = await fetch(
    //           `https://nominatim.openstreetmap.org/search?format=json&q=${locationName}`
    //         );
    //         const dataMap = await response.json();

    //         // Kiểm tra xem có kết quả trả về từ dịch vụ geocoding không
    //         if (dataMap && dataMap.length > 0) {
    //           // Trích xuất tọa độ từ kết quả đầu tiên
    //           const firstResult = dataMap[0];
    //           const coordinates = [
    //             parseFloat(firstResult.lat),
    //             parseFloat(firstResult.lon),
    //           ];

    //           // Chuyển đến vị trí tìm thấy trên bản đồ
    //           map.setView(coordinates, 15);

    //           // Thêm marker cho địa điểm tìm thấy
    //           L.marker(coordinates).addTo(map);
    //         } else {
    //           console.error("Không tìm thấy địa điểm.");
    //         }
    //       }
    //     } catch (error) {}
    //   }
    // );
    //
    onBeforeMount(async () => {
      try {
        const documentRoom = await roomService.get(router.query["_id"]);
        data.item = documentRoom.message;
        if (data.item.Media.length == 0) {
          data.item.Media[0] = { name: "lightHouse.png" };
        }

        //Map
        // Tạo bản đồ
        const map = L.map("map").setView([0, 0], 12);

        // Sử dụng dữ liệu OpenStreetMap miễn phí
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
          map
        );

        // Tên địa điểm bạn muốn tìm
        const locationName = data.item.BoardingHouse.address;
        // "Phường Trà Nóc - Quận Bình Thủy - Thành phố Cần Thơ ";

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
          map.setView(coordinates, 15);

          // Thêm marker cho địa điểm tìm thấy
          L.marker(coordinates).addTo(map);
        } else {
          console.error("Không tìm thấy địa điểm.");
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
    });
    return {
      data,
      //  isMap,
      formatCurrency,
    };
  },
};
</script>
<template>
  <div class="body container-fluid m-0 px-5">
    <div class="row" v-if="data.item.BoardingHouse">
      <div
        id="carouselExampleCaptions"
        class="carousel slide col-6"
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
      <div class="col mx-2">
        <h6 class="mt-5">
          Nhà trọ {{ data.item.BoardingHouse.name }} - Phòng
          {{ data.item.name }}
        </h6>
        <p>
          <span class="text-danger"
            >Giá: {{ formatCurrency(data.item.price) }} / tháng</span
          >
          - {{ data.item.long * data.item.wide }} m2
        </p>
        <p class="">
          <span class="material-symbols-outlined"> home_pin </span>
          Địa chỉ: {{ data.item.BoardingHouse.address }}
          <!-- <span class="text-info d-block mx-5 address">Xem bản đồ</span> -->
        </p>
        <!-- <div id="map" style="height: 400px"></div> -->

        <h6>Mô tả chi tiết</h6>
        <p>
          Nhà trọ {{ data.item.BoardingHouse.name }} - Phòng
          {{ data.item.name }}
        </p>
        <p>Mô tả: {{ data.item.content }}</p>
        <h6>Liên hệ</h6>
        <p>Địa chỉ: {{ data.item.BoardingHouse.address }}</p>
        <p>SĐT: {{ data.item.BoardingHouse.phone }}</p>
      </div>
    </div>
    <div id="map" style="height: 400px; width: 100%"></div>
  </div>
</template>
<style scoped>
.body {
  height: 240vh;
}
.address:hover {
  text-decoration: underline;
}
</style>
