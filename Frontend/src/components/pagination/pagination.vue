<script>
import { ref, reactive } from "vue";
export default {
  components: {},
  props: {
    currentPage: "",
    totalPage: "",
    size: "",
    length: "",
  },
  setup() {
    return {};
  },
};
</script>
<template>
  <div class="row justify-content-between mx-2">
    <div v-if="totalPage > 0" class="mt-1">
      Hiển thị bản ghi
      {{ (currentPage - 1) * size + 1 }} đến
      <span v-if="currentPage == totalPage">
        <span v-if="currentPage * size == length">
          {{ currentPage * size }}
        </span>
        <span v-else> {{ length }} </span>
      </span>
      <span v-else>
        {{ currentPage * size }}
      </span>
    </div>
    <div v-if="totalPage == 0" class="text-center mx-auto">
      Không tồn tại bản ghi
    </div>
    <nav aria-label="Page navigation example " v-if="totalPage > 0">
      <ul class="pagination">
        <li class="page-item" :class="currentPage == 1 ? 'disabled' : ''">
          <a class="page-link" @click="$emit('previous')"
            ><span class="material-symbols-outlined">
              arrow_back_ios_new
            </span></a
          >
        </li>

        <li
          class="page-item"
          v-for="(value, index) in totalPage"
          :key="index"
          @click="$emit('page', value)"
        >
          <a
            class="page-link"
            :class="currentPage == value ? 'isActive' : ''"
            >{{ value }}</a
          >
        </li>
        <li
          class="page-item"
          :class="currentPage == totalPage ? 'disabled' : ''"
        >
          <a class="page-link" @click="$emit('next')"
            ><span class="material-symbols-outlined">
              arrow_forward_ios
            </span></a
          >
        </li>
      </ul>
    </nav>
  </div>
</template>
<style scoped>
.border-radius {
  min-width: 36px;
}
.disabled .material-symbols-outlined {
  pointer-events: none;
  color: gray;
}

.isActive {
  color: var(--ruby);
  text-shadow: 0 0 2px #ffaaaf;
  font-weight: 500;
}
.material-symbols-outlined {
  font-size: 16px;
  font-weight: 600;
}
a {
  color: var(--chocolate);
}
a:hover {
  color: var(--ruby);
  text-shadow: 0 0 2px #ffaaaf;
}
</style>
