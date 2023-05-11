export abstract class Artifact {
  public type: string;
  public name: string;
  public githubURL: string;

  constructor(type: string, name: string, githubURL: string) {
    this.type = type;
    this.name = name;
    this.githubURL = githubURL;
  }
}
