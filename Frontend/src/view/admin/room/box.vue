<script>
import { reactive, ref, onMounted } from "vue";
//service
import roomService from "../../../service/room.service";
//asset  js
import {
  successAd,
  success,
  deleted,
  warning,
} from "../../../assets/js/common.alert";
//component
import Edit from "./edit.vue";
export default {
  comments: { Edit },
  props: { data: { type: Array, default: [] } },
  setup(props, { emit }) {
    const isUpdateForm = ref(false);
    const handleDelete = async (value) => {
      try {
        const isDeleted = await deleted(
          "Xóa",
          "Bạn có chắc chắc xóa phòng trọ."
        );
        if (isDeleted) {
          const document = await roomService.delete(value);
          document["status"] == "success"
            ? success("Thành công")
            : warning("Thất bại", "");
          emit("handleDelete");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    onMounted(() => {
      console.log("22");
    });
    return { handleDelete, isUpdateForm };
  },
};
</script>
<template>
  <div style="display: grid; grid-template-columns: repeat(5, 1fr)">
    <div
      class="card pt-1 px-0 pb-0 mx-1 row justify-content-between"
      v-for="(value, index) in data"
      style="border-radius: 5px"
      :key="index"
    >
      <div class="card-item col-12">
        <img
          class="card-img-top m-0 p-0"
          src="../../../assets/image/lightHouse.png"
          style="object-fit: contain; height: 30%; width: 100%"
        />
        <hr />
        <p class="card-title"><b>Phòng:</b> {{ value.name }}</p>
        <p class="card-text"><b>Giá phòng:</b> {{ value.price }}</p>
        <p class="card-text"><b>Diện tích:</b> {{ value.area }}</p>
        <div><button class="btn btn-primary">Thêm khách</button></div>
        <div>
          <span
            class="material-symbols-outlined m-2 view"
            title="chi tiết"
            @click="
              () => {
                console.log('view', value._id);
              }
            "
          >
            visibility
          </span>
          <span
            class="material-symbols-outlined out"
            title="trả phòng"
            @click="
              () => {
                console.log('out', value._id);
              }
            "
          >
            logout
          </span>
        </div>
      </div>
      <span class="delete-icon" @click.stop="handleDelete(value._id)"> x </span>
      <p
        data-toggle="modal"
        data-target="#roomUpdateModal"
        @click="$emit('edit', value._id)"
      >
        <span class="material-symbols-outlined edit-icon"> edit </span>
      </p>
    </div>
  </div>
</template>
<style scoped>
.card-item {
  position: relative;
  cursor: pointer;
}

.delete-icon,
.edit-icon {
  position: absolute;
  cursor: pointer;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 1;
  font-size: 1.2rem;
  background-color: #fbf9f9;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}
.delete-icon {
  top: -10px;
  right: -4px;
  color: var(--red);
  font-weight: 600;
}
.delete-icon:hover {
  color: red;
  font-size: 1.3rem;
}
.edit-icon {
  top: 16px;
  right: -4px;
  color: var(--yellow);
}
.edit-icon:hover {
  color: rgb(247, 203, 6);
  font-size: 1.3rem;
}

.view:hover {
  color: blue;
  text-shadow: 0 0 5px #e8e2e2;
}
.out:hover {
  color: green;
  text-shadow: 0 0 5px #ccc;
}
button:hover {
  text-shadow: 0 0 5px #fff;
}
.edit-icon:hover {
  text-shadow: 0 0 5px #f8d435;
}
.delete-icon:hover {
  text-shadow: 0 0 5px #e6d4cd;
}
</style>
