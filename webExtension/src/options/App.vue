<template>
  <div class="container">
    <h1 id="header">Library Lookup Settings</h1>
    <div id="form">
      <div class="setting">
        <label for="RUST_SEARCH_CRATES">Enable Lookup on crates.io</label>
        <input
          type="checkbox"
          id="RUST_SEARCH_CRATES"
          v-model="rustSearchCrates"
        />
      </div>
      <div class="setting">
        <label class="block" for="GITHUB_TOKEN">GITHUB Token</label>
        <input type="text" id="GITHUB_TOKEN" v-model="githubToken" />
      </div>
      <button id="save" v-on:click="saveSettings">Save</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Settings } from 'library-lookup-core';

export default defineComponent({
  name: 'App',
  setup() {
    let githubToken = ref('');
    let rustSearchCrates = ref(true);

    chrome.storage.sync.get(
      {
        GITHUB_TOKEN: '',
        RUST_SEARCH_CRATES: true,
      },
      (items: unknown) => {
        const settings = items as Settings;
        githubToken.value = settings.GITHUB_TOKEN;
        rustSearchCrates.value = settings.RUST_SEARCH_CRATES;
        console.log('Settings Loaded' + JSON.stringify(settings));
      }
    );
    return {
      githubToken,
      rustSearchCrates,
    };
  },
  methods: {
    saveSettings() {
      const settings: Settings = {
        GITHUB_TOKEN: this.githubToken,
        RUST_SEARCH_CRATES: this.rustSearchCrates,
      };
      chrome.storage.sync.set(settings, () => {});
      console.log('Settings Saved' + JSON.stringify(settings));
    },
  },
});
</script>
<style lang="scss" scoped>
#container {
  background-color: red;
}
</style>
