<template>
  <div>
    <div id="map" style="height: 400px"></div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import "leaflet/dist/leaflet.css"; // Import CSS của Leaflet
import L from "leaflet";

export default {
  setup() {
    onMounted(async () => {
      // Tạo bản đồ
      const map = L.map("map").setView([0, 0], 12);

      // Sử dụng dữ liệu OpenStreetMap miễn phí
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map
      );

      // Tên địa điểm bạn muốn tìm
      const locationName =
        "Phường Trà Nóc - Quận Bình Thủy - Thành phố Cần Thơ ";

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
    });

    return {};
  },
};
</script>
