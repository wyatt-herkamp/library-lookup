import '../styles/popup.scss';
import { Artifact } from './artifact';

const librariesList = document.getElementById('artifacts') as HTMLUListElement;
function handleLibraries(artifacts: Artifact[]) {
  console.log(artifacts);
  for (const library of artifacts) {
    const libraryElement = document.createElement('li');
    libraryElement.innerText = library.content.name;
    librariesList.appendChild(libraryElement);
  }
}
// On Open of Popup send message to background script to get libraries
// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', () => {
  // ...query for the active tab...
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id as number,
        { from: 'popup', subject: 'getLibraries' },
        handleLibraries
      );
    }
  );
});
