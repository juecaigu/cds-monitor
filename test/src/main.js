import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/index.js";
import { init } from "@cds-monitor/core";

const app = createApp(App);
app.use(router);
init({
  dsn: "http://localhost:8080/reportData",
  apikey: "cds-monitor",
  silentWhiteScreen: true,
  skeletonProject: true,
  repeatCodeError: true,
  userId: "admin",
});
setTimeout(() => {
  app.mount("#app");
}, 2000);
