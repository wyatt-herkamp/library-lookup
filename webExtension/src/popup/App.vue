<template>
  <div id="container">
    <Artifacts v-show="libraries.length != 0" :artifacts="libraries" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { Artifact } from 'library-lookup-core';
import Artifacts from './Artifacts.vue';

export default defineComponent({
  name: 'App',
  components: { Artifacts },
  created() {},
  setup() {
    const libraries: Ref<Array<Artifact>> = ref([]);
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
              console.log(response);
              if (response != undefined) {
                for (const library of response) {
                  libraries.value.push(library);
                }
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
<style lang="scss" scoped></style>
