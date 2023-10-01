<script>
import { ref, watch, reactive } from "vue";
export default {
  components: {},
  props: {
    data: { type: Array, default: [] },
    selected: { type: String, default: "" },
  },
  setup(props, { emit }) {
    return {};
  },
};
</script>
<template>
  <div class="row mx-2">
    <div
      class="col-3 mb-4"
      v-for="(value, index) in data"
      :key="index"
      @click="$emit('selected', value.name)"
      :class="selected == value.name ? 'isActive' : ''"
    >
      <div class="card border-left-primary shadow h-100 py-2">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div
                class="text-xs font-weight-bold text-primary text-uppercase mb-1"
              >
                {{ value.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.isActive > * {
  background-color: rgb(249, 248, 248);
}
.card {
  cursor: pointer;
}
</style>
