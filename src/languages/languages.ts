import {
  File,
  getFiles,
  getLanguages,
  Repository,
  searchFiles,
} from '../github';
import { Settings } from '../settings';
import { Artifact } from '../artifact';
import { get_artifacts as get_rust_files, RustArtifact } from './rust';

export async function checkForArtifacts(
  repository: Repository,
  settings: Settings
): Promise<Artifact[]> {
  let results: Artifact[] = [];
  let languages = await getLanguages(repository.full_name);
  for (let language of languages) {
    if (language == 'Rust') {
      let files: File[] = [];
      console.log('Searching for Cargo.toml');

      if (settings.GITHUB_TOKEN != undefined && settings.GITHUB_TOKEN != '') {
        console.log('Using Search API');
        let file = (
          await searchFiles(
            repository.full_name,
            'Cargo.toml',
            settings.GITHUB_TOKEN
          )
        ).items;
        for (let possibleFile of file) {
          let file: File = await fetch(possibleFile.url, {
            headers: {
              Authorization: `Bearer ${settings.GITHUB_TOKEN}`,
            },
          }).then((value) => value.json());
          files.push(file);
        }
      } else {
        let possibleFiles = await getFiles(repository.full_name);
        for (let possibleFile of possibleFiles) {
          if (possibleFile.name == 'Cargo.toml') {
            files.push(possibleFile);
          }
        }
      }
      console.log(files);

      (
        await get_rust_files(files, repository, settings.RUST_SEARCH_CRATES)
      ).forEach((artifact) => {
        results.push({
          type: 'rust',
          content: artifact,
        });
      });
    }
  }
  return results;
}
