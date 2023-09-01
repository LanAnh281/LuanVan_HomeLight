<script>
import { ref, reactive, onMounted, watch } from "vue";
//service
import positionService from "../../service/position.service";

export default {
  components: {},
  props: {},
  setup(props, { emit }) {
    const data = reactive({
      items: [{ name: "", Roles: [{ name: "" }] }],
      flag: true,
      readMore: [],
    });
    const css = reactive({
      director: [{ name: "Tài khoản" }, { name: "Vai trò" }],
      isDirector: "Tài khoản",
    });
    onMounted(async () => {
      const document = await positionService.getAll();
      data.items = document.message;
      const value = 5;
      const length = data.items.length;
      for (let i = 0; i < length; i++) {
        data.readMore.push(value);
      }
    });

    return { data, css };
  },
};
</script>
<template>
  <div>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col"></th>
          <!-- <th v-for="(field,index) in fields" :key="index">{{field}}</th> -->

          <th scope="col">Vai trò</th>
          <th scope="col">Danh sách quyền</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, index) in data.items" :key="index">
          <th scope="row"><input type="checkbox" /></th>
          <td>{{ value.name }}</td>
          <td style="max-width: 10px">
            <span
              v-for="(value1, index1) in value.Roles"
              :key="index1"
              v-show="index1 < data.readMore[index]"
              style="display: block"
              >{{ index1 + 1 }}. {{ value1.name }}</span
            >
            <i
              class="readMore"
              v-if="data.readMore[index] < value.Roles.length"
              @click.stop="data.readMore[index] = data.readMore[index] + 5"
              >Xem thêm....</i
            >
            <i
              class="readMore"
              v-if="data.readMore[index] >= value.Roles.length"
              @click.stop="data.readMore[index] = 1"
              >Ẩn bớt</i
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
.director {
  height: 36px;
  min-width: 100px;
  margin-top: 6px;
  background-color: var(--chocolate);
  color: var(--white);
}
.isActiveDirector {
  background-color: var(--ruby);
  text-shadow: 0 0 2px #fff;
}
.readMore {
  display: block;
  color: var(--chocolate);
}
</style>
