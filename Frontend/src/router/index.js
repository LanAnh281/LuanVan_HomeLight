import { createWebHistory, createRouter } from "vue-router";

const routes = [
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
  //Admin
  {
    path: "/admin/account",
    name: "account",
    component: () => import("../view/admin/account/index.vue"),
  },
  //dashboard
  {
    path: "/admin/dashboard",
    name: "dashboard",
    component: () => import("../view/admin/dashboard/index.vue"),
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
  //User
  {
    path: "/",
    name: "user",
    component: () => import("../view/user/index.vue"),
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
