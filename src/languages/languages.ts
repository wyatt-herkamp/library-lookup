import { getLanguages, Repository } from '../github';
import { Settings } from '../settings';
import { Artifact } from '../artifact';
import { searchRepository } from './rust';

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
    if (language == 'Rust') {
      await searchRepository(repository, settings).then((value) => {
        value.forEach((artifact) => {
          results.push({
            type: 'rust',
            content: artifact,
          });
        });
      });
    }
  }
  return results;
}
