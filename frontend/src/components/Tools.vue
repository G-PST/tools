<template>
  <div class="container">
    <div class="row text-center">
      <div class="col">
        <h1>Tools</h1>
      </div>
    </div>

    <br />

    <Autocomplete
      placeholder='Filter tools (e.g. "OpenDSS" or "steady state")'
      :data="[]"
    />

    <LanguageCheckBox />

    <br />

    <ToolsTable />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import Autocomplete from "./Autocomplete.vue";
import LanguageCheckBox from "./LanguageCheckBox.vue";
import ToolsTable from "./ToolsTable.vue";

export default defineComponent({
  name: "Tools",
  components: {
    Autocomplete,
    ToolsTable,
    LanguageCheckBox,
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
