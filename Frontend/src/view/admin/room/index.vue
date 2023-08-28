<script>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
//service
import loginService from "../../../service/login.service";
//asset/js

//components
import Select from "../../../components/select/select.vue";

export default {
  components: { Select },
  setup() {
    const router = useRouter();
    const data = reactive({
      items: {
        name: "",
        area: "",
        price: "",
      },
      status: [
        { _id: false, name: "Chưa thuê" },
        { _id: true, name: "Đã thuê" },
      ],
      fee: [
        {
          _id: false,
          name: "Chưa thanh toán",
        },
        { _id: true, name: "Đã thanh toán" },
      ],
    });
    const changeStatus = (value) => {
      console.log("Status:", value);
    };
    onMounted(async () => {});
    return { data, changeStatus };
  },
};
</script>
<template>
  <div class="body m-0">
    <div class="border-radius my-3 row m-0">
      <div class="input-group col-2 align-items-center">
        <Select
          :title="`Trạng thái phòng`"
          :data="data.status"
          @choose="(value) => changeStatus(value)"
        ></Select>
      </div>
      <div class="input-group col-2 align-items-center">
        <Select
          :title="`Tiền phòng`"
          :data="data.fee"
          @choose="(value) => changeStatus(value)"
        ></Select>
      </div>
      <div class="col-2">
        <button
          class="btn btn-primary p-0"
          style="width: 103px; height: 36px; margin-top: 6px"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              domain_add
            </span>
            <span style="color: var(--white)">Thêm nhà</span>
          </div>
        </button>
      </div>
    </div>
    <div class="border-radius my-3"></div>
  </div>
</template>
<style scope>
.body {
  height: calc(100vh - var(--footer));
}
.border-radius {
  border: 1px solid #eae6e6;
  border-radius: 5px;
  height: 50px;
}
.plus:hover > * {
  text-shadow: 0 0 2px #ffff;
}
</style>
