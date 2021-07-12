import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-table/dist/bootstrap-table.min.css";
import "bootstrap-table/dist/bootstrap-table.min.js";
import "bootstrap-table/dist/extensions/multiple-sort/bootstrap-table-multiple-sort.js";
import "jquery/dist/jquery.min.js";
import "@fortawesome/fontawesome-free/css/all.css";

import jQuery from "jquery";
import $ from "jquery";
window.jQuery = jQuery;
window.$ = jQuery;

import "bootstrap-table/dist/bootstrap-table";
import BootstrapTable from "./bootstrap-table-vue.js";
import "bootstrap-table/dist/extensions/export/bootstrap-table-export";
import "d3-scale-chromatic";

import { createApp } from "vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faUserSecret);

// router
import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./components/Home.vue";
import About from "./components/About.vue";
import Submit from "./components/Submit.vue";
import Tool from "./components/Tool.vue";
import TemporalSpacialPlot from "./components/TemporalSpacialPlot.vue";
import Sunburst from "./components/Sunburst.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/About", component: About },
  { path: "/Submit", component: Submit },
  {
    path: "/Tool/:number(\\d+)",
    component: Tool,
    props: (route) => ({ query: route.query.q }),
  },
  { path: "/Viz/SpaceTime", component: TemporalSpacialPlot },
  { path: "/Viz/Sunburst", component: Sunburst },
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
