<template>
  <div class="list-group shadow">
    <AutocompleteListItem
      v-for="(item, id) in matchedItems"
      :key="id"
      :data="item.data"
      :html-text="highlight(item.text)"
      @click.native="handleHit(item, $event)"
    >
      <template
        v-if="$scopedSlots.suggestion"
        slot="suggestion"
        slot-scope="{ data, htmlText }"
      >
        <slot name="suggestion" v-bind="{ data, htmlText }" />
      </template>
    </AutocompleteListItem>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AutocompleteListItem from "./AutocompleteListItem.vue";

function sanitize(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default defineComponent({
  name: "AutocompleteList",
  components: {
    AutocompleteListItem,
  },
  props: {
    data: {
      type: Array,
      required: true,
      validator: (d) => d instanceof Array,
    },
    query: {
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
  },
  computed: {
    highlight() {
      return (text) => {
        text = sanitize(text);
        if (this.query.length === 0) {
          return text;
        }
        const re = new RegExp(this.escapedQuery, "gi");
        return text.replace(re, `<strong>$&</strong>`);
      };
    },
    escapedQuery() {
      return escapeRegExp(sanitize(this.query));
    },
    matchedItems() {
      if (
        this.query.length === 0 ||
        this.query.length < this.minMatchingChars
      ) {
        return [];
      }
      const re = new RegExp(this.escapedQuery, "gi");
      // Filter, sort, and concat
      return this.data
        .filter((i) => i.text.match(re) !== null)
        .sort((a, b) => {
          const aIndex = a.text.indexOf(a.text.match(re)[0]);
          const bIndex = b.text.indexOf(b.text.match(re)[0]);
          if (aIndex < bIndex) {
            return -1;
          }
          if (aIndex > bIndex) {
            return 1;
          }
          return 0;
        })
        .slice(0, this.maxMatches);
    },
  },
  methods: {
    handleHit(item, evt) {
      this.$emit("hit", item);
      evt.preventDefault();
    },
  },
});
</script>
