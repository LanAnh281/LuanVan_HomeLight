<template>
  <div class="body">
    <input type="checkbox" v-model="selectedValues" value="apple" /> Apple
    <input type="checkbox" v-model="selectedValues" value="banana" /> Banana
    <input type="checkbox" v-model="selectedValues" value="orange" /> Orange

    <p>Selected fruits: {{ selectedValues }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedValues: [], // Mảng để lưu giá trị của các checkbox được chọn
    };
  },
};
</script>
