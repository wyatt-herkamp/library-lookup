import {
  File,
  getFiles,
  github_headers,
  Repository,
  searchFiles,
} from "./github/githubAPI";
import toml from "toml";
import { Settings } from "./settings";
import { Artifact } from "./artifact";
interface Crate {
  crate: InnerCrate;
}
interface InnerCrate {
  version: string;
}

async function list_cargo_files(repository: Repository) {
  const files: File[] = [];
  const possibleFiles = await getFiles(repository.full_name);
  if (possibleFiles == undefined || possibleFiles.length == 0) {
    console.error("No files found");
    return files;
  }
  for (const possibleFile of possibleFiles) {
    if (possibleFile.name == "Cargo.toml") {
      files.push(possibleFile);
    }
  }

  return files;
}
export class RustArtifact extends Artifact {
  public crates_io_location?: string;
  public doc_rs?: string;
  public latest_version?: string;

  public constructor(
    name: string,
    githubURL: string,
    crates_io_location?: string,
    doc_rs?: string,
    latest_version?: string
  ) {
    super("Rust", name, githubURL);
    this.crates_io_location = crates_io_location;
    this.doc_rs = doc_rs;
    this.latest_version = latest_version;
  }

  public static async attempt_to_get_artifact(
    githubURL: string,
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
      return new RustArtifact(
        crate,
        `https://crates.io/crates/${crate}`,
        `https://docs.rs/${crate}/${crate_response.crate.version}/${crate}`,
        crate_response.crate.version
      );
    }
    return new RustArtifact(crate, githubURL, undefined, undefined);
  }

  public static async searchRepository(
    repository: Repository,
    settings: Settings
  ) {
    let files: File[] = [];
    console.log("Searching for Cargo.toml");

    if (settings.GITHUB_TOKEN != "") {
      console.log("Using Search API");
      const searchResponse = await searchFiles(
        repository.full_name,
        "Cargo.toml",
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
      await list_cargo_files(repository).then((value) => {
        files = value;
      });
    }
    if (files.length == 0) {
      console.error("No Cargo.toml files found");
      return [];
    } else {
      console.debug(`Found ${files.length} Cargo.toml files`);
      console.debug(files);
    }

    return this.get_artifacts(files, repository, settings.RUST_SEARCH_CRATES);
  }

  public static async get_artifacts(
    files: File[],
    repository: Repository,
    lookup: boolean
  ): Promise<RustArtifact[]> {
    const artifacts: RustArtifact[] = [];
    console.info(
      "You can ignore the 404 errors below. It just means that the crate is not on crates.io"
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
              await RustArtifact.attempt_to_get_artifact(
                repository.html_url,
                content.package.name,
                lookup
              )
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
}
