import '../styles/options.scss';
import { Settings } from './settings';

const RUST_SEARCH_CRATES = document.getElementById(
  'RUST_SEARCH_CRATES'
) as HTMLInputElement;
const GITHUB_TOKEN = document.getElementById(
  'GITHUB_TOKEN'
) as HTMLInputElement;
function getSettings() {
  chrome.storage.sync.get(
    {
      GITHUB_TOKEN: '',
      RUST_SEARCH_CRATES: true,
    },
    (items: unknown) => {
      const settings = items as Settings;
      RUST_SEARCH_CRATES.checked = settings.RUST_SEARCH_CRATES;
      GITHUB_TOKEN.value = settings.GITHUB_TOKEN;
    }
  );
}
function saveSettings() {
  const settings: Settings = {
    GITHUB_TOKEN: GITHUB_TOKEN.value,
    RUST_SEARCH_CRATES: RUST_SEARCH_CRATES.checked,
  };
  chrome.storage.sync.set(settings, () => {
    alert('Settings Saved');
  });
  console.log('Settings Saved');
}
document.addEventListener('DOMContentLoaded', () => {
  getSettings();
});
(document.getElementById('save') as HTMLButtonElement).onclick = saveSettings;
await getSettings();
