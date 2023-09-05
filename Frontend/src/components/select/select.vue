<script>
import {} from "vue";
export default {
  components: {},
  props: {
    title: "",
    data: "",
    selected: "",
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
    <option value="''" :selected="selected == '' ? selected : null">
      {{ title }}
    </option>
    <option
      v-for="(value, index) in data"
      :key="index"
      :value="value._id"
      :selected="selected !== '' ? selected : null"
    >
      {{ value.name }}
    </option>
  </select>
</template>
