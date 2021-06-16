<template>
  <div class="row">
    <div class="col">
      <div class="form-group">
        <input
          ref="input"
          type="search"
          :class="`form-control ${inputClass}`"
          :placeholder="placeholder"
          :aria-label="placeholder"
          @focus="isFocused = true"
          @blur="handleBlur"
          @input="handleInput"
          autocomplete="off"
        />
      </div>
    </div>
  </div>
  <AutocompleteList
    ref="list"
    v-show="isFocused && data.length > 0"
    :query="inputValue"
    :data="formattedData"
    :maxMatches="maxMatches"
    :minMatchingChars="minMatchingChars"
    @hit="handleHit"
  >
    <!-- pass down all scoped slots -->
    <template
      v-for="(slot, slotName) in $scopedSlots"
      :slot="slotName"
      slot-scope="{ data, htmlText }"
    >
      <slot :name="slotName" v-bind="{ data, htmlText }"></slot>
    </template>
  </AutocompleteList>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AutocompleteList from "./AutocompleteList.vue";
import { mapMutations } from "vuex";

export default defineComponent({
  name: "Autocomplete",
  components: {
    AutocompleteList,
  },
  props: {
    data: {
      type: Array,
      required: true,
      validator: (d) => d instanceof Array,
    },
    inputClass: {
      type: String,
      default: "",
    },
    inputValue: {
      type: String,
      default: "",
    },
    maxMatches: {
      type: Number,
      default: 10,
    },
    minMatchingChars: {
      type: Number,
      default: 2,
    },
    placeholder: String,
    serializer: {
      type: Function,
      default: (d) => d,
      validator: (d) => d instanceof Function,
    },
  },
  data() {
    return {
      isFocused: false,
    };
  },
  computed: {
    formattedData() {
      if (!(this.data instanceof Array)) {
        return [];
      }
      return this.data.map((d, i) => {
        return {
          id: i,
          data: d,
          text: this.serializer(d),
        };
      });
    },
  },
  methods: {
    handleHit(evt) {
      this.$refs.input.blur();
      this.isFocused = false;
    },
    handleBlur(evt) {
      const tgt = evt.relatedTarget;
      if (tgt && tgt.classList.contains("vbst-item")) {
        return;
      }
      this.isFocused = false;
    },
    handleInput(evt) {
      this.updateSearchQuery(evt.target.value);
    },
    ...mapMutations("tools", ["updateSearchQuery"]),
  },
});
</script>
