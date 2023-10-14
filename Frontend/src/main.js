import { createApp } from "vue";
import "./style.css";
import "./assets/style/global.css";
import App from "./App.vue";
import router from "./router";
import VueQrcode from "vue-qrcode";

// Vue.component("qrcode", VueQrcode);
// import PrimeVue from "primevue/config";
const app = createApp(App);
app.use(router);
app.component("qrcode", VueQrcode);
// app.use(PrimeVue);
app.mount("#app");
