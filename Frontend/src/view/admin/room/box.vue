<script>
import { reactive, ref, onMounted, watch } from "vue";
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
// import addCustomer from "./addCustomer/addCutomer.form.vue";
export default {
  comments: { Edit },
  props: {
    data: { type: Array, default: [] },
    _idBoarding: { type: String, default: "" },
  },
  setup(props, { emit }) {
    const data = reactive({ item: [] });
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
    watch(
      () => props._idBoarding,
      async (newValue, oldValue) => {
        await refresh();
      }
    );
    const refresh = async () => {
      data.item = await roomService.getAll();
      data.item = data.item.message;
      data.item = data.item.filter(
        (item) => item.boardingId == props._idBoarding
      );
      data.item = data.item.map((item) => {
        return {
          ...item,
          price: Number(item.price).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
        };
      });
    };
    onMounted(async () => {
      await refresh();
    });
    return { data, handleDelete, isUpdateForm };
  },
};
</script>
<template>
  <div style="display: grid; grid-template-columns: repeat(5, 1fr)" class="">
    <div
      class="card pt-1 px-0 pb-0 mr-4 row justify-content-between"
      v-for="(value, index) in data.item"
      style="border-radius: 5px"
      :key="index"
    >
      <div class="card-item col-12 p-0 m-0">
        <!-- image -->
        <img
          class="card-img-top"
          src="../../../assets/image/lightHouse.png"
          style="object-fit: contain; height: 30%; width: 100%"
        />
        <hr style="display: block" />
        <!--  -->
        <div class="px-2 mx-1">
          <p class="card-title text-center"><b>Phòng:</b> {{ value.name }}</p>
          <p class="card-text">
            <b>Giá phòng:</b>
            {{ value.price }}
          </p>
          <p class="card-text"><b>Diện tích:</b> {{ value.area }}</p>
        </div>

        <!-- icon -->
        <div class="px-2 mx-1">
          <span
            class="material-symbols-outlined m-2 view border rounded p-1"
            title="chi tiết"
            data-toggle="modal"
            data-target="#viewRoomModal"
            @click="$emit('view', value._id)"
          >
            visibility
          </span>
          <span
            class="material-symbols-outlined out border rounded p-1"
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
        <!-- Add customer -->
        <div class="px-2 mt-1 my-1 text-center">
          <button
            class="btn btn-primary btn-menu p-1"
            data-toggle="modal"
            data-target="#addCustomerModal"
            @click="$emit('addCutomer', value._id)"
          >
            Thêm khách
          </button>
        </div>
      </div>
      <!--delete icon  -->
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
  color: #00f0ff;
  text-shadow: 0 0 2px #00f0ff;
  box-shadow: 0 0 4px #00f0ff;
  transition: 0.5s;
}
.out:hover {
  color: #03f803;
  text-shadow: 0 0 2px #00ff00;
  box-shadow: 0 0 4px #00ff00;
  transition: 0.5s;
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
.btn-menu {
  width: 114px;
}
</style>
