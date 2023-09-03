<script>
import { reactive, ref } from "vue";
export default {
  props: { data: [] },
  setup(props, { emit }) {
    return {};
  },
};
</script>
<template>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr)">
    <div class="card m-1" v-for="(value, index) in data" :key="index">
      <div class="card-item">
        <img
          class="card-img-top m-0"
          src="../../assets/image/background.jpg"
          style="object-fit: contain"
        />
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
      <span
        class="delete-icon"
        @click.stop="
          () => {
            console.log('delete', value._id);
          }
        "
      >
        x
      </span>
      <span
        class="material-symbols-outlined edit-icon"
        @click.stop="
          () => {
            console.log('edit', value._id);
          }
        "
      >
        edit
      </span>
    </div>
  </div>
</template>
<style scoped>
.card-item {
  position: relative;
  cursor: pointer;
}
.delete-icon {
  position: absolute;
  top: -10px;
  right: -4px;
  cursor: pointer;
  background-color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 1;
  color: var(--red);
  font-weight: 600;
  font-size: 1.2rem;
  background-color: #fbf9f9;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}
.edit-icon {
  position: absolute;
  top: 16px;
  right: -4px;
  cursor: pointer;
  background-color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 1;
  font-size: 1.2rem;
  color: var(--yellow);
  background-color: #fbf9f9;

  opacity: 1;
  transition: opacity 0.3s ease-in-out;
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
