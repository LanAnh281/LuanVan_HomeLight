<script>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
} from "vue";
import axios from "axios";

import { useRoute, useRouter } from "vue-router";

//service
import userService from "../../../service/user.service";
//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
//component
import paginationVue from "../../../components/pagination/pagination.vue";
import Table from "../../../components/table/table.vue";
import Select from "../../../components/select/selectdependent.vue";
export default {
  components: { paginationVue, Table, Select },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      item: [{ userName: "" }], //list
      setPage: [],
      searchPage: [],
      currentPage: 1,
      totalPage: 1,
      sizePage: 2,
      length: 0,
      searchText: "",
      city: {},
      district: { data: { districts: [] } },
      ward: { data: { wards: [] } },
    });
    let intervalId = null;
    data.totalPage = computed(() =>
      data.searchPage ? Math.ceil(data.searchPage.length / data.sizePage) : 0
    );
    data.searchPage = computed(
      () => (
        (data.currentPage = 1),
        data.item
          ? data.item.filter((item) =>
              item.userName
                .toLowerCase()
                .includes(data.searchText.toLocaleLowerCase())
            )
          : []
      )
    );
    data.setPage = computed(() =>
      data.searchPage
        ? data.searchPage.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : []
    );
    const display = () => {
      console.log(
        Array.isArray(data.item)
          ? data.item.filter(
              (item) => item.userName && item.userName.includes(data.searchText)
            )
          : []
      );
    };
    const refresh = async () => {
      try {
        const documentUser = await userService.getAll();
        data.item = documentUser.message;
        data.item = data.item.map((item) => {
          return {
            ...item,
            sex: item.sex ? "Nữ" : "Nam",
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
    };
    const changeCity = (value) => {
      console.log("city", value);
    };
    onMounted(async () => {
      await checkAccessToken(router); //access token
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes

      await refresh();
      try {
        await axios
          .get(`https://provinces.open-api.vn/api/?depth=1`, {})
          .then((response) => {
            data.city = response;
          });
      } catch (error) {
        console.log(error);
      }
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    return {
      data,
      display,
      changeCity,
    };
  },
};
</script>
<template>
  <div class="body m-0">
    <div class="border-radius my-3 row m-0 justify-content-start">
      <div class="input-group col-2 align-items-center">
        <Select
          :title="`Chọn thành phố`"
          :data="data.city.data"
          @choose="(value) => changeCity(value)"
        ></Select>
      </div>
      <div class="input-group col-2 align-items-center"></div>
      <!-- btn add boarding house -->
      <div class="col-8 mr-1 p-0 row justify-content-end">
        <div class="mr-1">
          <button
            class="btn btn-primary p-0"
            style="width: 103px; height: 36px; margin-top: 6px"
          >
            <div class="row justify-content-center plus">
              <span
                class="material-symbols-outlined"
                style="color: var(--white)"
              >
                domain_add
              </span>
              <span style="color: var(--white)">Thêm nhà</span>
            </div>
          </button>
        </div>
        <!-- component  -->

        <div class="mr-1">
          <button
            class="btn btn-primary p-0 mr-0"
            style="width: 103px; height: 36px; margin-top: 6px"
          >
            <div class="row justify-content-center">
              <span
                class="material-symbols-outlined"
                style="color: var(--white)"
              >
                post_add
              </span>
              <span style="color: var(--white)">Quy định</span>
            </div>
          </button>
        </div>
        <!--  btn edit room -->
        <div class="">
          <button
            class="btn btn-warning"
            style="width: 118px; height: 36px; margin-top: 6px"
          >
            <div class="row justify-content-center plus">
              <span
                class="material-symbols-outlined mr-1"
                style="color: var(--white)"
              >
                edit
              </span>
              <span style="color: var(--white)">Sửa nhà trọ</span>
            </div>
          </button>
          <!-- component" -->
        </div>
        <!-- component  -->
      </div>
    </div>
    <!-- Search -->
    <div class="border-radius my-3 row m-0 justify-content-start">
      <div class="my-2 mx-3">
        <input
          type="search"
          placeholder="tìm kiếm theo tên"
          class="p-1 border rounded"
          style="background-color: var(--background)"
          v-model="data.searchText"
        />
        <span> {{ data.searchText }}</span>
      </div>
    </div>
    <!-- Table -->
    <button @click="display">Lưu</button>
    <Table
      :data="data.setPage"
      :fields="['Họ tên', 'GT', 'SĐT', 'Email', 'Địa chỉ']"
      :titles="['userName', 'sex', 'phone', 'email', 'address']"
      :action="true"
      :actionList="['info', 'edit', 'cancel']"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      @info="
        (value) => {
          console.log('info:', value);
        }
      "
      @edit="
        (value) => {
          console.log('edit:', value);
        }
      "
      @cancel="
        (value) => {
          console.log('cancel:', value);
        }
      "
    ></Table>
    <!-- pagination -->
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
<style scoped>
.body {
  min-height: 100vh;
}
</style>
