<template>
  <li>
    <div class="iconAndName">
      <RustIcon v-if="artifact.type == 'Rust'" />
      <span>{{ artifact.name }}</span>
    </div>
    <RustArtifactInfo v-if="artifact.type == 'Rust'" :artifact="artifact" />
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Artifact } from 'library-lookup-core';
import { RustIcon } from 'vue3-simple-icons';
import RustArtifactInfo from './RustArtifactInfo.vue';
export default defineComponent({
  name: 'ArtifactItem',
  components: { RustArtifactInfo, RustIcon },
  props: {
    artifact: {
      required: true,
      type: Object as PropType<Artifact>,
    },
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
.iconAndName {
  display: flex;
  align-items: center;
  padding-bottom: 3px;
  span {
    margin-left: 0.5rem;
  }
  :hover {
    cursor: pointer;
  }
  border-bottom: black 0.5px solid;
}
</style>
