import { createWebHistory, createRouter } from "vue-router";

const routes = [
  //
  {
    path: "/simple",
    name: "simple",
    component: () => import("../view/user/simple.vue"),
  },

  {
    path: "/boot",
    name: "boot",
    component: () => import("../view/user/bootstrap.vue"),
  },
  {
    path: "/content",
    name: "content",
    component: () => import("../view/user/content.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../view/common/login.vue"),
  },
  {
    path: "/forgotPassword",
    name: "forgotPassword",
    component: () => import("../view/common/fogotPassword.vue"),
  },
  {
    path: "/resetPassword",
    name: "resetPassword",
    component: () => import("../view/common/resetPassword.vue"),
  },
  {
    path: "/changePassword",
    name: "changePassword",
    component: () => import("../view/common/changePassword.vue"),
  },
  //superAdmin
  //account
  {
    path: "/superAdmin/account",
    name: "accountSuperAdmin",
    component: () => import("../view/superAdmin/account/index.vue"),
  },

  {
    path: "/superAdmin/billSuperAdmin",
    name: "billSuperAdmin",
    component: () => import("../view/superAdmin/bill/index.vue"),
  },
  {
    path: "/superAdmin/customerSuperAdmin",
    name: "customerSuperAdmin",
    component: () => import("../view/superAdmin/customer/index.vue"),
  },

  {
    path: "/superAdmin/notificationsSuperAdmin",
    name: "notificationsSuperAdmin",
    component: () => import("../view/superAdmin/notification/index.vue"),
  },
  {
    path: "/superAdmin/dashboardSuperAdmin",
    name: "dashboardSuperAdmin",
    component: () => import("../view/superAdmin/dashboard/index.vue"),
  },
  {
    path: "/superAdmin/reportSuperAdmin",
    name: "reportSuperAdmin",
    component: () => import("../view/superAdmin/report/index.vue"),
  },
  //Admin

  //dashboard
  {
    path: "/admin/dashboard",
    name: "dashboard",
    component: () => import("../view/admin/dashboard/index.vue"),
  },
  {
    path: "/admin/customer",
    name: "customer",
    component: () => import("../view/admin/customer/index.vue"),
  },
  {
    path: "/admin/room",
    name: "room",
    component: () => import("../view/admin/room/index.vue"),
  },

  {
    path: "/admin/electric",
    name: "electric",
    component: () => import("../view/admin/electric/index.vue"),
  },

  {
    path: "/admin/service",
    name: "service",
    component: () => import("../view/admin/service/index.vue"),
  },
  {
    path: "/admin/bill",
    name: "bill",
    component: () => import("../view/admin/bill/index.vue"),
  },
  {
    path: "/admin/billLandlord",
    name: "landlord",
    component: () => import("../view/admin/bill/landlord.vue"),
  },
  {
    path: "/admin/histories",
    name: "histories",
    component: () => import("../view/admin/bill/histories.vue"),
  },
  {
    path: "/admin/notifications",
    name: "notifications",
    component: () => import("../view/admin/notifications/index.vue"),
  },
  {
    path: "/admin/spending",
    name: "spending",
    component: () => import("../view/admin/spending/index.vue"),
  },
  {
    path: "/admin/report",
    name: "report",
    component: () => import("../view/admin/report/index.vue"),
  },
  //User

  {
    path: "/roomInfo",
    name: "roomInfo",
    component: () => import("../view/user/rooms/roomInfo.vue"),
  },
  //homepage
  {
    path: "/homepage",
    name: "homepage",
    component: () => import("../view/user/homepage/index.vue"),
  },
  //boarding
  {
    path: "/boarding",
    name: "boarding",
    component: () => import("../view/user/Boarding/index.vue"),
  },
  //rooms
  {
    path: "/rooms",
    name: "rooms",
    component: () => import("../view/user/rooms/index.vue"),
  },
  {
    path: "/roomDetail",
    name: "roomDetail",
    component: () => import("../view/user/rooms/roomDetail.vue"),
  },
  //

  {
    path: "/billCustomer",
    name: "billCustomer",
    component: () => import("../view/user/Bill/index.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  // Đây là nơi bạn thực hiện kiểm tra người dùng
  // Ví dụ: kiểm tra xác thực, vai trò, quyền truy cập, ...
  try {
    // console.log(to.name);
    if (to.name == "homepage") {
      if (localStorage.getItem("position") != "user") {
        localStorage.setItem("position", "user");
        console.log(localStorage.getItem("position"));
        // xóa token của admin và super-admin
        localStorage.removeItem("accessToken");
        localStorage.removeItem("position");
        localStorage.removeItem("userName");
        localStorage.removeItem("expiresIn");
        next();
      } else {
        next();
      }
    } else {
      next();
    }
    // if (nguoiDungDaXacThuc) {
    //   // Nếu người dùng đã xác thực, cho phép truy cập
    //   next();
    // } else {
    //   // Nếu người dùng chưa xác thực, điều hướng đến trang đăng nhập
    //   next({ name: "login" });
    // }
  } catch (error) {}
});

export default router;
