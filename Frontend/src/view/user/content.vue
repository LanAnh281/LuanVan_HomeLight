<template>
  <div class="body" v-if="data.items">
    <input type="checkbox" v-model="selectedValues" value="apple" /> Apple
    <input type="checkbox" v-model="selectedValues" value="banana" /> Banana
    <input type="checkbox" v-model="selectedValues" value="orange" /> Orange

    <p>Selected fruits: {{ selectedValues }}</p>
    <span v-for="(value, index) in data.pageItems" :key="index">
      {{ value.name }}
    </span>
    <pag
      :totalPage="data.totalPage"
      :currentPage="data.currentPage"
      @page="handlePageChange"
      @previous="
        () => {
          if (data.currentPage > 1) {
            data.currentPage = data.currentPage - 1;
          }
        }
      "
      @next="
        () => {
          if (data.currentPage < data.totalPage) {
            data.currentPage = data.currentPage + 1;
          }
        }
      "
    ></pag>
  </div>
</template>

<script>
import { computed, reactive, ref, onBeforeMount } from "vue";
import positionService from "../../service/position.service";

import pag from "../../components/pagination/pagination.vue";
export default {
  components: { pag },
  setup() {
    const data = reactive({
      items: [],
      pageItems: [],
      sizePage: 2,
      currentPage: 1,
      previousPage: 0,
      totalPage: 0,
    });
    data.totalPage = computed(() =>
      data.items.length ? Math.round(Math.ceil(data.items.length) / 2) : 0
    );

    onBeforeMount(async () => {
      const document = await positionService.getAll();
      data.items = document.message;
    });
    data.pageItems = computed(() =>
      data.items.slice(
        (data.currentPage - 1) * data.sizePage,
        data.currentPage * data.sizePage
      )
    );

    const handlePageChange = (value) => {
      data.currentPage = value;
      console.log(
        `${data.currentPage} `,
        (data.currentPage - 1) * data.sizePage,
        data.currentPage * data.sizePage
      );
    };

    return {
      selectedValues: [], // Mảng để lưu giá trị của các checkbox được chọn
      data,

      handlePageChange,
    };
  },
};
</script>
