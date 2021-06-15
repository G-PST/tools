import "bootstrap/dist/css/bootstrap.css";
import "datatables/media/js/jquery.dataTables";
import "datatables/media/js/jquery.dataTables.min";
import "datatables/media/css/jquery.dataTables.min.css";
import "jquery/dist/jquery.min.js";

import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

import App from "./App.vue";
import Home from "./components/Home.vue";
import About from "./components/About.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/About", component: About },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);
app.use(router);

app.mount("#app");
