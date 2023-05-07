import { getRepository, Repository } from './github';
import { Artifact } from './artifact';
import { Settings } from './settings';
import { checkForArtifacts } from './languages/languages';

console.log('Content Script Running');

let repository: Repository | null = null;
let foundLibraries: Artifact[] = [];
import '../styles/popup.scss';
let librariesButton = document.createElement('a');
librariesButton.classList.add(
  'UnderlineNav-item',
  'no-wrap',
  'js-responsive-underlinenav-item',
  'v-item',
  'js-selected-navigation-item'
);
librariesButton.innerText = 'Libraries';
librariesButton.onclick = () => {
  // Load popup.html
  let popup = window.open(
    chrome.runtime.getURL('popup.html'),
    'popup',
    'width=400,height=400'
  );
};
function disableButton() {
  librariesButton.onclick = () => {};
  librariesButton.innerText = 'No Libraries Found';
  librariesButton.style.cursor = 'not-allowed';
}
let settings: Settings = await getSettings();
await getOrganizationAndRepository()
  .then((repository) => {
    console.log(repository);
    if (repository != undefined) {
      return checkForArtifacts(repository as Repository, settings);
    } else {
      disableButton();
    }
  })
  .then((results) => {
    if (results != undefined) {
      results.forEach((artifact) => {
        console.log(artifact);
        foundLibraries.push(artifact);
      });
      if (foundLibraries.length == 0) {
        disableButton();
      }
    } else {
      disableButton();
    }
  })
  .catch((reason) => {
    console.error('Most Likely due to permissions');
    console.error(reason);
  });
/**
 * Gets the Organization and Repository from the current page
 *
 * Pulls `octolytics-dimension-repository_nwo` meta tag from the head of the page
 *
 */
async function getOrganizationAndRepository() {
  let querySelector = document.head.querySelector(
    "meta[name='octolytics-dimension-repository_nwo']"
  );
  if (querySelector != null) {
    let content = querySelector.getAttribute('content');
    if (content != null) {
      let split = content.split('/');
      console.log(split);
      return await getRepository(split[0], split[1]);
    }
  } else {
    console.log('Could not Find Owner and Repository');
  }
}

function getRepositoryButtonDiv() {
  let elements = document.body.querySelectorAll(
    "ul[class='UnderlineNav-body list-style-none']"
  );
  if (elements.length == 1) {
    return elements[0] as HTMLDivElement;
  } else if (elements.length > 1) {
    console.warn('Found more than one Repository Button Div');
    return elements[0] as HTMLDivElement;
  } else {
    console.warn('Could not find Repository Button Div');
    return undefined;
  }
}
let buttonDiv = getRepositoryButtonDiv();

if (buttonDiv) {
  buttonDiv.appendChild(librariesButton);
}

async function getSettings() {
  return (await chrome.storage.sync.get({
    GITHUB_TOKEN: '',
    RUST_SEARCH_CRATES: true,
  })) as Settings;
}
