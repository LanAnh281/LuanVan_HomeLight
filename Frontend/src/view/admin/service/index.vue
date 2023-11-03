<script>
import { ref, reactive, onMounted, watch, computed, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
//service
import serviceService from "../../../service/service.service";
//js
import { checkAccessToken } from "../../../assets/js/common.login";
import { formatCurrency } from "../../../assets/js/format.common";
//component
import Table from "../../../components/table/table.vue";
import Add from "./add.vue";
import Edit from "./edit.vue";
import paginationVue from "../../../components/pagination/pagination.vue";
export default {
  components: { Table, Add, Edit, paginationVue },

  setup() {
    const router = useRouter();
    const data = reactive({
      item: [],
      setPage: [],

      searchText: "",
      searchPage: [],
      setPage: [],
      sizePage: 10,
      currentPage: 1,
      totalPage: 0,
      length: 0,
    });
    const isAddServiceModal = ref(false);
    const isEditServiceModal = ref(false);
    let intervalId = null;
    data.length = computed(() => (data.item ? data.searchPage.length : 0));
    data.searchPage = computed(
      () => (
        (data.currentPage = 1),
        data.item
          ? data.item.filter((item) =>
              item.name
                .toLocaleLowerCase()
                .includes(data.searchText.toLocaleLowerCase())
            )
          : []
      )
    );
    data.totalPage = computed(() =>
      data.searchPage ? Math.ceil(data.searchPage.length / data.sizePage) : 0
    );
    data.setPage = computed(() =>
      data.searchPage
        ? data.searchPage.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : []
    );
    const handleDeleteMany = async () => {
      try {
        const removeList = data.item.filter((item) => item.checked == true);
        removeList.forEach(async (value) => {
          console.log(value);
          //API xóa
        });
        await refresh();
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    };

    const refresh = async () => {
      try {
        data.item = await serviceService.getAllUser();
        data.item = data.item.message;

        if (data.item.length > 0) {
          data.item = data.item.map((item) => {
            return {
              ...item,
              price: formatCurrency(item.price),
              checked: false,
            };
          });
        }
        // data.length = data.item.length;
      } catch (error) {
        if (error.response) {
          console.log("Server-side errors", error.response.data);
        } else if (error.request) {
          console.log("Client-side errors", error.request);
        } else {
          console.log("Errors:", error.message);
        }
      }
    };
    onBeforeMount(async () => {
      await refresh();

      await checkAccessToken(router);
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
    });
    return {
      data,
      refresh,
      handleDeleteMany,

      // modal
      isAddServiceModal,
      isEditServiceModal,
    };
  },
};
</script>
<template>
  <div class="body">
    <div class="border-radius mb-3 row m-0 justify-content-start">
      <div class="col-4 m-0 p-0 row justify-content-start">
        <input
          type="search"
          placeholder="tìm kiếm theo tên dịch vụ"
          class="p-2 ml-3 mt-2 w-100"
          style="
            border: 1px solid #ccc;
            border-radius: 6px;
            height: 36px;
            background-color: var(--background);
          "
          v-model="data.searchText"
        />
      </div>
      <div class="col-8 m-0 p-0 row justify-content-end">
        <button
          class="col-3 mr-1 btn btn-primary"
          style="max-width: 20%; height: 36px; margin-top: 6px"
          data-toggle="modal"
          data-target="#addServiceModal"
          @click="isAddServiceModal = !isAddServiceModal"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              add
            </span>
            <span style="color: var(--white); font-size: 16px"
              >Thêm dịch vụ</span
            >
          </div>
        </button>
        <Add
          v-if="isAddServiceModal"
          @clodeModal="isAddServiceModal = !isAddServiceModal"
          @add="refresh"
        ></Add>
        <!-- Edit services-->
        <button
          class="col-3 mr-3 btn btn-warning"
          style="max-width: 18%; height: 36px; margin-top: 6px"
          data-toggle="modal"
          data-target="#editServiceModal"
          @click="isEditServiceModal = !isEditServiceModal"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              edit
            </span>
            <span style="color: var(--white); font-size: 16px"
              >Sửa dịch vụ</span
            >
          </div>
        </button>
        <Edit
          v-if="isEditServiceModal"
          @clodeModal="isEditServiceModal = !isEditServiceModal"
          @edit="refresh"
        ></Edit>
        <!-- delete many services -->
        <!-- <button
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
        </button> -->
      </div>
    </div>
    <!-- component Table -->
    <h5 class="title text-center my-3">Danh sách dịch vụ</h5>
    <Table
      class="text-center"
      :data="data.setPage"
      :fields="['Tên dịch vụ', 'Đơn giá', 'Đơn vị tính']"
      :titles="['name', 'price', 'unit']"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      :action="false"
      :isInputChecked="false"
      :actionList="['edit', 'delete_forever']"
    ></Table>
    <!--  @edit="
        (value) => {
          console.log('edit', value);
        }
      "
      @delete_forever="
        (value) => {
          console.log('remove', value);
        }
      " -->
    <paginationVue
      :currentPage="data.currentPage"
      :totalPage="data.totalPage"
      :size="data.sizePage"
      :length="data.length"
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

th,
td {
  border: 1px solid #ccc;
}
</style>
<!-- .delete_forever-icon,
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
} -->
