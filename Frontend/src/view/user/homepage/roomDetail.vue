<script>
import { ref, reactive, watch, computed, onMounted, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";

//service
import roomService from "../../../service/room.service";
export default {
  setup() {
    const router = useRoute();
    const data = reactive({
      item: { name: "" },
    });
    onBeforeMount(async () => {
      try {
        const documentRoom = await roomService.get(router.query["_id"]);
        data.item = documentRoom.message;
        if (data.item.Media.length == 0) {
          data.item.Media[0] = { name: "lightHouse.png" };
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
    return { data };
  },
};
</script>
<template>
  <div class="body container-fluid m-0 px-5">
    <div class="row">
      <div
        id="carouselExampleCaptions"
        class="carousel slide col-4"
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
      <div class="col">
        <h6>Nhà trọ...</h6>
        <p><span class="text-danger">Giá:.../ tháng</span> - xxx m2</p>
        <p>
          <span class="material-symbols-outlined"> home_pin </span>
          Địa chỉ ....
        </p>
        <h6>Mô tả chi tiết</h6>
        <p>Tên nhà trọ - Phòng trọ</p>
        <p>Content</p>
        <h6>Liên hệ</h6>
        <p>Địa chỉ:</p>
        <p>SĐT:</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.body {
  height: 240vh;
}
</style>
