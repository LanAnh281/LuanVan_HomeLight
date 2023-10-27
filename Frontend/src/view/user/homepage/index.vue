<script>
import { reactive, ref } from "vue";
import registration from "../../../components/form/registration.form.vue";

export default {
  components: { registration },
  setup() {
    const data = reactive({
      images: [
        {
          src: "../../../assets/image/homepage5.jpg",
          alt: "Ảnh giới thiệu",
        },

        {
          src: "../../../assets/image/homepage6.jpg",
          alt: "Ảnh giới thiệu",
        },

        {
          src: "../../../assets/image/homepage7.jpg",
          alt: "Ảnh giới thiệu",
        },
        {
          src: "../../../assets/image/homepage4.jpg",
          alt: "Ảnh giới thiệu",
        },
      ],
    });
    const isRegistration = ref(false);
    const imageSrc = (url) => {
      return new URL(url, import.meta.url);
    };
    const handleDetail = () => {
      try {
        console.log("Chế độ thuê nhà, giá dịch vụ thuê");
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
    return {
      data,
      imageSrc,
      handleDetail,
      isRegistration,
    };
  },
};
</script>
<template>
  <div class="body container-fluid m-0 p-0 row justify-content-between">
    <div
      id="carouselExampleControls"
      class="carousel slide col-12 m-auto"
      data-ride="carousel"
      style="height: 600px"
    >
      <div class="carousel-inner">
        <div
          class="carousel-item"
          v-for="(image, index) in data.images"
          :key="index"
          :class="{ active: index === 0 }"
        >
          <img
            class="d-block w-100"
            :src="imageSrc(image.src)"
            :alt="image.alt"
            style="object-fit: cover; height: 580px; width: 100wh"
          />
        </div>
      </div>
      <a
        class="carousel-control-prev"
        href="#carouselExampleControls"
        role="button"
        data-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a
        class="carousel-control-next"
        href="#carouselExampleControls"
        role="button"
        data-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
    <div class="text-center mx-5 px-5">
      <h5 class="title m-0 my-2 p-0">Chúng tôi là ai?</h5>
      <p class="font-bold-itali">
        Sống Dễ Dàng - Tìm Nhà Trọ - Quản Lý Thuận Tiện
      </p>
      <p>
        <span class="material-symbols-outlined"> line_end_circle </span>
        <span class="material-symbols-outlined"> line_start_circle </span>
      </p>

      <p class="font-bold-itali">
        Nơi chúng tôi sẽ mang lại trải nghiệm độc đáo cho cả chủ trọ và khách
        thuê.
      </p>

      <p class="font-bold-itali">
        Chúng tôi tạo điều kiện thuận lợi cho tất cả người dùng.
      </p>
      <p>
        Hệ thống của chúng tôi giúp bạn dễ dàng tìm kiếm các căn nhà trọ lý
        tưởng và cũng cung cấp cho chủ trọ một cách thuận tiện để quản lý nhà
        trọ của họ.
      </p>
      <p>
        Chúng tôi luôn sẵn sàng phục vụ nhu cầu "tìm nhà trọ, tìm phòng trọ,
        chung cư mini, căn hộ mini" cho mọi khách hàng, với mong muốn "Xây dựng
        những căn phòng <strong>ĐẸP</strong> - Tạo dựng môi trường sống
        <strong>TỐT</strong> - Đảm bảo sự <strong>MINH BẠCH</strong> " cũng như
        <strong>QUYỀN LỢI</strong> cho người thuê phòng và cả cộng đồng.
      </p>
    </div>

    <div class="text-center my-5">
      <div class="row mx-1 justify-content-between">
        <div class="col card mx-2 p-2">
          <img
            src="../../../assets/image/homepage8.jpg"
            alt="thông tin quản lý nhà trọ"
            class="w-100 homepageImg m-0 p-0"
          />
          <div class="card-body">
            <p class="card-text">
              Đối với người tìm trọ, bạn có thể tìm kiếm căn trọ một cách dễ
              dàng.
            </p>
          </div>
        </div>
        <div class="col card mx-2 p-2">
          <img
            src="../../../assets/image/homepage3.jpg"
            alt="thông tin quản lý nhà trọ"
            class="w-100 homepageImg m-0 p-0"
          />
          <div class="card-body">
            <p class="card-text">
              Đối với khách thuê, bạn có thể dễ dàng thực hiện thanh toán và
              theo dõi thông tin về phòng trọ của mình.
            </p>
          </div>
        </div>
        <div class="col card m-0 p-2 mx-2">
          <img
            src="../../../assets/image/homepage2.webp"
            alt="thông tin quản lý nhà trọ"
            class="w-100 homepageImg m-0 p-0"
          />
          <div class="card-body">
            <p class="card-text">
              Dành cho chủ nhà trọ, bạn có thể quản lý nhà trọ của mình. Chỉ
              bằng cách đăng ký
            </p>
            <!-- <span @click="handleDetail" class="detail">Xem chi tiết</span> -->
          </div>
        </div>
      </div>
    </div>
    <div>
      <h5 class="title">Bạn là chủ trọ và đây là thông tin dành cho bạn</h5>
      <p>Chính sách và bảng giá sử dụng</p>
      <button
        class="btn btn-login"
        data-toggle="modal"
        data-target="#registrationModal"
        style="font-size: 16px"
        @click="isRegistration = !isRegistration"
      >
        Đăng ký ngay
      </button>
      <registration v-if="isRegistration"></registration>
    </div>
  </div>
</template>
<style scoped>
.body {
  height: 240vh;
}
#carouselExampleControls {
  /* left: 0;
  right: 0;*/

  margin: auto;
  width: 100%; /* Adjust the width as needed */
  height: 100vh; /* Adjust the height as needed */
}
p {
  font-size: 16px;
}
.font-bold-itali {
  font-weight: bold; /* Độ đậm vừa */
  font-style: italic; /* Nghiêng */
}

.carousel-item {
  transition: transform 0.3s ease-in-out;
}
.homepageImg {
  width: 100%;
  height: 360px;
}
.homepageImg:hover {
  scale: 1.02;
  transition: 0.3s ease-in-out;
  border-radius: 4px;
}
.detail:hover {
  text-decoration: underline;
  color: blue;
}
</style>
