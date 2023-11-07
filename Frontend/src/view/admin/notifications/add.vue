<script>
import { reactive, onMounted, ref, computed, watch } from "vue";
import socket from "../../../socket";
//service
import userService from "../../../service/user.service";
import notificationService from "../../../service/notification.service";
import user_notification from "../../../service/user_notification.service";
//component
import Select from "../../../components/select/select.vue";
import Table from "../../../components/table/tableChecked.table.vue";
import paginationVue from "../../../components/pagination/pagination.vue";
//js
import {
  checkStringAndNumber,
  sanitizeInput,
} from "../../../assets/js/checkInput.common";
import boardinghouseService from "../../../service/boardinghouse.service";
export default {
  components: { Select, Table, paginationVue },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        content: "",
        date: new Date(),
      },
      users: [],
      checkedList: [],
      removeList: [],
      setPage: [],
      searchPage: [],
      searchText: "",
      currentPage: 0,
      sizePage: 2,
      length: 0,
      totalPage: 0,
      boarding: [],
      selectedBoarding: "",
      error: { content: "" },
      flag: true,
      btnSubmit: "Thông báo",
    });
    const isModalOpen = ref(false);
    data.length = computed(() => (data.users ? data.users.length : 0));
    data.totalPage = computed(() =>
      data.users ? Math.ceil(data.users.length / data.sizePage) : 0
    );
    data.searchPage = computed(
      () => (
        (data.currentPage = 1),
        data.users
          ? data.users.filter((item) =>
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
    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal boarding");
    };
    const closeModal = () => {
      console.log("close modal boarding");
      emit("closeModal");
    };

    watch(
      () => data.selectedBoarding,
      async (newValue, oldValue) => {
        await refresh();
        if (newValue == "all" || newValue == "''") return;
        data.users = data.users.filter((item) => item.boardingId == newValue);
      }
    );

    const refresh = async () => {
      try {
        data.users = [];
        //***. Chú ý danh sách show ra để checkbox phải là người trọ thuộc nhà trọ của ng đăng nhập
        const documentUsers = await userService.getAllTenant("Tenant");

        for (let value of documentUsers.message) {
          data.users.push(value.user);
        }

        data.users = data.users.map((item) => {
          return {
            ...item,
            sex: item.sex ? "Nữ" : "Nam",
            checked: false,
          };
        });
        data.boarding = await boardinghouseService.getAllUser();
        data.boarding = data.boarding.message;
        data.boarding[data.boarding.length] = {
          _id: "all",
          name: "Tất cả",
        };
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

    const save = async () => {
      try {
        data.checkedList = data.users.filter((item) => {
          return item.checked == true;
        });

        for (let key in data.item) {
          if (data.item[key] == "") {
            data.error[key] = "Chưa nhập thông tin";
            data.flag = true;
          }
        }
        if (!data.flag) {
          // 1.tạo 1 thông báo mới
          data.btnSubmit = "Đang thông báo";
          data.item.content = sanitizeInput(data.item.content);
          const documentNoti = await notificationService.create(data.item);

          for (let value of data.checkedList) {
            const data = {
              NotificationId: documentNoti.message["_id"],
              UserId: value["_id"],
            };
            const documentUserNoti = await user_notification.create(data);
          }
          socket.emit("createNoti", documentNoti);

          emit("add");
          data.btnSubmit = "Thông báo";
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
    onMounted(async () => {
      $("#addNotificationModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#addNotificationModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
      await refresh();
    });

    return {
      data,
      save,
      checkStringAndNumber,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="addNotificationModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">Thông báo</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form
            @submit.prevent="save"
            enctype="multipart/form-data"
            class="container mt-3"
          >
            <div class="form-group row">
              <label for="inputContent" class="col-sm-3 col-form-label p-0"
                >Nội dung thông báo:</label
              >
              <div class="col-sm-9 m-0 p-0 mb-2">
                <textarea
                  name=""
                  cols="30"
                  rows="4"
                  type="number"
                  class="form-control"
                  id="inputContent"
                  @blur="
                    () => {
                      if (data.item.content == '') {
                        data.error.content = 'Chưa nhập nội dung thông báo';
                        data.flag = true;
                      }
                    }
                  "
                  @input="
                    data.error.content = '';
                    data.flag = false;
                  "
                  v-model="data.item.content"
                ></textarea>

                <div v-if="data.error.content" class="invalid-error">
                  {{ data.error.content }}
                </div>
              </div>
              <div class="form-group row m-0 p-0">
                <input
                  class="my-2 p-1 mr-1 form-control col-8"
                  style="
                    border: solid 1px #ccc;
                    border-radius: 4px;
                    width: 400px;
                  "
                  type="search"
                  placeholder="Tìm kiếm theo tên khách trọ"
                  v-model="data.searchText"
                />
                <Select
                  class="col my-2 p-1"
                  :title="`Chọn nhà trọ`"
                  :data="data.boarding"
                  @choose="(value) => (data.selectedBoarding = value)"
                  style="height: 36px"
                ></Select>
              </div>
              <div class="form-group row m-0 p-0">
                <Table
                  :data="data.setPage"
                  :name="'Noti'"
                  :fields="['Họ tên', 'GT', 'SĐT', 'Email', 'Địa chỉ']"
                  :titles="['userName', 'sex', 'phone', 'email', 'address']"
                  :action="false"
                  :isInputChecked="true"
                  :currentPage="data.currentPage"
                  :sizePage="data.sizePage"
                ></Table>
              </div>
            </div>
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
            <div class="form-group row justify-content-around mb-0">
              <button
                type="submit"
                class="btn btn-login col-sm-2"
                :disabled="data.btnSubmit == 'Đang thông báo'"
              >
                {{ data.btnSubmit }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-content {
  width: 140%;
  margin-left: -18%;
}
</style>
