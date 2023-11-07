<script>
import { onMounted, watch } from "vue";
//js
import { checkNumber } from "../../assets/js/checkInput.common";
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
    isInput: true,
    currentPage: "",
    sizePage: "",
  },

  setup(props, emit) {
    onMounted(() => {});
    return { checkNumber };
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
              type="number"
              class="px-1 w-100"
              v-model="value[title]"
              :disabled="!isInput"
              style="
                background-color: rgb(240, 242, 243);
                border-color: aliceblue;
                height: 24px;
              "
            />
          </th>
          <th>
            <span
              v-for="(value2, index2) in actionList"
              :key="index2"
              class="material-symbols-outlined"
              :class="`${value2}-icon`"
              @click="$emit(value2, value)"
            >
              save
            </span>
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
.save-icon {
  color: #05c25a;
}
</style>
