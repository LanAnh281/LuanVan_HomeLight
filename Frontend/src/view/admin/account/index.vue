<script>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useRoute, useRouter } from "vue-router";
//service
import roleService from "../../../service/role.service";
import positionService from "../../../service/position.service";
import accountService from "../../../service/account.service";
//asset/js
import { checkAccessToken } from "../../../assets/js/common.login";
import { success, warning } from "../../../assets/js/common.alert";

//component
import roleForm from "../../../components/form/role.form.vue";
import accuountForm from "../../../components/form/account.form.vue";
import tablePosition_role from "../../../components/table/position_role.table.vue";
import Table from "../../../components/table/table.vue";
import role_positionForm from "../../../components/form/role_position.form.vue";
import Pagination from "../../../components/pagination/pagination.vue";

export default {
  components: {
    roleForm,
    accuountForm,
    tablePosition_role,
    role_positionForm,
    Table,
    Pagination,
  },
  setup() {
    const router = useRouter();
    const data = reactive({
      items: [{ name: "", Roles: [{ name: "" }] }],
      accounts: [],
      rolePosition: [{ name: "", Roles: [{ name: "" }] }],
      flag: true,
      positionId: "",
      pageAccounts: [],
      sizePage: 2,
      currentPage: 1,
      previousPage: 0,
      totalPage: 0,
    });
    data.totalPage = computed(() =>
      data.accounts.length
        ? Math.round(Math.ceil(data.accounts.length) / data.sizePage)
        : 0
    );
    data.pageAccounts = computed(() =>
      data.accounts.slice(
        (data.currentPage - 1) * data.sizePage,
        data.currentPage * data.sizePage
      )
    );
    const css = reactive({
      director: [{ name: "Tài khoản" }, { name: "Vai trò" }],
      isDirector: "Tài khoản",
    });
    const component = reactive({
      roleModal: false,
      checkPosition: "",
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
      //Positions : display form add role and table
      const document = await positionService.getAll();
      data.items = document.message;
      //accounts : display table 'Tài khoản'
      const documentAccount = await accountService.getAll();
      data.accounts = documentAccount.message;
      //box director 'Tài khoản' and 'Vai trò'
      component.isDirector = "Tài khoản";
      // display form checked roles.
      const documentRolePosition = await positionService.getAll();
      data.rolePosition = documentRolePosition.message;
      const length = data.rolePosition.length;
      for (let i = 0; i < length; i++) {
        data.rolePosition[i].disable = false;
      }
      // accesstoken
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
      const documentAccount = await accountService.getAll();
      data.accounts = documentAccount.message;
    };
    const togge_off = async (value, isActive) => {
      const document = await accountService.updateActive(value, {
        isActive: isActive,
      });
      if (document.status == "success") {
        success("Thành công", "");
        const documentAccount = await accountService.getAll();
        data.accounts = documentAccount.message;
      } else warning("Thất bại", "");
    };
    const refreshRolePosition = async () => {
      const documentRolePosition = await positionService.getAll();
      data.rolePosition = documentRolePosition.message;
      for (let index in data.rolePosition) {
        data.rolePosition[index].checked =
          data.rolePosition[index]._id == data.positionId ? true : false;
        data.rolePosition[index].disable =
          data.rolePosition[index]._id == data.positionId ? false : true;
      }
    };
    return {
      data,
      css,
      createRole,
      createAccount,
      component,
      togge_off,
      positionService,
      refreshRolePosition,
    };
  },
};
</script>
<template>
  <div class="body mb-5 pb-5">
    <div class="border-radius my-3 row m-0 justify-content-end">
      <div class="col-8 m-0 p-0 row justify-content-end">
        <button
          class="col-2 mr-1 btn btn-primary"
          style="max-width: 15%; height: 36px; margin-top: 6px"
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
          class="col-2 mr-3 btn btn-primary"
          style="max-width: 15%; height: 36px; margin-top: 6px"
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
      <div
        class="col mx-3 my-0 p-0 row justify-content-end"
        v-if="css.isDirector == 'Vai trò'"
      >
        <button
          class="btn btn-warning"
          style="max-width: 12%; height: 36px; margin-top: 8px"
          data-toggle="modal"
          data-target="#rolePositionModal"
        >
          Áp dụng
        </button>
      </div>
    </div>
    <!-- componment -->
    <tablePosition_role
      v-if="component.tablePosition_role"
      :data="data.rolePosition"
      :fileds="['Vai trò', 'Danh sách quyền']"
      @checked="
        (value) => {
          component.checkPosition = true;
          data.positionId = value;
        }
      "
      @unchecked="
        (value) => {
          component.checkPosition = false;
          data.positionId = '';
        }
      "
    ></tablePosition_role>
    <Table
      v-if="component.table"
      :data="data.pageAccounts"
      :fields="['Emai', 'Vai trò']"
      :titles="['userName', 'positionName']"
      :action="true"
      :currentPage="data.currentPage"
      :sizePage="data.sizePage"
      :account="true"
      @togge_off="(value) => togge_off(value, false)"
      @togge_on="(value) => togge_off(value, true)"
    ></Table>
    <pagination
      v-if="component.table"
      :totalPage="data.totalPage"
      :currentPage="data.currentPage"
      :size="data.sizePage"
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
    ></pagination>
    <roleForm
      @add="createRole"
      @closeModal="component.roleModal = !component.roleModal"
      v-if="component.roleModal"
    ></roleForm>
    <accuountForm
      v-if="component.accountModal"
      @add="createAccount"
      @closeModal="component.accountModal = !component.accountModal"
    ></accuountForm>
    <role_positionForm
      v-if="component.checkPosition"
      :position="data.positionId"
      @add="refreshRolePosition()"
    ></role_positionForm>
  </div>
</template>
<style scoped>
.body {
  min-height: 100vh;
}
.plus:hover > * {
  text-shadow: 0 0 2px #ffff;
}

.director {
  max-width: 25%;
  height: 36px;
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
