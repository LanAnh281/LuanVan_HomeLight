<script>
import { reactive, onMounted, computed } from "vue";
//service
import serviceService from "../../../../service/service.service";
import service_roomService from "../../../../service/service_room.service";
//component
import paginationVue from "../../../../components/pagination/pagination.vue";
import Table from "../../../../components/table/tableChecked.table.vue";
//js
import { formatCurrency } from "../../../../assets/js/format.common";
export default {
  components: { paginationVue, Table },
  props: { _id: { type: String, default: "" } },
  setup(props, { emit }) {
    const data = reactive({
      item: [],
      serviceRoom: [],
      setPage: [],
      checkedList: [],
      checkedNewList: [],
      removeList: [],
      currentPage: 1,
      sizePage: 5,
      totalPage: 0,
      length: 0,
    });
    data.totalPage = computed(() =>
      data.item ? Math.ceil(data.item.length / data.sizePage) : 0
    );
    data.setPage = computed(() =>
      data.item
        ? data.item.slice(
            (data.currentPage - 1) * data.sizePage,
            data.currentPage * data.sizePage
          )
        : []
    );

    const refresh = async () => {
      //lấy danh sách dịch vụ
      const documentService = await serviceService.getAll();
      data.item = documentService.message;
      // lấy ds dịch vụ của phòng
      const documentServiceRoom = await service_roomService.get(props._id);
      data.serviceRoom = documentServiceRoom.message;
      // thay đổi dữ liệu hiện thị
      data.item = data.item.map((item) => {
        return {
          ...item,
          price: formatCurrency(item.price),
          checked: data.serviceRoom.some((obj) => obj.ServiceId == item._id),
        };
      });
      // lọc từ danh sách dịch vụ , lấy đầy đủ thông tin của dịch vụ
      data.item = data.item.filter((item) => item.checked == true);
      data.length = data.item.length; // dùng để hiển thị số bản ghi ở dưới phân trang
    };
    onMounted(async () => {
      await refresh();
    });
    return { data };
  },
};
</script>

<template>
  <div style="">
    <Table
      :data="data.setPage"
      :fields="['Tên dịch vụ', 'Đơn giá', 'Đơn vị tính']"
      :titles="['name', 'price', 'unit']"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      :isInputChecked="false"
    ></Table>
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
<style scope></style>
