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

interface ContributionData {
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
      weeks: { contributionDays: { contributionCount: number; date: string }[] }[];
    };
  };
}

interface RepositoryData {
  repositories: {
    nodes: {
      stargazerCount: number;
      languages: { edges: { size: number; node: { color: string | null; name: string } }[] };
    }[];
  };
}

interface UserMetaData {
  followers: { totalCount: number };
  issues: { totalCount: number };
  pullRequests: { totalCount: number };
  contributionsCollection: { restrictedContributionsCount: number; totalCommitContributions: number };
}

interface GraphQLResponse<T> {
  data?: { user: T | null };
  errors?: { message: string }[];
}

async function githubGraphQL<T>(query: string, variables: Record<string, unknown>): Promise<T | null> {
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
    if (!response.ok) throw new Error(`GitHub API error: ${response.statusText}`);
    const data = await response.json() as GraphQLResponse<T>;
    if (data.errors) throw new Error(`GraphQL Error: ${data.errors[0].message}`);
    return data.data?.user ?? null;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('GitHub API request timed out');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchContributions(username: string, year?: number): Promise<ContributionData | null> {

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

  const variables: Record<string, unknown> = { login: username };
  if (year) {
    variables.from = `${year}-01-01T00:00:00Z`;
    variables.to = `${year}-12-31T23:59:59Z`;
  }

  return githubGraphQL(query, variables);
}

export async function fetchRepositories(username: string): Promise<RepositoryData | null> {
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

export async function fetchUserMeta(username: string): Promise<UserMetaData | null> {
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
