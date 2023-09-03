<script>
import { reactive, onMounted, ref } from "vue";

//service
import boardinghouseService from "../../service/boardinghouse.service";
import roomService from "../../service/room.service";
//component
import Select from "../select/select.vue";
//js
import {
  checkStringAndNumber,
  checkAddress,
  checkNumber,
} from "../../assets/js/checkInput.common";
import { successAd, warning } from "../../assets/js/common.alert";
export default {
  components: { Select },
  setup(props, { emit }) {
    const data = reactive({
      item: {
        name: "",
        price: "",
        area: "",
        boardingId: "",
        cycleId: null,
      },
      error: {
        name: "",
        price: "",
        area: "",
        boardingId: "",
      },
      flag: true,
      boarding: {},
    });
    const isModalOpen = ref(false);
    const openModal = () => {
      isModalOpen.value = true;
      console.log("open modal boarding");
    };
    const closeModal = () => {
      console.log("close modal boarding");
      emit("closeModal");
    };

    const refresh = () => {
      data.item = {
        name: "",
        price: "",
        area: "",
        boardingId: "",
        cycleId: null,
      };
      data.error = {
        name: "",
        price: "",
        area: "",
        boardingId: "",
      };
      data.flag = true;
    };
    const save = async () => {
      console.log("save");
      try {
        for (const key in data.error) {
          console.log("key", key, data.item[key]);
          if (data.item[key] == "") {
            data.error[key] = "Chưa nhập thông tin.";
            data.flag = true;
            console.log("1", key);
          }
        }
        console.log("data.flag:", data.flag);
        if (!data.flag) {
          console.log("data.otems:", data.item);
          const document = await roomService.create(data.item);

          console.log("doc", document);
          if (document["status"] == "success") {
            successAd(`Đã thêm phòng trọ ${document.message["name"]}`);
            refresh();
            emit("add");
          } else {
            console.log("Thất bại");
            warning("Thất bại", "Bạn không có quyền thêm phòng trọ.");
          }
        }
      } catch (error) {
        if (error) {
          warning("Thất bại", "Bạn không có quyền thêm nhà trọ.");
        }
        console.log(error);
      }
    };
    onMounted(async () => {
      const document = await boardinghouseService.getAll();
      data.boarding = document.message;
      $("#roomModal").on("show.bs.modal", openModal); //lắng nghe mở modal
      $("#roomModal").on("hidden.bs.modal", closeModal); //lắng nghe đóng modal
    });

    return {
      data,
      save,
      checkStringAndNumber,
      checkAddress,
      checkNumber,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="roomModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title title" id="exampleModalLabel">
            Thêm phòng trọ
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
        <div class="modal-body">
          <form
            @submit.prevent="save"
            enctype="multipart/form-data"
            class="container mt-3"
          >
            <!-- nhà trọ -->
            <div class="form-group row">
              <label for="inputname" class="col-sm-3 col-form-label p-0"
                >Nhà trọ :</label
              >
              <div class="col-sm-9">
                <Select
                  :title="'Chọn nhà trọ'"
                  :data="data.boarding"
                  @choose="(value) => (data.item.boardingId = value)"
                ></Select>
              </div>
            </div>

            <!--  -->
            <div class="form-group row">
              <label for="inputroom" class="col-sm-3 col-form-label p-0"
                >Tên phòng trọ :</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputroom"
                  @blur="
                    () => {
                      let isCheck = checkNumber(data.item.name);
                      if (isCheck) {
                        data.error.name = 'Tên nhà trọ là số.';
                        data.flag = true;
                      }
                    }
                  "
                  @input="
                    data.error.name = '';
                    data.flag = false;
                  "
                  v-model="data.item.name"
                />
                <div v-if="data.error.name" class="invalid-error">
                  {{ data.error.name }}
                </div>
              </div>
            </div>

            <div class="form-group row">
              <label for="inputprice" class="col-sm-3 col-form-label p-0"
                >Giá phòng :</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputprice"
                  @blur="
                    () => {
                      let isCheck = checkNumber(data.item.price);
                      if (isCheck) {
                        data.error.price = 'Giá phòng là số';
                        data.flag = true;
                      }
                    }
                  "
                  @input="
                    data.error.price = '';
                    data.flag = false;
                  "
                  v-model="data.item.price"
                />
                <div v-if="data.error.price" class="invalid-error">
                  {{ data.error.price }}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputarea" class="col-sm-3 col-form-label p-0"
                >Diện tích :</label
              >
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  id="inputarea"
                  @blur="
                    () => {
                      let isCheck = checkNumber(data.item.area);
                      if (isCheck) {
                        data.error.area = 'Diện tích phòng là số';
                        data.flag = true;
                      }
                    }
                  "
                  @input="
                    data.error.area = '';
                    data.flag = false;
                  "
                  v-model="data.item.area"
                />
                <div v-if="data.error.area" class="invalid-error">
                  {{ data.error.area }}
                </div>
              </div>
            </div>

            <div class="form-group row justify-content-around mb-0">
              <button type="submit" class="btn btn-login col-sm-3">Thêm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
