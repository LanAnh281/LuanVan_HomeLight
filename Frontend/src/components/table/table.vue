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
    name: { type: String, default: "" },
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
          <!-- <th scope="col">#</th> -->
          <th scope="col" v-for="(filed, index) in fields" :key="index">
            {{ filed }}
          </th>
          <th scope="col" v-if="action"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, index) in data" :key="index">
          <!-- <th scope="row">{{ (currentPage - 1) * sizePage + index + 1 }}</th> -->

          <td v-for="(title, index1) in titles" :key="index1" style="">
            {{ value[title] }}
          </td>
          <td v-if="action" class="ml-2">
            <div v-if="account == true" class="text-center">
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
            <!-- :data-target="`${value2}UserModal`" -->

            <span
              v-for="(value2, index2) in actionList"
              :key="index2"
              class="material-symbols-outlined rounded-circle"
              :class="`${value2}-icon`"
              data-toggle="modal"
              :data-target="`#${value2}${name}Modal`"
              style="display: inline"
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
.visibility-icon:hover {
  color: var(--blue-neon);
  text-shadow: 0 0 2px #008cff;
  transition: 0.5s;
}
.payments-icon:hover {
  color: #f77f7f;
  text-shadow: 0 0 2px #ffa200;
  transition: 0.5s;
}
</style>
