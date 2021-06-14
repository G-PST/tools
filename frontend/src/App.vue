<template>
  <Tools />
  <div>
    App Client Version
    <a target="_blank" :href="clientCommitUrl">{{ clientCommitHash }}</a>
  </div>
  <br />
  <div>
    App Server Version
    {{ serverVersion }}
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Tools from "./components/Tools.vue";
import GitHash from "../assets/hash.json";
import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "https://gpst-tools.herokuapp.com/api";
const client = axios.create({
  baseURL: baseURL,
});

export default defineComponent({
  name: "App",
  mounted() {
    client
      .get("/version")
      .then((response) => {
        this.serverVersion = response.data;
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log(error);
      });
  },
  data() {
    return {
      clientCommitHash: GitHash.hash,
      clientCommitUrl: "https://github.com/kdheepak/tools/tree/" + GitHash.hash,
      serverVersion: "",
    };
  },
  components: {
    Tools,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
