import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-table/dist/bootstrap-table.min.css";
import "bootstrap-table/dist/bootstrap-table.min.js";
import "jquery/dist/jquery.min.js";
import "@fortawesome/fontawesome-free/css/all.css";

import jQuery from "jquery";
import $ from "jquery";
window.jQuery = jQuery;
window.$ = jQuery;

import "bootstrap-table/dist/bootstrap-table";
import BootstrapTable from "./bootstrap-table-vue.js";
import "bootstrap-table/dist/extensions/export/bootstrap-table-export";

import { createApp } from "vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faUserSecret);

// router
import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./components/Home.vue";
import About from "./components/About.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/About", component: About },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: "active", // active class for non-exact links.
  linkExactActiveClass: "active", // active class for *exact* links.
});

// store

import store from "./store";

// app

import App from "./App.vue";
const app = createApp(App);
app.use(router);
app.use(store);
app.component("BootstrapTable", BootstrapTable).mount("#app");
