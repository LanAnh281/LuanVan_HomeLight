<script>
import { ref, reactive, onMounted } from "vue";
import billService from "../../service/bill.service";
import serviceService from "../../service/service.service";
import service_roomService from "../../service/service_room.service";

import { formatCurrency } from "../../assets/js/format.common";
import Table from "../../components/table/table.vue";

export default {
  components: { Table },
  setup() {
    const data = reactive({
      item: {
        Rooms: [
          { name: "", address: "", price: 0, BoardingHouse: { name: "" } },
        ],
      },
      services: [],
      serviceRoom: [],
    });
    const refresh = async () => {
      try {
        const documentBill = await billService.getAllCustomer();
        data.item = documentBill.message;
        console.log(data.item);
        //lấy danh sách dịch vụ
        const documentService = await serviceService.getAll();
        data.services = documentService.message;
        // lấy ds dịch vụ của phòng
        const documentServiceRoom = await service_roomService.get(
          data.item.Rooms[0]._id
        );
        data.serviceRoom = documentServiceRoom.message;
        data.services = data.services.map((item) => {
          return {
            ...item,
            price: formatCurrency(item.price),
            checked: data.serviceRoom.some((obj) => obj.ServiceId == item._id),
          };
        });
        // lọc từ danh sách dịch vụ , lấy đầy đủ thông tin của dịch vụ
        data.services = data.services.filter((item) => item.checked == true);
        console.log(data.services);
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
    onMounted(async () => {
      try {
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
    });
    return {
      data,
      formatCurrency,
    };
  },
};
</script>
<template>
  <div class="body m-0 container-fluid">
    <h6 class="title text-center my-3">Thông tin phòng trọ</h6>
    <div class="row">
      <div class="col-6 m-0 mr-1 p-0">
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Tên nhà trọ:</p>
          <p class="col-8 m-0 p-0">
            {{ data.item.Rooms[0].BoardingHouse.name }}
          </p>
        </div>
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Địa chỉ:</p>
          <p class="col-8 m-0 p-0">
            {{ data.item.Rooms[0].BoardingHouse.address }}
          </p>
        </div>
      </div>
      <div class="col p-0 m-0">
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Tên phòng :</p>
          <p class="col-6 p-0 m-0">{{ data.item.Rooms[0].name }}</p>
        </div>
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Diện tích :</p>
          <p class="col-6 p-0 m-0">
            {{ data.item.Rooms[0].long }}x {{ data.item.Rooms[0].wide }} m²
          </p>
        </div>
        <div class="row justify-content-start p-0 m-0">
          <p class="col-3 m-0 p-0">Đơn giá :</p>
          <p class="col-6 p-0 m-0">
            {{ formatCurrency(data.item.Rooms[0].price) }}
          </p>
        </div>
      </div>
      <div class="col-12 row justify-content-start p-0 m-0">
        <p class="col-1 mr-5 p-0">Mô tả :</p>
        <p class="col-8 p-0 m-0">
          {{ data.item.Rooms[0].content }}
        </p>
      </div>
    </div>
    <hr />
    <h6 class="title text-center my-3">Dịch vụ</h6>
    <Table
      :data="data.services"
      :fields="['Tên dịch vụ', 'Đơn giá', 'Đơn vị tính']"
      :titles="['name', 'price', 'unit']"
    ></Table>
  </div>
</template>
<style scoped>
.body {
  height: 240vh;
}
</style>
