<template>
  <div class="body my-2" v-if="data.items">
    <input type="checkbox" v-model="selectedValues" value="apple" /> Apple
    <input type="checkbox" v-model="selectedValues" value="banana" /> Banana
    <input type="checkbox" v-model="selectedValues" value="orange" /> Orange

    <p>Selected fruits: {{ selectedValues }}</p>
    <tableCheckedTable
      :data="data.pageItems"
      :isInputChecked="true"
      :fields="['Tên dịch vụ', 'Đơn giá', 'Đơn vị tính']"
      :titles="['name', 'price', 'unit']"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
    ></tableCheckedTable>
    <button @click="choose" class="btn btn-primary">Lưu</button>
    <button @click="add" class="btn btn-primary">Thêm</button>

    <div class="border">
      <input type="text" placeholder="tìm kiếm" v-model="data.search" />
    </div>
    {{ data.search }}
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
//component
import tableCheckedTable from "../../components/table/tableChecked.table.vue";
export default {
  components: { pag, tableCheckedTable },
  setup() {
    const data = reactive({
      items: [],
      pageItems: [],
      SearchPageItems: [],
      sizePage: 2,
      currentPage: 1,
      previousPage: 0,
      totalPage: 0,
      search: "",
      string: "",
    });
    data.totalPage = computed(() =>
      data.SearchPageItems.length
        ? Math.ceil(data.SearchPageItems.length / data.sizePage)
        : 0
    );
    data.SearchPageItems = computed(() => {
      try {
        return (
          (data.currentPage = 1),
          data.items.filter((item) => item.name.includes(data.search))
        );
      } catch (error) {
        console.log(error);
      }
    });
    data.pageItems = computed(() =>
      data.SearchPageItems.slice(
        (data.currentPage - 1) * data.sizePage,
        data.currentPage * data.sizePage
      )
    );
    const choose = () => {
      console.log("Items:", data.items);
      console.log("Search:", data.SearchPageItems);
      console.log("PageItems", data.pageItems);
    };
    const add = () => {
      data.items.push({ name: "abc", checked: false });
      console.log(data.items);
    };
    onBeforeMount(async () => {
      console.log("Search:", data.SearchPageItems);

      const document = await positionService.getAll();
      data.items = document.message;
      data.items = data.items.map((item) => {
        return {
          ...item,
          checked: false,
        };
      });
      console.log("Items:", data.items);
      console.log("Search:", data.SearchPageItems);
      console.log("PageItems", data.pageItems);
      let a = [{ name: "user" }, { name: "admin" }, { name: "super-admin" }];
      let b = a.filter((item) => item.name.includes(""));
      console.log(b);
    });

    const handlePageChange = (value) => {
      data.currentPage = value;
      // console.log(
      //   `${data.currentPage} `,
      //   (data.currentPage - 1) * data.sizePage,
      //   data.currentPage * data.sizePage
      // );
    };

    return {
      selectedValues: [], // Mảng để lưu giá trị của các checkbox được chọn
      data,

      handlePageChange,
      choose,
      add,
    };
  },
};
</script>
<style scope>
.body {
  min-height: 100vh;
}
</style>
