<script>
import {} from "vue";
export default {
  components: {},
  props: {
    title: "",
    data: "",
  },
  setup(props, { emit }) {
    const change = (e) => {
      emit("choose", e.target.value);
    };
    return {
      change,
    };
  },
};
</script>
<template>
  <select class="custom-select" id="inputGroupSelect01" @change="change">
    <option selected>{{ title }}</option>
    <option v-for="(value, index) in data" :key="index" :value="value.code">
      {{ value.name }}
    </option>
  </select>
</template>
