<script>
import { reactive, ref, onBeforeMount, computed } from "vue";
import _ from "lodash";

//service
import serviceService from "../../../service/service.service";

//component
import Select from "../../../components/select/select.vue";
import paginationVue from "../../../components/pagination/pagination.vue";

//js
import { sanitizeInput } from "../../../assets/js/checkInput.common";
import { successAd } from "../../../assets/js/common.alert";
export default {
  components: { Select, paginationVue },
  setup(props, { emit }) {
    const data = reactive({
      item: [
        {
          name: "",
          price: "",
          unit: "",
        },
      ],
      searchText: "",
      searchPage: [],
      setPage: [],
      sizePage: 4,
      currentPage: 1,
      totalPage: 0,
      length: 0,
    });
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

    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal room");
    };
    const closeModal = () => {
      console.log("close modal room");

      emit("closeModal");
    };

    const handleEdit = async () => {
      try {
        data.item.forEach(async (value) => {
          value.name = sanitizeInput(value.name);
          value.price = sanitizeInput(value.price);
          value.unit = sanitizeInput(value.unit);
          const document = await serviceService.update(value._id, value);
          emit("edit");
        });

        successAd("Cập nhật thành công");
        data.item = await serviceService.getAllUser();
        data.item = data.item.message;
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
      data.item = await serviceService.getAllUser();
      data.item = data.item.message;
      $("#editServiceModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#editServiceModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      handleEdit,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="editServiceModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Cập nhật dịch vụ
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body container">
          <input
            type="search"
            placeholder="tìm kiếm theo tên dịch vụ"
            class="p-1 w-50"
            style="border: 1px solid #ccc; border-radius: 6px"
            v-model="data.searchText"
          />

          <form @submit.prevent="handleEdit" class="mt-3">
            <!--Table  -->
            <table class="table m-0 p-0">
              <thead class="thead-dark">
                <tr class="m-0 p-0">
                  <th scope="col">Tên dịch vụ</th>
                  <th scope="col">Đơn giá</th>
                  <th scope="col">Đơn vị tính</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, index) in data.setPage"
                  :key="index"
                  :id="index"
                >
                  <th class="p-0">
                    <input
                      type="text"
                      class="w-100 px-1"
                      v-model="value.name"
                      style="border: 1px solid #ccc"
                    />
                  </th>
                  <th class="p-0">
                    <input
                      type="text"
                      v-model="value.price"
                      class="w-100 px-1"
                      style="border: 1px solid #ccc"
                    />
                  </th>
                  <th class="p-0">
                    <input
                      type="text"
                      class="w-100 px-1"
                      v-model="value.unit"
                      style="border: 1px solid #ccc"
                    />
                  </th>
                </tr>
              </tbody>
            </table>
            <div class="form-group row justify-content-around mb-0 mt-2">
              <button type="submit" class="btn btn-login col-sm-2">
                Cập nhật
              </button>
            </div>
          </form>
          <paginationVue
            class="m-0 p-0 mt-1"
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
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-content {
  width: 160%;
  margin-left: -16%;
}
</style>
