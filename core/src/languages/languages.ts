import { getLanguages, Repository } from "../github/githubAPI";

import { searchRepository } from "./rust";
import { Settings } from "../settings";
import { Artifact } from "../artifact";

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
      await searchRepository(repository, settings).then((value) => {
        value.forEach((artifact) => {
          results.push({
            type: "rust",
            name: artifact.name,
            content: artifact,
          });
        });
      });
    }
  }
  return results;
}
