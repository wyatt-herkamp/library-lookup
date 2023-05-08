import { RustArtifact } from './languages/rust';

export type Artifact = {
  type: 'rust';
  name: string;
  content: RustArtifact;
};
