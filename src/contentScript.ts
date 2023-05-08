import { getRepository, Repository } from './github';
import { Artifact } from './artifact';
import { Settings } from './settings';
import { checkForArtifacts } from './languages/languages';
import { disableButton } from './githubButton';

console.log('Content Script Running');
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.from === 'popup' && msg.subject === 'getLibraries') {
    sendResponse(foundLibraries);
  }
});
const foundLibraries: Artifact[] = [];

const settings: Settings = await getSettings();
await getOrganizationAndRepository()
  .then((repository) => {
    if (repository != undefined) {
      return checkForArtifacts(repository as Repository, settings);
    } else {
      disableButton();
    }
  })
  .then((results) => {
    if (results != undefined) {
      results.forEach((artifact) => {
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
 *  Uses https://github.com/refined-github/github-url-detection to check if the current page is a repository
 *
 * Gets the Organization and Repository from the current page
 *
 * Pulls `octolytics-dimension-repository_nwo` meta tag from the head of the page
 */
async function getOrganizationAndRepository() {
  const querySelector = document.head.querySelector(
    "meta[name='octolytics-dimension-repository_nwo']"
  );
  if (querySelector != null) {
    const content = querySelector.getAttribute('content');
    if (content != null) {
      const split = content.split('/');
      return await getRepository(split[0], split[1]);
    }
  } else {
    console.debug('Could not Find Owner and Repository. ');
  }
}

async function getSettings() {
  return (await chrome.storage.sync.get({
    GITHUB_TOKEN: '',
    RUST_SEARCH_CRATES: true,
  })) as Settings;
}
