import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../view/common/login.vue"),
  },
  {
    path: "/registration",
    name: "Registration",
    component: () => import("../view/common/registration.vue"),
  },
  //Admin
  {
    path: "/admin/account",
    name: "Account",
    component: () => import("../view/admin/account/account.vue"),
  },
  {
    path: "/admin/room",
    name: "Room",
    component: () => import("../view/admin/room/index.vue"),
  },
  //User
  {
    path: "/",
    name: "User",
    component: () => import("../view/user/index.vue"),
  },
  {
    path: "/user/registration",
    name: "User.registration",
    component: () => import("../view/user/user.registration.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
