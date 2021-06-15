<template>
  <footer class="footer mt-auto py-3 bg">
    <div class="container">
      <div>
        App Client Version
        <a target="_blank" :href="clientCommitUrl">{{ clientCommitHash }}</a>
      </div>
      <div>
        App Server Version
        {{ serverVersion }}
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GitHash from "../../assets/hash.json";
import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "https://gpst-tools.herokuapp.com/api";
const client = axios.create({
  baseURL: baseURL,
});

export default defineComponent({
  name: "Footer",
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
});
</script>
