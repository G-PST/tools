<template>
  <a
    tabindex="0"
    href="#"
    :class="textClasses"
    @mouseover="active = true"
    @mouseout="active = false"
  >
    <slot name="suggestion" v-bind="{ data: data, htmlText: htmlText }">
      <span v-html="htmlText"></span>
    </slot>
  </a>
</template>

<script lang="ts">
export default {
  name: "AutocompleteListItem",

  props: {
    data: {},
    htmlText: {
      type: String,
    },
  },

  data() {
    return {
      active: false,
    };
  },

  computed: {
    textClasses() {
      let classes = "";
      classes += this.active ? "active" : "";
      return `vbst-item list-group-item list-group-item-action ${classes}`;
    },
  },
};
</script>
