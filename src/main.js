import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// vue-router
import router from "./router/router.js";

// axios
import axiosInstance from "./http/index.js";

const app = createApp(App);

// 挂载http
app.config.globalProperties.$http = axiosInstance;

app.use(ElementPlus).use(router).mount("#app");
