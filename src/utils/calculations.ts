interface ContributionDay {
  contributionCount: number;
  date: string;
}

export function calculateStats(weeks: { contributionDays: ContributionDay[] }[]) {
  const allDays = weeks.flatMap((week) => week.contributionDays);

  let longestStreak = 0;
  let totalContributions = 0;
  let tempStreak = 0;
  let tempStreakStart = '';
  let longestStreakStart = '';
  let longestStreakEnd = '';

  for (let i = 0; i < allDays.length; i++) {
    const day = allDays[i];
    totalContributions += day.contributionCount;

    if (day.contributionCount > 0) {
      if (tempStreak === 0) tempStreakStart = day.date;
      tempStreak++;
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
        longestStreakStart = tempStreakStart;
        longestStreakEnd = allDays[i - 1].date;
      }
      tempStreak = 0;
    }
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
    longestStreakStart = tempStreakStart;
    longestStreakEnd = allDays[allDays.length - 1].date;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let startIndex = allDays.length - 1;
  for (let i = allDays.length - 1; i >= 0; i--) {
    const dayDate = new Date(allDays[i].date);
    dayDate.setHours(0, 0, 0, 0);
    if (dayDate <= today) {
      startIndex = i;
      break;
    }
  }

  let currentStreak = 0;
  let currentStreakStart = '';
  let currentStreakEnd = '';

  if (allDays[startIndex] && allDays[startIndex].contributionCount > 0) {
    currentStreakEnd = allDays[startIndex].date;
    currentStreakStart = currentStreakEnd;
    currentStreak = 1;
    for (let i = startIndex - 1; i >= 0; i--) {
      if (allDays[i].contributionCount > 0) {
        currentStreak++;
        currentStreakStart = allDays[i].date;
      } else break;
    }
  } else if (startIndex - 1 >= 0 && allDays[startIndex - 1].contributionCount > 0) {
    currentStreakEnd = allDays[startIndex - 1].date;
    currentStreakStart = currentStreakEnd;
    currentStreak = 1;
    for (let i = startIndex - 2; i >= 0; i--) {
      if (allDays[i].contributionCount > 0) {
        currentStreak++;
        currentStreakStart = allDays[i].date;
      } else break;
    }
  }

  const format = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  };

  return {
    totalContributions,
    totalDateRange: `${format(allDays[0]?.date)} - ${format(allDays[startIndex]?.date)}`,
    currentStreak,
    currentStreakRange: currentStreak > 0 ? `${format(currentStreakStart)} - ${format(currentStreakEnd)}` : 'No current streak',
    longestStreak,
    longestStreakRange: longestStreak > 0 ? `${format(longestStreakStart)} - ${format(longestStreakEnd)}` : 'No streaks found',
  };
}

interface LanguageUserData {
  repositories: {
    nodes: {
      languages: { edges: { size: number; node: { name: string; color: string | null } }[] };
    }[];
  };
}

export function processLanguageStats(userData: LanguageUserData, excludeLangs: string[] = []) {
  const languageMap = new Map<string, { size: number; color: string }>();
  let totalSize = 0;
  
  const excludes = excludeLangs.map(l => l.toLowerCase().trim());

  const repos = userData.repositories.nodes;
  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      const name = edge.node.name;
      if (excludes.includes(name.toLowerCase())) continue;
      
      const color = edge.node.color || '#cccccc';
      const size = edge.size;
      
      if (!languageMap.has(name)) {
        languageMap.set(name, { size: 0, color });
      }
      languageMap.get(name)!.size += size;
      totalSize += size;
    }
  }

  const topLanguages = Array.from(languageMap.entries())
    .map(([name, data]) => ({
      name,
      color: data.color,
      size: data.size,
      percent: (data.size / totalSize) * 100,
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 5);

  return topLanguages;
}

interface RankUserData {
  followers: { totalCount: number };
  issues: { totalCount: number };
  pullRequests: { totalCount: number };
  contributionsCollection: { totalCommitContributions: number; restrictedContributionsCount: number };
  repositories: { nodes: { stargazerCount: number }[] };
}

export function calculateRank(userData: RankUserData) {
  const followers = userData.followers.totalCount;
  const issues = userData.issues.totalCount;
  const pullRequests = userData.pullRequests.totalCount;
  const commits = userData.contributionsCollection.totalCommitContributions + userData.contributionsCollection.restrictedContributionsCount;
  
  const stars = userData.repositories.nodes.reduce((acc, repo) => acc + repo.stargazerCount, 0);

  const score = (stars * 100) + (commits * 1) + (pullRequests * 50) + (issues * 50) + (followers * 20);

  let rank = 'C';
  let percentile = 0;

  if (score >= 20000) { rank = 'S+'; percentile = 1; }
  else if (score >= 5000) { rank = 'S'; percentile = 5; }
  else if (score >= 2000) { rank = 'A'; percentile = 15; }
  else if (score >= 500) { rank = 'B'; percentile = 35; }
  else { rank = 'C'; percentile = 60; }

  return {
    rank,
    percentile,
    stars,
    commits,
    pullRequests,
    issues,
    followers,
    score
  };
}
