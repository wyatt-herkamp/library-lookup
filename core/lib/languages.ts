import { getLanguages, Repository } from "./github/githubAPI";

import { RustArtifact } from "./rust";
import { Settings } from "./settings";
import { Artifact } from "./artifact";

export async function checkForArtifacts(
  repository: Repository,
  settings: Settings
): Promise<Artifact[]> {
  const results: Array<Artifact> = [];
  const languages = await getLanguages(
    repository.full_name,
    settings.GITHUB_TOKEN
  );
  for (const language of languages) {
    if (language == "Rust") {
      await RustArtifact.searchRepository(repository, settings).then(
        (value) => {
          value.forEach((artifact) => {
            results.push(artifact);
          });
        }
      );
    }
  }
  return results;
}
