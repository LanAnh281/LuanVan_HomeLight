<script>
import { reactive, ref } from "vue";
export default {
  setup(props, { emit }) {
    return {};
  },
};
</script>
<template>
  <div class="card m-1">
    <img
      class="card-img-top"
      src="../../assets/image/background.jpg"
      style="object-fit: contain"
    />
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <p class="card-text">
        Some quick example text to build on the card title and make up the bulk
        of the card's content.
      </p>
      <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
  </div>
</template>
