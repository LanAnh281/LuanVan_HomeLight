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
    account: false,
    currentPage: "",
    sizePage: "",
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
          <th
            scope="col"
            style="padding: 0px; text-align: center; line-height: 3"
          >
            #
          </th>
          <th
            scope="col"
            v-for="(filed, index) in fields"
            :key="index"
            style="padding: 0px; text-align: center; line-height: 3"
          >
            {{ filed }}
          </th>
          <th scope="col" v-if="action">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, index) in data" :key="index">
          <td scope="col" class="text-center">
            <input type="checkbox" v-model="value.checked" />
          </td>

          <td v-for="(title, index1) in titles" :key="index1">
            {{ value[title] }}
          </td>
          <!-- action -->
          <td v-if="action" class="ml-2">
            <span
              v-for="(value2, index2) in actionList"
              :key="index2"
              class="material-symbols-outlined mr-1"
              :class="`${value2}-icon`"
              @click="$emit(value2, value._id)"
            >
              {{ value2 }}
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
