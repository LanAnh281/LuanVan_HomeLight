<script>
import { ref, reactive, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
//service
import roleService from "../../../service/role.service";
import positionService from "../../../service/position.service";
import accountService from "../../../service/account.service";
//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
//component
import roleForm from "../../../components/form/role.form.vue";
import accuountForm from "../../../components/form/account.form.vue";
import tablePosition_role from "../../../components/table/position_role.table.vue";
import Table from "../../../components/table/table.vue";
import { success, warning } from "../../../assets/js/common.alert";
export default {
  components: { roleForm, accuountForm, tablePosition_role, Table },
  setup() {
    const router = useRouter();
    const data = reactive({
      items: [{ name: "", Roles: [{ name: "" }] }],
      accounts: [],
      flag: true,
    });
    const css = reactive({
      director: [{ name: "Tài khoản" }, { name: "Vai trò" }],
      isDirector: "Tài khoản",
    });
    const component = reactive({
      roleModal: false,
      accountModal: false,
      tablePosition_role: false,
      table: true,
    });
    let intervalId = null;
    watch(
      () => css.isDirector,
      (newValue, oldValue) => {
        if (newValue == "Tài khoản") {
          component.tablePosition_role = false;
          component.table = true;
        } else {
          component.tablePosition_role = true;
          component.table = false;
        }
      }
    );
    onMounted(async () => {
      const document = await positionService.getAll();
      data.items = document.message;
      const documentAccount = await accountService.getAll();
      data.accounts = documentAccount.message;
      component.isDirector = "Tài khoản";

      await checkAccessToken(router);
      intervalId = setInterval(async () => {
        await checkAccessToken(router);
      }, 180 * 60 * 1001); // 60000 milliseconds = 1 minutes
    });
    onBeforeUnmount(() => {
      clearInterval(intervalId); // Xóa khoảng thời gian khi component bị hủy
    });
    const createRole = async () => {
      console.log("create Role");
      const document = await roleService.getAll();
      data.items = document.message;
    };
    const createAccount = async () => {
      console.log("create Account");
    };
    const togge_off = async (value) => {
      const document = await accountService.updateActive(value, {
        isActive: false,
      });
      if (document.status == "success") {
        success("Thành công", "");
        const documentAccount = await accountService.getAll();
        data.accounts = documentAccount.message;
      } else warning("Thất bại", "");
    };
    return { data, css, createRole, createAccount, component, togge_off };
  },
};
</script>
<template>
  <div class="body">
    <div class="border-radius my-3 row m-0 justify-content-end">
      <div class="col-8 m-0 p-0 row justify-content-end">
        <button
          class="col-2 my-1 mr-1 btn btn-primary"
          data-toggle="modal"
          data-target="#roleModal"
          @click="component.roleModal = !component.roleModal"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              add
            </span>
            <span style="color: var(--white)">Thêm quyền</span>
          </div>
        </button>

        <button
          class="col-2 my-1 mr-3 btn btn-primary"
          data-toggle="modal"
          data-target="#accountModal"
          @click="component.accountModal = !component.accountModal"
        >
          <div class="row justify-content-center plus">
            <span class="material-symbols-outlined" style="color: var(--white)">
              person_add
            </span>
            <span style="color: var(--white)">Tài khoản</span>
          </div>
        </button>
      </div>
    </div>
    <!--Director  -->

    <div class="border-radius my-3 mx-0 row">
      <div class="col-4">
        <button
          class="my-2 mx-1 btn px-2 director"
          v-for="(value, index) in css.director"
          :key="index"
          :class="value.name == css.isDirector ? 'isActiveDirector' : ''"
          @click="css.isDirector = value.name"
        >
          {{ value.name }}
        </button>
      </div>
      <div class="col mx-3 p-0 row justify-content-end">
        <button class="my-2 btn btn-warning">Áp dụng</button>
      </div>
    </div>
    <!-- componment -->
    <tablePosition_role
      v-if="component.tablePosition_role"
    ></tablePosition_role>
    <Table
      v-if="component.table"
      :data="data.accounts"
      :fields="['Emai', 'Vai trò']"
      :titles="['userName', 'positionName']"
      :action="true"
      @togge_off="(value) => togge_off(value)"
      @togge_on="console.log('on')"
    ></Table>
    <roleForm
      @add="createRole"
      @closeModal="component.roleModal = !component.roleModal"
      v-if="component.roleModal"
    ></roleForm>
    <accuountForm
      @add="createAccount"
      @closeModal="component.accountModal = !component.accountModal"
      v-if="component.accountModal"
    ></accuountForm>
  </div>
</template>
<style scoped>
.body {
  min-height: calc(100vh);
}
.plus:hover > * {
  text-shadow: 0 0 2px #ffff;
}

.director {
  height: 36px;
  min-width: 100px;
  margin-top: 6px;
  background-color: var(--chocolate);
  color: var(--white);
}
.isActiveDirector {
  background-color: var(--ruby);
  text-shadow: 0 0 2px #fff;
}
.btn-warning {
  color: var(--white);
}
.btn-warning:hover {
  text-shadow: 0 0 2px #fff;
}
</style>
