<template>
  <div class="row">
    <div class="col">
      <h1>Submit your software for consideration</h1>
    </div>
  </div>

  <form class="row">
    <div class="input-group mb-3">
      <span class="input-group-text">Name</span>
      <input
        :value="currentTool.name"
        id="name"
        type="text"
        class="form-control"
        placeholder=""
        aria-label="Name"
      />
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text">Summary</span>
      <input
        :value="currentTool.short_description"
        id="short_description"
        type="text"
        class="form-control"
        placeholder=""
        aria-label="Short Description"
      />
    </div>
    <div class="input-group mb-3">
      <span class="input-group-text">Description</span>
      <textarea
        :value="currentTool.description"
        id="description"
        rows="5"
        type="text"
        class="form-control"
        placeholder=""
        aria-label="Description"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { mapState, mapGetters, mapActions } from "vuex";

export default defineComponent({
  name: "SubmitTool",
  data() {
    return {
      currentTool: {
        name: "",
        short_description: "",
        description: "",
        email: "",
      },
    };
  },
});
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
