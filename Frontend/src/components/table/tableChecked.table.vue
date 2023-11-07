<script>
export default {
  components: {},
  props: {
    data: { type: Array, default: [] },
    fields: { type: Array, default: [] },
    titles: { type: Array, default: [] },
    name: { type: String, default: "" },

    action: { type: Boolean, default: false },
    actionList: { type: Array, default: [] },

    isInputChecked: false,
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
          <th v-if="isInputChecked" scope="col">#</th>
          <th scope="col" v-for="(filed, index) in fields" :key="index">
            {{ filed }}
          </th>
          <th scope="col p-0" v-if="action"></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(value, index) in data" :key="index">
          <td scope="col" class="text-center p-1" v-if="isInputChecked">
            <input type="checkbox" v-model="value.checked" />
          </td>

          <td v-for="(title, index1) in titles" :key="index1" class="px-1 py-0">
            {{ value[title] }}
          </td>
          <!-- action -->
          <td v-if="action" class="ml-2 text-center p-1">
            <span
              v-for="(value2, index2) in actionList"
              :key="index2"
              class="material-symbols-outlined mr-1"
              :class="`${value2}-icon`"
              data-toggle="modal"
              :data-target="`#${value2}${name}Modal`"
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
  font-size: 20px;
}

.info-icon:hover {
  color: #00c1cf;
  text-shadow: 0 0 2px #00f0ff;
  transition: 0.5s;
}
.edit-icon:hover {
  color: #f8cb03;
  text-shadow: 0 0 2px #ffbb00;
  transition: 0.5s;
}
.cancel-icon:hover {
  color: #f80303;
  text-shadow: 0 0 2px #ff6200;
  transition: 0.5s;
}
</style>
