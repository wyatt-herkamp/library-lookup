import { createApp } from 'vue';
import App from './App.vue';
import { Artifact } from '@/artifact';
const librariesList = document.getElementById('artifacts') as HTMLUListElement;
function handleLibraries(artifacts: Artifact[]) {
  console.log(artifacts);
  for (const library of artifacts) {
    const libraryElement = document.createElement('li');
    libraryElement.innerText = library.content.name;
    librariesList.appendChild(libraryElement);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  createApp(App) // prettier-ignore
    .mount('#app');
});
