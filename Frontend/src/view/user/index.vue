<script>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
//service

//asset/js
import { checkAccessToken } from "../../assets/js/common.login";
export default {
  components: {},
  setup() {
    const router = useRouter();
    const data = reactive({
      items: [
        { area: "10" },
        { area: "20" },
        { area: "20" },
        { area: "10" },
        { area: "20" },
        { area: "20" },
      ],
    });
    let intervalId = null;
    const position = ref("");
    onMounted(async () => {
      position.value = localStorage.getItem("Position");
      if (position.value != null) {
        checkAccessToken(router);
        intervalId = setInterval(async () => {
          await checkAccessToken(router);
        }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
      }
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });

    return { data };
  },
};
</script>
<template>
  <div class="body container-fluid m-0 px-5">
    <div class="row">
      <div class="col-4" v-for="(value, index) in data.items" :key="index">
        <img src="" />
        <span>Diện tích: {{ value.area }} m²</span>
        <span>Giá tiền</span>
        <p>Địa chỉ</p>
      </div>
    </div>
    <div
      id="carouselExampleCaptions"
      class="carousel slide col-3"
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
        <div class="carousel-item active">
          <img
            src="../../assets/image/background.jpg"
            class="d-block w-100"
            style="height: 300px; object-fit: contain"
            alt="ảnh nhà trọ"
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>First slide label</h5>
            <p>Some representative placeholder content for the first slide.</p>
          </div>
        </div>
        <div class="carousel-item">
          <img
            src="../../assets/image/background.jpg"
            class="d-block w-100"
            style="height: 300px; object-fit: contain"
            alt="ảnh nhà trọ"
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>Second slide label</h5>
            <p>Some representative placeholder content for the second slide.</p>
          </div>
        </div>
        <div class="carousel-item">
          <img
            src="../../assets/image/home.jpg"
            class="d-block w-100"
            style="height: 300px; object-fit: contain"
            alt="ảnh nhà trọ"
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>Third slide label</h5>
            <p>Some representative placeholder content for the third slide.</p>
          </div>
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
  </div>
</template>
<style scoped>
.body {
  height: 240vh;
}
</style>
