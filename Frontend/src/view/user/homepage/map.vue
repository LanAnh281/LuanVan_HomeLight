<script>
import { reactive, onMounted, ref } from "vue";
import _ from "lodash";
import "leaflet/dist/leaflet.css"; // Import CSS của Leaflet
import L from "leaflet";
export default {
  components: {},
  props: { address: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({});
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal map");
    };
    const closeModal = () => {
      console.log("close modal map");
      // refresh();
      emit("closeModal");
    };
    onMounted(async () => {
      //get all boarding house
      console.log("PropsAddress:", props.address);

      $("#mapModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#mapModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
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
      const data = await response.json();

      // Kiểm tra xem có kết quả trả về từ dịch vụ geocoding không
      if (data && data.length > 0) {
        // Trích xuất tọa độ từ kết quả đầu tiên
        const firstResult = data[0];
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

    return { data };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="mapModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <!-- <div class="modal-dialog" role="document"> -->
    <!-- <div class="modal-content"> -->
    <!-- <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">bản đồ</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div> -->
    <!-- <div class="modal-body"> -->
    <div id="map" style="height: 400px"></div>
    <!-- </div> -->
    <!-- </div> -->
    <!-- </div> -->
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
