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
          <th scope="col" v-if="action"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, index) in data" :key="index">
          <th scope="row">{{ (currentPage - 1) * sizePage + index + 1 }}</th>

          <td
            v-for="(title, index1) in titles"
            :key="index1"
            style="max-width: 10px"
          >
            {{ value[title] }}
          </td>
          <td v-if="action" class="ml-2">
            <div v-if="account == true">
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
            </div>
            <span
              v-for="(value2, index2) in actionList"
              :key="index2"
              class="material-symbols-outlined rounded-circle"
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
