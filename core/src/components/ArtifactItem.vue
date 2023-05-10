<template>
  <li>
    {{ artifact.name }}
  </li>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Artifact } from "../artifact";
export default defineComponent({
  name: "ArtifactItem",
  props: {
    artifact: {
      type: Object as () => Artifact,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
li {
  list-style: none;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
