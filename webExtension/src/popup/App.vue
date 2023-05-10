<template>
  <div id="container">
    <ul>
      <ArtifactItem
        v-for="artifact in libraries"
        :artifact="artifact"
        :key="artifact.name"
      ></ArtifactItem>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { Artifact } from 'library-lookup-core';
import ArtifactItem from 'library-lookup-core/src/components/ArtifactItem.vue';

export default defineComponent({
  name: 'App',
  components: { ArtifactItem },
  setup() {
    const libraries: Ref<Artifact[]> = ref([]);
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        const tab = tabs[0];
        if (tab.id != undefined) {
          chrome.tabs.sendMessage(
            tab.id,
            { from: 'popup', subject: 'getLibraries' },
            (response) => {
              if (response != undefined) {
                libraries.value = response;
              }
            }
          );
        }
      }
    );
    return {
      libraries,
    };
  },
});
</script>
<style lang="scss" scoped>
#container {
  background-color: red;
}
</style>
