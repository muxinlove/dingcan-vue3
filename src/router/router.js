import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("@/pages/Home.vue") },
  { path: "/home", component: () => import("@/pages/Home.vue") },
  { path: "/login", component: () => import("@/pages/Login.vue") },
  { path: "/addNewAddr", component: () => import("@/pages/AddNewAddr.vue") },
  { path: "/addrManage", component: () => import("@/pages/AddrManage.vue") },
  {
    path: "/chooseCoordinate",
    component: () => import("@/pages/ChooseCoordinate.vue"),
  },
  { path: "/feedback", component: () => import("@/pages/Feedback.vue") },
  {
    path: "/locationAddr",
    component: () => import("@/pages/LocationAddr.vue"),
  },
  {
    path: "/orderConfirm",
    component: () => import("@/pages/OrderConfirm.vue"),
  },
  {
    path: "/orderDetail",
    component: () => import("@/pages/OrderDetail.vue"),
  },
  {
    path: "/orderList",
    component: () => import("@/pages/OrderList.vue"),
  },
  {
    path: "/personalCenter",
    component: () => import("@/pages/PersonalCenter.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
