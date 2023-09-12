<script>
import { ref, reactive, onMounted, watch, computed, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
//service
import serviceService from "../../../service/service.service";
//js
import { checkAccessToken } from "../../../assets/js/common.login";
import { formatCurrency } from "../../../assets/js/format.common";
//component
import TableChecked from "../../../components/table/tablechecked.table.vue";
import Add from "../../admin/service/add.vue";
import paginationVue from "../../../components/pagination/pagination.vue";
export default {
  components: { TableChecked, Add, paginationVue },

  setup() {
    const router = useRouter();
    const data = reactive({
      item: [],
      setPage: [],
      sizePage: 2,
      currentPage: 1,
      totalPage: 0,
    });
    const isAddServiceModal = ref(false);
    let intervalId = null;
    data.totalPage = computed(() =>
      data.item ? Math.ceil(data.item.length / data.setPage) : 0
    );
    data.setPage = computed(() =>
      data.item
        ? data.item.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : []
    );
    const handleDeleteMany = () => {
      console.log("removeLisst", data.item);
    };
    const handleCreate = () => {};
    onBeforeMount(async () => {
      try {
        data.item = await serviceService.getAll();
        data.item = data.item.message;
        data.item = data.item.map((item) => {
          return {
            ...item,
            price: formatCurrency(item.price),
            checked: false,
          };
        });
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }

      await checkAccessToken(router);
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
    });
    return {
      data,
      handleDeleteMany,
      handleCreate,
      // modal
      isAddServiceModal,
    };
  },
};
</script>
<template>
  <div class="body">
    <div class="border-radius my-3 row m-0 justify-content-end">
      <div class="col-8 m-0 p-0 row justify-content-end">
        <button
          class="col-3 mr-3 btn btn-primary"
          style="max-width: 20%; height: 36px; margin-top: 6px"
          data-toggle="modal"
          data-target="#addServiceModal"
          @click="isAddServiceModal = !isAddServiceModal"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              add
            </span>
            <span style="color: var(--white)">Thêm dịch vụ</span>
          </div>
        </button>
        <Add
          v-if="isAddServiceModal"
          @clodeModal="isAddServiceModal = !isAddServiceModal"
        ></Add>
        <!-- delete many services -->
        <button
          class="col-3 mr-3 btn btn-danger"
          style="max-width: 20%; height: 36px; margin-top: 6px"
          @click="handleDeleteMany"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              close
            </span>
            <span style="color: var(--white)">xóa dịch vụ</span>
          </div>
        </button>
      </div>
    </div>
    <!-- component Table -->
    <TableChecked
      :data="data.setPage"
      :fields="['Tên dịch vụ', 'Đơn giá']"
      :titles="['name', 'price']"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      :action="true"
      :actionList="['edit', 'delete_forever']"
      @edit="
        (value) => {
          console.log('edit', value);
        }
      "
      @delete_forever="
        (value) => {
          console.log('remove', value);
        }
      "
    ></TableChecked>
    <paginationVue
      :currentPage="data.currentPage"
      :totalPage="data.totalPage"
      :size="data.sizePage"
      @page="(value) => (data.currentPage = value)"
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
    ></paginationVue>
  </div>
</template>
<style scope>
.body {
  min-height: 100vh;
}
table {
  width: 100%;
}

th,
td {
  border: 1px solid #ccc;
}
.delete_forever-icon,
.edit-icon {
  color: rgb(222, 226, 229);
  width: 10%;
  height: 48px;
  text-align: center;
  line-height: 1.2;
  font-weight: 600;
  padding: 0px;
  margin: 0px;
}
.delete_forever-icon {
  color: red;
  opacity: 1;
}
.delete_forever-icon:hover {
  color: #ff0000;
  text-shadow: 0 0 2px #ff0000;
  box-shadow: 0 0 4px #ff0000;
  transition: 0.5s;
}
.edit-icon {
  color: #ffd000fd;
}
.edit-icon:hover {
  color: #ff9900;
  text-shadow: 0 0 2px #ffea00;
  box-shadow: 0 0 4px #ffea00;
  transition: 0.5s;
}
</style>
