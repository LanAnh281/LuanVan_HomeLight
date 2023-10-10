<template>
  <div>
    <div ref="map" style="height: 20px"></div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import L from "leaflet";

export default {
  setup() {
    const map = ref(null);

    onMounted(() => {
      // Tạo bản đồ
      const myMap = L.map(map.value).setView([51.505, -0.09], 12);

      // Thêm tile layer (ví dụ: OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        myMap
      );

      // Thêm marker cho địa điểm cụ thể
      L.marker([51.505, -0.09]).addTo(myMap);
    });

    return {
      map,
    };
  },
};
</script>

<style>
/* Tùy chỉnh CSS của component bản đồ ở đây */
</style>
