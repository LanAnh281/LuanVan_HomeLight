<script>
import { ref, reactive } from "vue";
export default {
  components: {},
  props: {
    data: { type: Array, default: [] },
    fields: { type: Array, default: [] },
    titles: { type: Array, default: [] },
    action: { type: Boolean, default: false },
    actionList: { type: Array, default: [] },
  },
  setup(props, emit) {
    return {};
  },
};
</script>
<template>
  <div>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col" v-for="(filed, index) in fields" :key="index">
            {{ filed }}
          </th>
          <th scope="col" v-if="action">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, index) in data" :key="index">
          <th scope="row">{{ index + 1 }}</th>

          <td v-for="(title, index1) in titles" :key="index1">
            {{ value[title] }}
          </td>
          <td v-if="action" class="ml-2">
            <span
              class="material-symbols-outlined"
              v-if="value.isActive"
              @click="$emit('togge_off', value._id)"
            >
              toggle_on
            </span>
            <span
              class="material-symbols-outlined"
              v-else
              @click="$emit('togge_on', value._id)"
            >
              toggle_off
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
span {
  font-size: 35px;
}
</style>
