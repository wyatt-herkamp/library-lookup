<template>
  <h3>Found Libraries</h3>
  <ul>
    <ArtifactItem
      v-for="artifact in artifacts"
      :artifact="artifact"
      :key="artifact.name"
    />
  </ul>
</template>
<script setup lang="ts">
import { defineProps, PropType, watch } from "vue";
import { Artifact } from "library-lookup-core";
import ArtifactItem from "./ArtifactItem.vue";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  artifacts: {
    required: true,
    type: Object as PropType<Array<Artifact>>,
  },
});
</script>
<style scoped lang="scss">
h3 {
  margin: 1rem 1rem;
}
ul {
  list-style: none;
  padding: 0;
  margin: 1rem 1rem;
}
</style>
