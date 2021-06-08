<template>
  <Tools />
  <div>
    App Version
    <a target="_blank" :href="commitUrl">{{ commitHash }}</a>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Tools from "./components/Tools.vue";
import GitHash from "../assets/hash.json";

export default defineComponent({
  name: "App",
  data() {
    return {
      commitHash: GitHash.hash,
      commitUrl: "https://github.com/kdheepak/tools/tree/" + GitHash.hash,
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
