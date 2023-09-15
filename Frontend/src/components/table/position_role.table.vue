<script>
import { reactive, onMounted } from "vue";
//service

export default {
  components: {},
  props: {
    data: { type: Array, default: [] },
    fileds: { type: Array, default: [] },
  },
  setup(props, { emit }) {
    const items = reactive({
      flag: false,
      readMore: [],
    });

    onMounted(async () => {
      const value = 5;
      const length = props.data.length;
      for (let i = 0; i < length; i++) {
        items.readMore.push(value);
      }
    });

    return { items };
  },
};
</script>
<template>
  <div>
    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col" v-for="(field, index) in fileds" :key="index">
            {{ field }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(value, index) in data" :key="index">
          <td scope="row" style="width: 4%">
            <input
              type="checkbox"
              v-model="value.checked"
              :checked="value.checked"
              @click="
                (e) => {
                  if (e.target.checked) {
                    $emit('checked', value._id);

                    for (let index in data) {
                      data[index].disable = true;
                    }
                    value.disable = false;
                  } else {
                    $emit('unchecked');
                    for (let index in data) {
                      data[index].disable = false;
                    }
                  }
                }
              "
              :disabled="value.disable"
            />
          </td>
          <td>{{ value.name }}</td>
          <td>
            <span
              v-for="(value1, index1) in value.Roles"
              :key="index1"
              v-show="index1 < items.readMore[index]"
              style="display: block"
              >{{ index1 + 1 }}. {{ value1.name }}</span
            >
            <i
              class="readMore"
              v-if="items.readMore[index] < value.Roles.length"
              @click.stop="items.readMore[index] = items.readMore[index] + 5"
              >Xem thêm....</i
            >
            <i
              class="readMore"
              v-if="items.readMore[index] >= value.Roles.length"
              @click.stop="items.readMore[index] = 1"
              >Ẩn bớt</i
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
.readMore {
  display: block;
  color: var(--chocolate);
}
</style>
