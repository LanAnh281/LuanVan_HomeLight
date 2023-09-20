<script>
import { onMounted } from "vue";
export default {
  components: {},
  props: {
    data: { type: Array, default: [] },
    fields: { type: Array, default: [] },
    titles: { type: Array, default: [] },
    action: { type: Boolean, default: false },
    actionList: { type: Array, default: [] },
    name: { type: String, default: "" },
    account: false,
    currentPage: "",
    sizePage: "",
  },

  setup(props, emit) {
    onMounted(() => {
      //   console.log(props.data);
    });
    return {};
  },
};
</script>
<template>
  <div>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col" v-for="(filed, index) in fields" :key="index">
            {{ filed }}
          </th>
          <th scope="col" v-if="action"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, index) in data" :key="index" :id="index">
          <th>
            {{ value.name }}
          </th>

          <th
            v-for="(title, index) in titles"
            :key="index"
            v-show="title != 'name'"
          >
            <input
              type="text"
              class="p-2 w-100"
              v-model="value[title]"
              style="
                background-color: rgb(240, 242, 243);
                border-color: aliceblue;
              "
            />
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
span {
  font-size: 24px;
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
