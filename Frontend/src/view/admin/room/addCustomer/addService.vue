<script>
import { reactive, ref, onMounted, onBeforeMount, computed } from "vue";
import moment from "moment";
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

    const save = async () => {
      data.item.forEach((value) => {
        if (value.checked) data.checkedNewList.push(value);
      });

      data.removeList = data.checkedList.filter(
        (item) => !data.checkedNewList.includes(item)
      );

      try {
        data.removeList.forEach(async (value) => {
          const documentRemove = await service_roomService.delete(props._id, {
            RoomId: props._id,
            ServiceId: value._id,
          });
        });

        const start = new moment();
        data.checkedNewList.forEach(async (value) => {
          const documentRemove = await service_roomService.create({
            RoomId: props._id,
            ServiceId: value._id,
            start: start,
          });
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
      const documentService = await serviceService.getAll(); // lấy tất cả dịch vụ
      data.item = documentService.message;
      const documentServiceRoom = await service_roomService.get(props._id); // lấy ds dịch vụ của 1 phòng
      data.serviceRoom = documentServiceRoom.message;
      data.item = data.item.map((item) => {
        // format dữ liệu và các dịch vụ đang sử dụng sẽ được checked true
        return {
          ...item,
          price: formatCurrency(item.price),
          checked: data.serviceRoom.some((obj) => obj.ServiceId == item._id),
        };
      });
      data.checkedList = []; // khởi tạo ds các khách đang thuê phòng hiện tại
      data.checkedNewList = []; // khởi tạo ds khách trọ mới
      data.removeList = []; // khởi tạo ds khách trọ rời khỏi phòng trọ
      data.item.forEach((value) => {
        if (value.checked) {
          data.checkedList.push(value);
        }
      });
      data.length = data.item.length; // dùng để hiển thị số bản ghi ở dưới phân trang
    };
    onMounted(async () => {
      await refresh();
    });
    return { data, save };
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
      :isInputChecked="true"
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
    <div class="centered-button">
      <button class="btn btn-login" @click="save">Lưu</button>
    </div>
  </div>
</template>
<style scope></style>
