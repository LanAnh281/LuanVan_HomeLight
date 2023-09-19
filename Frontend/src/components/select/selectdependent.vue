<script>
import { ref, onMounted } from "vue";
export default {
  components: {},
  props: {
    title: "",
    data: { type: Array, default: [] },
    codeProps: { type: Object, default: {} },
  },
  setup(props, { emit }) {
    const change = (e) => {
      emit("choose", e.target.value);
    };
    onMounted(() => {
      // console.log("***code:", props.codeProps);
    });
    return {
      change,
    };
  },
};
</script>
<template>
  <select class="custom-select" id="inputGroupSelect01" @change="change">
    <option selected>{{ title }}</option>
    <option
      v-for="(value, index) in data"
      :key="index"
      :value="value.code"
      :selected="codeProps.code == value.code ? 'selected' : null"
    >
      {{ value.name }}
    </option>
  </select>
</template>
