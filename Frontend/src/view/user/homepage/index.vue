<template>
  <div class="body container-fluid m-0 p-0 row justify-content-between">
    <div
      id="carouselExampleControls"
      class="carousel slide col-8 m-auto"
      data-ride="carousel"
      style="height: 620px"
    >
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img
            class="d-block w-100"
            src="../../../assets/image/homepag5.jpg"
            alt="First slide"
            style="object-fit: contain; height: 580px"
          />
        </div>
        <div class="carousel-item">
          <img
            class="d-block w-100"
            src="../../../assets/image/homepage.png"
            alt="Second slide"
            style="object-fit: contain; height: 580px"
          />
        </div>
        <div class="carousel-item">
          <img
            class="d-block w-100"
            src="../../../assets/image/homepage1.webp"
            alt="Third slide"
            style="object-fit: contain; height: 580px"
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
      <h5 class="title m-0 p-0">Chúng tôi là ai?</h5>
      <p>
        <span class="material-symbols-outlined"> line_end_circle </span>
        <span class="material-symbols-outlined"> line_start_circle </span>
      </p>
      <p class="font-bold-itali">
        Sống Dễ Dàng - Tìm Nhà Trọ - Quản Lý Thuận Tiện
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
    <!-- <div class="text-center">
      <h5 class="title">Tin tức</h5>
      <p>
        <span class="material-symbols-outlined"> line_end_circle </span>
        <span class="material-symbols-outlined"> line_start_circle </span>
      </p>
    </div> -->
  </div>
</template>
<style scoped>
.body {
  height: 120vh;
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
</style>
