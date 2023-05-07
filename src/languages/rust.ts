import {
  File,
  getFiles,
  github_headers,
  Repository,
  searchFiles,
} from '../github';
import { toml } from '../requires';
import { Settings } from '../settings';
export interface RustArtifact {
  name: string;
  crates_io_location: string | undefined;
  doc_rs: string | undefined;
  latest_version: string | undefined;
}
interface Crate {
  crate: InnerCrate;
}
interface InnerCrate {
  version: string;
}
export async function searchRepository(
  repository: Repository,
  settings: Settings
) {
  let files: File[] = [];
  console.log('Searching for Cargo.toml');

  if (settings.GITHUB_TOKEN != '') {
    console.log('Using Search API');
    const searchResponse = await searchFiles(
      repository.full_name,
      'Cargo.toml',
      settings.GITHUB_TOKEN
    );
    if (searchResponse.total_count == 0) {
      console.debug("Didn't find any Cargo.toml files, using getFiles");
      list_cargo_files(repository).then((value) => {
        files = value;
      });
    } else {
      console.debug(
        `Found ${searchResponse.total_count} Cargo.toml files using search API`
      );
      for (const possibleFile of searchResponse.items) {
        const file: File = await fetch(possibleFile.url, {
          headers: github_headers(settings.GITHUB_TOKEN),
        }).then((value) => value.json());
        files.push(file);
      }
    }
  } else {
    list_cargo_files(repository).then((value) => {
      files = value;
    });
  }
  if (files.length == 0) {
    console.error('No Cargo.toml files found');
    return [];
  } else {
    console.debug(`Found ${files.length} Cargo.toml files`);
    console.debug(files);
  }

  return get_artifacts(files, repository, settings.RUST_SEARCH_CRATES);
}
export async function list_cargo_files(repository: Repository) {
  const files: File[] = [];
  const possibleFiles = await getFiles(repository.full_name);
  if (possibleFiles == undefined || possibleFiles.length == 0) {
    console.error('No files found');
    return files;
  }
  for (const possibleFile of possibleFiles) {
    if (possibleFile.name == 'Cargo.toml') {
      files.push(possibleFile);
    }
  }

  return files;
}
export async function attempt_to_get_artifact(
  crate: string,
  lookup: boolean
): Promise<RustArtifact> {
  let crate_response: Crate | undefined = undefined;
  let found = false;
  if (lookup) {
    try {
      crate_response = await fetch(`https://crates.io/api/v1/crates/${crate}`)
        .then((value) => {
          if (value.status == 200) {
            found = true;
            return value.json();
          } else {
            return undefined;
          }
        })
        .catch(() => undefined);
    } catch (e: unknown) {
      console.error(e);
      /* empty */
    }
  }
  console.debug(`Found ${crate}`);

  if (found && crate_response != undefined) {
    return {
      name: crate,
      crates_io_location: `https://crates.io/crates/${crate}`,
      doc_rs: `https://docs.rs/${crate}/latest/${crate}/`,
      latest_version: crate_response.crate.version,
    };
  }
  return {
    name: crate,
    crates_io_location: undefined,
    doc_rs: undefined,
    latest_version: undefined,
  };
}

export async function get_artifacts(
  files: File[],
  repository: Repository,
  lookup: boolean
): Promise<RustArtifact[]> {
  const artifacts: RustArtifact[] = [];
  console.info(
    'You can ignore the 404 errors below. It just means that the crate is not on crates.io'
  );
  for (const file of files) {
    try {
      const content_raw = await fetch(file.download_url).then((response) =>
        response.text()
      );

      try {
        const content: {
          package:
            | {
                name: string;
              }
            | undefined;
          workspace: unknown | undefined;
        } = toml.parse(content_raw);

        if (content.package != undefined) {
          artifacts.push(
            await attempt_to_get_artifact(content.package.name, lookup)
          );
        }
      } catch (e) {
        console.error(`Failed to parse ${file.url}`);
        console.error(e);
      }
    } catch (e) {
      /* empty */
    }
  }
  return artifacts;
}
