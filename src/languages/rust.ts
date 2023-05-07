import { File, Repository } from '../github';
import { toml } from '../requires';
export interface RustArtifact {
  name: string;
  crates_io_location: String | undefined;
  doc_rs: String | undefined;
  latest_version: String | undefined;
}
interface Crate {
  crate: InnerCrate;
}
interface InnerCrate {
  version: String;
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
    } catch (e: any) {}
  }

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
  let artifacts: RustArtifact[] = [];
  for (let file of files) {
    try {
      let content_raw = await fetch(file.download_url).then((response) =>
        response.text()
      );

      try {
        let content: {
          package:
            | {
                name: string;
              }
            | undefined;
          workspace: {} | undefined;
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
    } catch (e) {}
  }
  return artifacts;
}
