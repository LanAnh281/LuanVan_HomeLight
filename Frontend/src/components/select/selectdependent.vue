<script>
import { ref, onMounted } from "vue";
export default {
  components: {},
  props: {
    title: "",
    data: "",
    codeProps: { type: Object, default: {} },
  },
  setup(props, { emit }) {
    const change = (e) => {
      console.log("choose", e.target.value);
      emit("choose", e.target.value);
    };
    // const code = ref(props.codeProps.code);
    onMounted(() => {
      console.log("***code:", props.codeProps);
    });
    return {
      change,
      // code,
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
