export interface GitHubConfig {
  owner: string;
  repo: string;
  token: string;
  branch?: string;
}

export async function fetchFileFromGitHub(
  ghConfig: GitHubConfig,
  filePath: string = "data/settings.json"
) {
  const branch = ghConfig.branch || "main";
  const url = `https://api.github.com/repos/${ghConfig.owner}/${ghConfig.repo}/contents/${filePath}?ref=${branch}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (ghConfig.token) {
    headers.Authorization = `token ${ghConfig.token}`;
  }

  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch file from GitHub (${res.status})`);
  }

  const data = await res.json();
  const decodedContent = decodeURIComponent(
    escape(atob(data.content.replace(/\n/g, "")))
  );
  const parsedContent = JSON.parse(decodedContent);

  return {
    content: parsedContent,
    sha: data.sha,
  };
}

export async function commitFileToGitHub(
  ghConfig: GitHubConfig,
  filePath: string,
  contentObj: any,
  sha?: string,
  commitMessage: string = "Update settings.json via GariGhor Admin Dashboard"
) {
  const branch = ghConfig.branch || "main";

  let targetSha = sha;
  if (!targetSha) {
    try {
      const fetched = await fetchFileFromGitHub(ghConfig, filePath);
      targetSha = fetched.sha;
    } catch (e) {
      // File may be new
    }
  }

  const jsonString = JSON.stringify(contentObj, null, 2);
  const base64Content = btoa(unescape(encodeURIComponent(jsonString)));

  const url = `https://api.github.com/repos/${ghConfig.owner}/${ghConfig.repo}/contents/${filePath}`;

  const body: any = {
    message: commitMessage,
    content: base64Content,
    branch,
  };

  if (targetSha) {
    body.sha = targetSha;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${ghConfig.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `GitHub Commit API Error (${res.status})`);
  }

  return await res.json();
}
