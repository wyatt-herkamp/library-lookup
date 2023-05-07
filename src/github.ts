export interface Repository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: Date;
  updated_at: Date;
  pushed_at: Date;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  mirror_url: null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  temp_clone_token: null;
  network_count: number;
  subscribers_count: number;
}
export interface File {
  name: string;
  path: string | undefined;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: Links;
}

export interface Links {
  self: string;
  git: string;
  html: string;
}
export interface SearchFile {
  name: string;
  path: string;
  sha: string;
  url: string;
  git_url: string;
  html_url: string;
  repository: Repository;
  score: number;
}
export interface SearchFiles {
  total_count: number;
  incomplete_results: boolean;
  items: SearchFile[];
}
export function github_headers(token: string): HeadersInit {
  // Get Current User Agent
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': `${navigator.userAgent} (github.com/wyatt-herkamp/library-checker)`,
  };
  if (token != '') {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}
export async function getRepository(
  owner: string,
  repo: string,
  token = ''
): Promise<Repository> {
  return fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: github_headers(token),
  }).then((response) => response.json());
}
export async function getFiles(
  fullName: string,
  path = '',
  token = ''
): Promise<File[]> {
  return fetch(`https://api.github.com/repos/${fullName}/contents/${path}`, {
    headers: github_headers(token),
  }).then((response) => response.json());
}
export async function getLanguages(
  fullName: string,
  token = ''
): Promise<string[]> {
  const languages: Map<string, number> = await fetch(
    `https://api.github.com/repos/${fullName}/languages`,
    {
      headers: github_headers(token),
    }
  ).then((response) => response.json());
  return Array.from(Object.keys(languages));
}

export async function searchFiles(
  fullName: string,
  name: string,
  token: string
): Promise<SearchFiles> {
  //https://api.github.com/search/code?q=repo:wyatt-herkamp/workforce-utils+in:path+Cargo.toml
  return fetch(
    `https://api.github.com/search/code?q=repo:${fullName}+in:path+${name}`,
    {
      headers: github_headers(token),
    }
  ).then((response) => response.json());
}
