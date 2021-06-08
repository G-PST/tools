<template>
  <div class="row">
    <div class="col">
      <div class="form-group">
        <input
          ref="input"
          v-model="value"
          type="search"
          :class="`form-control ${inputClass}`"
          :placeholder="placeholder"
          :aria-label="placeholder"
          @focus="isFocused = true"
          @blur="handleBlur"
          @input="handleInput($event.target.value)"
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
    modelValue: {
      type: String,
    },
    inputClass: {
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
  emits: ["update:modelValue"],
  data() {
    return {
      isFocused: false,
      inputValue: "",
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
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
        this.inputValue = value;
      },
    },
  },
  methods: {
    handleHit(evt) {
      if (typeof this.value !== "undefined") {
        this.$emit("input", evt.text);
      }
      this.inputValue = evt.text;
      this.$emit("hit", evt.data);
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
    handleInput(newValue) {
      this.inputValue = newValue;
      // If v-model is being used, emit an input event
      if (typeof this.value !== "undefined") {
        this.$emit("input", newValue);
      }
    },
  },
});
</script>
