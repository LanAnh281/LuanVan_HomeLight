<script>
import { reactive, onBeforeMount } from "vue";
import _ from "lodash";

//service
import boardinghouseService from "../../../../service/boardinghouse.service";
import roomService from "../../../../service/room.service";
import mediaService from "../../../../service/media.service";
//js
import { formatCurrency } from "../../../../assets/js/format.common";
// view
export default {
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: { name: "", price: "", wide: "", long: "", content: "" },
      boarding: { name: "", address: "" },
      medias: [{ name: "" }],
    });
    const checkFileType = (fileName) => {
      const extension = fileName.split(".").pop().toLowerCase();
      if (
        extension == "png" ||
        extension === "jpeg" ||
        extension === "jpg" ||
        extension === "webp"
      ) {
        return "image";
      } else if (
        extension == "mp4" ||
        extension == "avi" ||
        extension == "webm" ||
        extension == "mov"
      ) {
        return "video";
      } else {
        return "unknown";
      }
    };
    onBeforeMount(async () => {
      //lấy thông tin phòng hiện tại
      const documentRoom = await roomService.get(props._id);
      data.item = documentRoom.message;

      if (data.item.Amenities.length == 0) {
        data.item.Amenities[0] = { name: "Chưa thên tiện nghi" };
      }
      // lấy thông tin về nhà trọ
      const documentBoarding = await boardinghouseService.get(
        data.item.boardingId
      );
      data.boarding = documentBoarding.message;

      // lấy ds tài nguyên hình ảnh và video của phòng
      const documentMedia = await mediaService.get(props._id);
      data.medias = documentMedia.message;
      // format dữ liệu hiển thị đúng thẻ img và video
      data.medias = data.medias.map((item) => {
        return {
          ...item,
          type: checkFileType(item.name),
        };
      });
    });
    return { data, formatCurrency };
  },
};
</script>
<template>
  <div>
    <div class="row">
      <div class="col-6 m-0 mr-1 p-0">
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Tên nhà trọ:</p>
          <p class="col-8 m-0 p-0">{{ data.boarding.name }}</p>
        </div>
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Địa chỉ:</p>
          <p class="col-8 m-0 p-0">{{ data.boarding.address }}</p>
        </div>
        <div
          class="row justify-content-start p-0 m-0"
          v-if="data.item.Amenities"
        >
          <p class="col-3 m-0 p-0">Tiện ích:</p>
          <p v-for="(value, index) in data.item.Amenities" :key="index">
            {{ value.name }},
          </p>
        </div>
      </div>
      <div class="col p-0 m-0">
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Tên phòng :</p>
          <p class="col-6 p-0 m-0">{{ data.item.name }}</p>
        </div>
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Diện tích :</p>
          <p class="col-6 p-0 m-0">
            {{ data.item.long }} x {{ data.item.wide }} m²
          </p>
        </div>
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Đơn giá :</p>
          <p class="col-6 p-0 m-0">
            {{ formatCurrency(data.item.price) }}
          </p>
        </div>
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Trạng thái :</p>
          <p class="col-6 p-0 m-0">
            {{ !data.item.status ? "Chưa thuê" : "Đang thuê" }}
          </p>
        </div>
      </div>

      <div class="col-12 row justify-content-start p-0 m-0">
        <p class="col-1 mr-5 p-0">Mô tả :</p>
        <p class="col-10 p-0 m-0">
          {{ data.item.content }}
        </p>
      </div>
    </div>

    <hr />

    <div
      v-for="(value, index) in data.medias"
      :key="index"
      style="display: inline"
    >
      <img
        v-if="value.type == 'image'"
        :src="`http://localhost:3000/static/images/${value.name}`"
        class="mb-1 col-3"
        style="object-fit: contain; width: 100%; height: 200px"
      />
      <div
        class="col-12"
        style="display: inline-block"
        v-if="value.type == 'video'"
      >
        <video
          v-if="value.type == 'video'"
          controls
          :src="`http://localhost:3000/static/images/${value.name}`"
          style="object-fit: contain; width: 100%"
        />
      </div>
    </div>
  </div>
</template>
