import { RustArtifact } from './languages/rust';

export type Artifact = {
  type: 'rust';
  content: RustArtifact;
};
