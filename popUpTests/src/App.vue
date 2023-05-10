<template>
  <ul>
    <ArtifactItem
      v-for="artifact in artifacts"
      :artifact="artifact"
      :key="artifact.name"
    />
  </ul>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { ArtifactItem, Artifact } from 'library-lookup-core';

export default defineComponent({
  name: 'App',
  components: { ArtifactItem },
  setup() {
    const artifacts: Artifact[] = [
      {
        type: 'rust',
        name: 'artifact1',
        content: {
          name: 'artifact1',
          crates_io_location: undefined,
          doc_rs: undefined,
          latest_version: undefined,
        },
      } as Artifact,
    ];

    return {
      artifacts,
    };
  },
});
</script>
<style lang="scss" scoped>
#content {
}
</style>
