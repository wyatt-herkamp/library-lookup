<template>
  <div id="container">
    <ul>
      <li v-for="library in libraries" :key="library.name">
        {{ library.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, Ref } from 'vue';
import { Artifact } from '@/artifact';

export default defineComponent({
  name: 'App',
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
