import "bootstrap/dist/css/bootstrap.css";
import "datatables/media/js/jquery.dataTables";
import "datatables/media/js/jquery.dataTables.min";
import "datatables/media/css/jquery.dataTables.min.css";
import "jquery/dist/jquery.min.js";

import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

app.mount("#app");
