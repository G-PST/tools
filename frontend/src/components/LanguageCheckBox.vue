<template>
  <div class="row">
    <div class="col">
      <div class="form-check form-check-inline" v-if="getToolsLoaded">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="allLanguages"
        />
        <label class="form-check-label">
          <a class="all-language-label" target="_blank"> All </a>
        </label>
      </div>
      <div
        class="form-check form-check-inline"
        v-if="getToolsLoaded"
        v-for="language in getLanguages"
        :key="language"
      >
        <input
          class="form-check-input"
          type="checkbox"
          :id="language"
          :value="language"
          v-model="selectedLanguages"
        />
        <label class="form-check-label" :for="language">
          <a class="language-label" target="_blank">
            {{ language }}
          </a>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

export default defineComponent({
  name: "LanguageCheckBox",
  computed: {
    allLanguages: {
      get() {
        return (
          this.getLanguages.length ===
          this.$store.state.tools.selectedLanguages.length
        );
      },
      set(value) {
        if (value) {
          this.setSelectedLanguages(this.getLanguages);
        } else {
          this.setSelectedLanguages([]);
        }
      },
    },
    selectedLanguages: {
      get() {
        return this.$store.state.tools.selectedLanguages;
      },
      set(value) {
        this.setSelectedLanguages(value);
      },
    },
    ...mapGetters("tools", ["getLanguages", "getToolsLoaded"]),
  },
  methods: {
    ...mapMutations("tools", ["setSelectedLanguages"]),
  },
});
</script>
