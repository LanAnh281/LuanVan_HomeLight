<script>
import { ref, reactive, watch, onMounted } from "vue";
//js
import {
  formatCurrency,
  formatDateTime,
} from "../../../assets/js/format.common";
export default {
  setup() {
    const data = reactive({
      item: {},
      selectDate: new Date(),
    });
    const now = new Date();
    const refresh = async () => {
      try {
        console.log("refresh");
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
    const handleDate = async (value) => {
      try {
        data.selectDate = new Date(value.target.value);
        console.log("Ngày đã chọn", value.target.value);

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
    return {
      handleDate,
      data,
    };
  },
};
</script>
<template>
  <div class="body container-fluid m-0 pr-5">
    <div class="row m-0 text-center mt-2">
      <div class="input-group col-2" style="">
        <input
          type="month"
          @input="handleDate"
          class="p-1"
          style="background-color: var(--background); border: 1px solid #ebebeb"
        />
      </div>
    </div>
    <div class="row justify-content-between mx-2">
      <div class="col-9 row">
        <div class="col-12"></div>
        <div class="col-12"></div>
        <div class="col-12"></div>
      </div>
      <div class="col-3">
        <p>Ngày lập:</p>
        <button class="btn btn-success" disabled="true">Đã thanh toán</button>
        <button class="btn"></button>
      </div>
      <div class="col-12 text-center m-0 p-0">
        <h5 class="title" style="color: black">
          Hóa đơn quản lý nhà trọ Tháng {{ data.selectDate.getMonth() + 1 }}/{{
            data.selectDate.getFullYear()
          }}
        </h5>
        <!-- <p>Tháng {{ now.getMonth() + 1 }} / {{ now.getFullYear() }}</p> -->
      </div>
      <div class="col-12 row mx-1 m-0 px-1 p-0">
        <p class="col-1 m-0 p-0"></p>
        <p class="col-10 m-0 p-0"></p>
      </div>

      <table class="table mt-2 mx-2 text-center">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Nội dung</th>
            <th scope="col">Chỉ số cũ</th>
            <th scope="col">Chỉ số mới</th>
            <th scope="col">Tiêu thụ</th>
            <th scope="col">Đơn giá (₫)</th>
            <th scope="col">Thành tiền (₫)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td colspan="3"></td>

            <td></td>
            <td></td>
          </tr>
          <tr>
            <th>Thành tiền</th>
            <td colspan="4"></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <strong class="mx-2 text-center">Thành tiền bằng chữ: </strong>
    </div>
    <div class="text-center">Không có hóa đơn</div>
  </div>
</template>
<style scoped>
.body {
  height: 150vh;
}
</style>
<!-- Tại đây show hóa đơn ra , thanh toán, lọc và ngày đã thanh toán -->
