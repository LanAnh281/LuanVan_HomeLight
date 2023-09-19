<script>
import { reactive, ref, onMounted, watch, computed } from "vue";
import Swal from "sweetalert2";
//service
import roomService from "../../../service/room.service";
import userRoomService from "../../../service/user_room.service";
//asset  js
import {
  successAd,
  success,
  deleted,
  warning,
} from "../../../assets/js/common.alert";
//component
import Edit from "./edit.vue";

import loginService from "../../../service/login.service";
// import addCustomer from "./addCustomer/addCutomer.form.vue";
export default {
  comments: { Edit },
  props: {
    data: { type: Array, default: [] },
    _idBoarding: { type: String, default: "" },
    currentPage: { type: Number, default: 1 },
    status: { type: Object, default: { _id: "" } },
  },
  setup(props, { emit }) {
    const data = reactive({
      item: [],
      totalPage: 0,
      length: 0,
      sizePage: 1,
      setPage: [],
    });
    data.totalPage = computed(() =>
      data.item ? Math.ceil(data.item.length / data.sizePage) : 0
    );

    data.setPage = computed(() =>
      data.item
        ? data.item.slice(
            (props.currentPage - 1) * data.sizePage,
            props.currentPage * data.sizePage
          )
        : []
    );
    const handleEdit = async (value) => {
      try {
        const isDeleted = false;
        const showSweetAlert = async () => {
          const { value: formValues } = await Swal.fire({
            title: "Điện nước tiêu thụ",
            html: `
              <div  class='row  form-group ml-2 '>
                <label class='col-3'>Điện mới:</label>
                <input type='number' id="electric" class='col-9 form-control'></input>
              </div>
              <div class='row form-group   ml-2'>
                <label class='col-3'>Nước mới:</label>
                <input type='number' id="water" class='col-9 form-control'></input>
              </div>
            `,
            showCancelButton: true,
            focusConfirm: false,
            preConfirm: () => {
              const electric = document.getElementById("electric").value;
              const water = document.getElementById("water").value;
              if (!electric || !water) {
                Swal.showValidationMessage("Vui lòng điền đầy đủ thông tin");
              }
              return {
                electric,
                water,
              };
            },
          });
          return formValues;
        };

        // Gọi hàm showSweetAlert khi bạn muốn hiển thị SweetAlert
        const formValues = await showSweetAlert();

        // trả phòng
        if (formValues) {
          // xóa tất cả khách trọ ra khỏi phòng
          const document = await userRoomService.deleteAll(value);
          // lấy danh sách khách trọ của 1 phòng và thực hiện so sánh để cập nhật lại trạng thái phòng
          const documentUserRoom = await userRoomService.get(value);
          const status =
            documentUserRoom.message.Users.length == 0 ? false : true;
          // so sánh
          if (documentUserRoom.message.Users.length == 0) {
            //cập nhật
            const documentRoom = await roomService.update(value, {
              name: documentUserRoom.message.name,
              price: documentUserRoom.message.price,
              area: documentUserRoom.message.area,
              status: status,
              boardingId: documentUserRoom.message.boardingId,
              cycleId: "null",
            });
          }
          // api  tính tiền
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const handleDelete = async () => {
      try {
        const isDeleted = await deleted(
          "Xóa",
          "Bạn có chắc chắc xóa phòng trọ."
        );
        if (isDeleted) {
          const document = await roomService.delete(value);
          document["status"] == "success"
            ? success("Thành công")
            : warning("Thất bại", "");
          emit("handleDelete");
        }
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
    watch(
      () => props._idBoarding,
      async (newValue, oldValue) => {
        await refresh();
      }
    );

    const refresh = async () => {
      data.item = await roomService.getAll();
      data.item = data.item.message;

      data.item = data.item.filter(
        (item) =>
          item.boardingId == props._idBoarding &&
          item.status == props.status["_id"]
      );

      data.item = data.item.map((item) => {
        return {
          ...item,
          price: Number(item.price).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
        };
      });
      data.length = data.item.length;
      emit("totalPage", { totalPage: data.totalPage, length: data.length });
    };
    watch(
      () => props.status,
      async (newValue, oldValue) => {
        // console.log("watch status :", newValue);
        await refresh();
      }
    );

    onMounted(async () => {
      await refresh();
    });
    return { data, handleDelete, handleEdit };
  },
};
</script>
<template>
  <div>
    <div style="display: grid; grid-template-columns: repeat(5, 1fr)" class="">
      <div
        class="card pt-1 px-0 pb-0 mr-4 row justify-content-between"
        v-for="(value, index) in data.setPage"
        style="border-radius: 5px"
        :key="index"
      >
        <div class="card-item col-12 p-0 m-0">
          <!-- image -->
          <img
            class="card-img-top"
            src="../../../assets/image/lightHouse.png"
            style="object-fit: contain; height: 30%; width: 100%"
          />
          <hr style="display: block" />
          <!--  -->
          <div class="px-2 mx-1">
            <p class="card-title text-center"><b>Phòng:</b> {{ value.name }}</p>
            <p class="card-text">
              <b>Giá phòng:</b>
              {{ value.price }}
            </p>
            <p class="card-text"><b>Diện tích:</b> {{ value.area }}</p>
          </div>

          <!-- icon -->
          <div class="px-2 mx-4">
            <span
              class="material-symbols-outlined m-2 view border rounded p-1"
              title="chi tiết"
              data-toggle="modal"
              data-target="#viewRoomModal"
              @click="$emit('view', value._id)"
            >
              visibility
            </span>
            <!-- Edit -->
            <span
              class="material-symbols-outlined mr-1 edit border rounded p-1"
              title="chỉnh sửa"
              data-toggle="modal"
              data-target="#roomUpdateModal"
              @click="$emit('edit', value._id)"
            >
              edit
            </span>
            <!-- delete room -->
            <span
              class="material-symbols-outlined mr-1 delete border rounded p-1"
              title="xóa phòng"
              @click="handleDelete(value._id)"
            >
              close
            </span>
            <!-- trả phòng -->
            <span
              class="material-symbols-outlined out border rounded p-1"
              title="trả phòng"
              @click="handleEdit(value._id)"
            >
              logout
            </span>
          </div>
          <!-- Add customer -->
          <div class="px-2 mt-1 my-1 text-center">
            <button
              class="btn btn-primary btn-menu p-1"
              data-toggle="modal"
              data-target="#addCustomerModal"
              @click="$emit('addCutomer', value._id)"
            >
              Thêm khách
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card-item {
  position: relative;
  cursor: pointer;
}

.delete-icon,
.edit-icon {
  position: absolute;
  cursor: pointer;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 1;
  font-size: 1.2rem;
  background-color: #fbf9f9;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}
.delete-icon {
  top: -10px;
  right: -4px;
  color: var(--red);
  font-weight: 600;
}
.delete-icon:hover {
  color: red;
  font-size: 1.3rem;
}
.edit-icon {
  top: 16px;
  right: -4px;
  color: var(--yellow);
}
.edit-icon:hover {
  color: rgb(247, 203, 6);
  font-size: 1.3rem;
}

.view:hover {
  color: #00f0ff;
  text-shadow: 0 0 2px #00f0ff;
  box-shadow: 0 0 4px #00f0ff;
  transition: 0.5s;
}
.out:hover {
  color: #03f803;
  text-shadow: 0 0 2px #00ff00;
  box-shadow: 0 0 4px #00ff00;
  transition: 0.5s;
}
.delete:hover {
  color: #f80303;
  text-shadow: 0 0 2px #ff6200;
  box-shadow: 0 0 4px #ff0000;
  transition: 0.5s;
}
.edit:hover {
  color: #f8cb03;
  text-shadow: 0 0 2px #ffbb00;
  box-shadow: 0 0 4px #ffae00;
  transition: 0.5s;
}
button:hover {
  text-shadow: 0 0 5px #fff;
}
.edit-icon:hover {
  text-shadow: 0 0 5px #f8d435;
}
.delete-icon:hover {
  text-shadow: 0 0 5px #e6d4cd;
}
.btn-menu {
  width: 114px;
}
</style>
