// Round-robin token rotation. Math.random() can, by chance, hammer a single
// token far more than others in a small pool; a rotating index guarantees
// even distribution across all configured tokens.
let tokenIndex = 0;
function getToken(): string {
  const tokens = process.env.GITHUB_TOKEN?.split(',').map(t => t.trim()).filter(Boolean) || [];
  if (tokens.length === 0) {
    throw new Error('GitHub token(s) missing from environment variables');
  }
  const token = tokens[tokenIndex % tokens.length];
  tokenIndex++;
  return token;
}

const GITHUB_API_TIMEOUT_MS = 8000;

// Central GraphQL call used by every fetch* function below. Adds a hard
// timeout so a slow/hanging GitHub API response fails fast into the existing
// error-SVG path instead of the edge function stalling until the platform's
// own timeout kills it — this is what turns an occasional GitHub slowdown
// into a visibly "hung" README image versus a fast, correctly-cached retry
// on the next view.
async function githubGraphQL<T = any>(query: string, variables: Record<string, any>): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GITHUB_API_TIMEOUT_MS);

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL Error: ${data.errors[0].message}`);
    }

    return data.data.user;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('GitHub API request timed out');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchContributions(username: string, year?: number) {
  const query = `
    query($login: String!, $from: DateTime, $to: DateTime) {
      user(login: $login) {
        createdAt
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const variables: any = { login: username };
  if (year) {
    variables.from = `${year}-01-01T00:00:00Z`;
    variables.to = `${year}-12-31T23:59:59Z`;
  }

  return githubGraphQL(query, variables);
}

// Combines what used to be two separate queries — fetchTopLanguages and the
// repository portion of fetchRankData — into one GraphQL call. Both /api/lang
// and /api/rank now read from the same cached result (see lib/redis.ts),
// instead of each independently fetching the same 100 repos from GitHub.
export async function fetchRepositories(username: string) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
          nodes {
            stargazerCount
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  color
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  return githubGraphQL(query, { login: username });
}

// Non-repository fields for /api/rank: followers, issues, PRs, commit counts.
export async function fetchUserMeta(username: string) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        followers {
          totalCount
        }
        issues(first: 1) {
          totalCount
        }
        pullRequests(first: 1) {
          totalCount
        }
        contributionsCollection {
          restrictedContributionsCount
          totalCommitContributions
        }
      }
    }
  `;

  return githubGraphQL(query, { login: username });
}
