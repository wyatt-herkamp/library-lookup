<template>
  <div class="rustArtifactInfo">
    <a v-if="artifact.doc_rs" :href="artifact.doc_rs"> docs.rs</a>
    <div class="codeOption" @click="copy(`#github_${artifact.name}`)">
      <h6>Pull from Github</h6>
      <code :id="`github_${artifact.name}`"
        >{{ artifact.name }} = { git = "{{ artifact.githubURL }}"}</code
      >
    </div>
    <div
      class="codeOption"
      @click="copy(`#cratesIO_${artifact.name}`)"
      v-if="
        artifact.crates_io_location != undefined &&
        artifact.latest_version != undefined
      "
    >
      <h6>Pull from crates.io</h6>
      <code :id="`cratesIO_${artifact.name}`"
        >{{ artifact.name }} = "{{ artifact.latest_version }}"</code
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { RustArtifact } from "library-lookup-core";
const props = defineProps({
  artifact: {
    required: true,
    type: Object as PropType<RustArtifact>,
  },
});
function copy(element: string) {
  const elementInstance = document.querySelector(element);
  if (elementInstance) {
    const text = (elementInstance as HTMLElement).innerText;
    navigator.clipboard.writeText(text);
  } else {
    console.log(`Could not find element ${element}`);
  }
}
</script>

<style scoped lang="scss">
.rustArtifactInfo {
  padding-top: 0;
  margin: 0;
  a {
    margin: 0.5rem 0;
    display: block;
    // Remove Link Underline
    text-decoration: none;
  }
}
.codeOption {
  code {
    display: block;
    margin: 0.5rem 0;
  }
  :hover {
    cursor: pointer;
  }

  h6 {
    margin: 0.5rem 0;
    font-weight: normal;
    font-size: medium;
  }
}
</style>
