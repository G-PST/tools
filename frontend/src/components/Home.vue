<template>
  <Tools />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Tools from "./Tools.vue";

export default defineComponent({
  name: "Home",
  components: {
    Tools,
  },
});
</script>
