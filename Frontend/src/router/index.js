import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/simple",
    name: "simple",
    component: () => import("../view/user/simple.vue"),
  },
  {
    path: "/prime",
    name: "prime",
    component: () => import("../view/user/prime.vue"),
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
    path: "/superadmin/account",
    name: "account",
    component: () => import("../view/superadmin/account/index.vue"),
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
    path: "/admin/water",
    name: "water",
    component: () => import("../view/admin/water/index.vue"),
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
  // {
  //   path: "/",
  //   name: "user",
  //   component: () => import("../view/user/index.vue"),
  // },
  // userInfo
  {
    path: "/roomInfo",
    name: "roomInfo",
    component: () => import("../view/user/roomInfo.vue"),
  },
  //homepage
  {
    path: "/homepage",
    name: "homepage",
    component: () => import("../view/user/homepage/index.vue"),
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
    path: "/post",
    name: "post",
    component: () => import("../view/user/post.vue"),
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("../view/user/contact.vue"),
  },
  {
    path: "/billCustomer",
    name: "billCustomer",
    component: () => import("../view/user/Bill/index.vue"),
  },
];

// router.beforeEach((to, from, next) => {
//   // Đây là nơi bạn thực hiện kiểm tra người dùng
//   // Ví dụ: kiểm tra xác thực, vai trò, quyền truy cập, ...
//   try {

//     if (nguoiDungDaXacThuc) {
//     // Nếu người dùng đã xác thực, cho phép truy cập
//     next()
//   } else {
//     // Nếu người dùng chưa xác thực, điều hướng đến trang đăng nhập
//     next({name:'login'})
//   }
//   } catch (error) {

//   }

// })

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
