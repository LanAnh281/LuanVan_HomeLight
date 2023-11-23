<script>
import { onMounted, reactive, ref } from "vue";
import registration from "../../../components/form/registration.form.vue";
import systemService from "../../../service/system.service";
//js
import { formatCurrency } from "../../../assets/js/format.common";
export default {
  components: { registration },
  setup() {
    const data = reactive({
      images: [
        {
          src: "../../../assets/image/homepage14.jpg",
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
          src: "../../../assets/image/homepage15.jpg",
          alt: "Ảnh giới thiệu",
        },
      ],
      systems: [{ content: "" }],
      services: [{ name: "", price: "", unit: "" }],
      screenWidth: 0,
      screenHeight: 0,
    });
    const isRegistration = ref(false);
    const imageSrc = (url) => {
      return new URL(url, import.meta.url);
    };

    onMounted(async () => {
      try {
        data.systems = await systemService.getAll();
        data.systems = data.systems.message;
        data.systems = data.systems.map((item) => {
          const service = item.service.split(" - ");
          return {
            ...item,
            serviceName: service[0],
            servicePrice: service[1],
            serviceUnit: service[2],
          };
        });

        data.screenWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        data.screenHeight =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight;

        console.log(`Chiều rộng màn hình: ${data.screenWidth}px`);
        console.log(`Chiều cao màn hình: ${data.screenHeight}px`);
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
      imageSrc,
      isRegistration,
      formatCurrency,
    };
  },
};
</script>
<template>
  <div
    class="body container-fluid m-0 pb-5 mb-3 p-0 row justify-content-between"
  >
    <div
      id="carouselExampleControls"
      class="carousel slide col-12 m-auto"
      data-ride="carousel"
      :style="{ height: `${data.screenHeight}px` }"
    >
      <div class="carousel-inner">
        <div
          class="carousel-item"
          v-for="(image, index) in data.images"
          :key="index"
          :class="{ active: index === 0 }"
        >
          <img
            class="d-block w-100 responsive"
            :src="imageSrc(image.src)"
            :alt="image.alt"
            :style="{
              width: `${data.screenWidth}px`,
              height: `${data.screenHeight}px`,
            }"
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
    <div class="st__villas my-3">
      <div class="st__villas__content">
        <div class="container">
          <div class="heading__st__villas text-center">
            <h3
              class="title wow fadeInUp animated"
              data-wow-delay=".3s"
              style="
                visibility: visible;
                animation-delay: 0.3s;
                animation-name: fadeInUp;
                font-family: 'Amarillo';
                font-size: 30px;
                color: #c89310;
              "
            >
              Chúng tôi là ai
            </h3>
            <p
              class="font-bold-itali my-2"
              style="font-family: 'Amarillo'; font-size: 26px; color: #c89310"
            >
              Sống Dễ Dàng - Tìm Nhà Trọ - Quản Lý Thuận Tiện
            </p>
            <!-- <p>
              <span class="material-symbols-outlined"> line_end_circle </span>
              <span class="material-symbols-outlined"> line_start_circle </span>
            </p> -->

            <!-- <p class="font-bold-itali">
              Nơi chúng tôi sẽ mang lại trải nghiệm độc đáo cho cả chủ trọ và
              khách thuê.
            </p> -->

            <!-- <p class="font-bold-itali">
              Chúng tôi tạo điều kiện thuận lợi cho tất cả người dùng.
            </p> -->
            <p
              class="text-center wow fadeInUp animated"
              data-wow-delay=".7s"
              style="
                visibility: visible;
                animation-delay: 0.7s;
                animation-name: fadeInUp;
                line-height: 2;
                font-family: 'Amarillo';
                font-size: 20px;
                color: #282827;
              "
            >
              Hệ thống của chúng tôi giúp bạn dễ dàng tìm kiếm các căn nhà trọ
              lý tưởng và cũng cung cấp cho chủ trọ một cách thuận tiện để quản
              lý nhà trọ của họ. Chúng tôi luôn sẵn sàng phục vụ nhu cầu "tìm
              nhà trọ, tìm phòng trọ, chung cư mini, căn hộ mini" cho mọi khách
              hàng, với mong muốn "Xây dựng những căn phòng ĐẸP- Tạo dựng môi
              trường sống TỐT - Đảm bảo sự MINH BẠCH " cũng như QUYỀN LỢI cho
              người thuê phòng và cả cộng đồng.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-around mx-3 my-3">
      <div class="inner col-12 col-md-4">
        <div class="box-icon">
          <img
            src="../../../assets/image/homepage9.jpg"
            alt="thông tin quản lý nhà trọ"
            class="w-100 homepageImg m-0 p-0"
          />
        </div>
        <div class="box-title m-3">
          <h2>Người tìm trọ</h2>
        </div>
        <div class="box-desc mx-3">
          Đối với người tìm trọ, bạn có thể tìm kiếm căn trọ một cách dễ dàng
        </div>
      </div>
      <!--  -->
      <div class="inner col-12 col-md-4">
        <div class="box-icon m-0 p-0">
          <img
            src="../../../assets/image/homepage10.jpg"
            alt="thông tin quản lý nhà trọ"
            class="w-100 homepageImg m-0 p-0"
          />
        </div>
        <div class="box-title m-3">
          <h2>Khách trọ</h2>
        </div>
        <div class="box-desc mx-2">
          Đối với khách thuê, bạn có thể dễ dàng thực hiện thanh toán và theo
          dõi thông tin về phòng trọ của mình.
        </div>
      </div>
      <div class="inner col-12 col-md-4">
        <div class="box-icon m-0 p-0">
          <img
            src="../../../assets/image/homepage13.jpg"
            alt="thông tin quản lý nhà trọ"
            class="w-100 homepageImg m-0 p-0"
          />
        </div>
        <div class="box-title m-3">
          <h2>Chủ trọ</h2>
        </div>
        <div class="box-desc mx-3" style="">
          Dành cho chủ nhà trọ, bạn có thể quản lý nhà trọ của mình. Chỉ bằng
          cách đăng ký
        </div>
      </div>
    </div>

    <div class="mx-3 row">
      <div class="col-12 col-md-4">
        <img
          src="../../../assets/image/homepage16.jpg"
          class="w-100"
          style=""
        />
      </div>
      <div class="col">
        <h5 class="title">Bạn là chủ trọ và đây là thông tin dành cho bạn</h5>
        <span class="material-symbols-outlined" style="color: var(--chocolate)">
          horizontal_rule
        </span>
        <p
          style="
            line-height: 2;
            font-family: 'Amarillo';
            font-size: 20px;
            color: #282827;
          "
        >
          {{ data.systems[0].content }}
        </p>
        <h5
          style="
            line-height: 2;
            font-family: 'Amarillo';
            font-size: 20px;
            color: red;
            font-weight: 600;
          "
        >
          Đơn giá :{{ formatCurrency(data.systems[0].servicePrice) }}/{{
            data.systems[0].serviceUnit
          }}
        </h5>
        <button
          class="btn btn-login blink-button"
          data-toggle="modal"
          data-target="#registrationModal"
          style="font-size: 16px"
          @click="isRegistration = !isRegistration"
        >
          Đăng ký ngay
        </button>
      </div>

      <!-- <div class="row">
        <h6 class="col-3">Thông tin liên hệ :</h6>
        <div class="col-6 m-0 p-0">
          <p class="m-0 p-0">Email: {{ data.systems[0].email }}</p>
          <p>Số điện thoại: {{ data.systems[0].phone }}</p>
        </div>
      </div> -->

      <registration v-if="isRegistration"></registration>
    </div>
  </div>
</template>
<style scoped>
.body {
  height: 100vh; /* Đặt chiều cao cho .body theo chiều cao của viewport */
  overflow: auto; /* Cho phép nội dung trượt khi vượt quá chiều cao của .body */
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
.card {
  border: none;
}
.inner {
  position: relative;
}
.inner:hover {
  z-index: 1;
}
.inner:hover .box-desc {
  display: block;
  word-wrap: break-word;
}
.inner:hover .box-title {
  display: none;
}
.inner:hover .box-icon {
  opacity: 0.8;
}
.box-title {
  display: block;
  position: absolute;
  bottom: 0;
}
.box-title h2 {
  color: #fdf2f2;
  text-transform: uppercase;
}
.box-desc {
  position: absolute;
  z-index: 1;
  bottom: 8%;
  text-align: justify;
  color: #fff;
  font-size: 20px;
}

.box-desc {
  display: none;
}
.blink-button {
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  animation: blink 1.5s infinite; /* Sử dụng animation 'blink' */
}
@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.responsive {
  object-fit: cotain;
}
</style>
