export interface LocaleStrings {
  totalContributions: string;
  currentStreak: string;
  longestStreak: string;
  days: string;
  title: string;
}

export const locales: Record<string, LocaleStrings> = {
  en: {
    totalContributions: 'Total Contributions',
    currentStreak: 'Current Streak',
    longestStreak: 'Longest Streak',
    days: 'Days',
    title: "{username}'s GitHub Streak",
  },
  es: {
    totalContributions: 'Contribuciones Totales',
    currentStreak: 'Racha Actual',
    longestStreak: 'Racha Más Larga',
    days: 'Días',
    title: 'Racha de GitHub de {username}',
  },
  fr: {
    totalContributions: 'Contributions Totales',
    currentStreak: 'Série Actuelle',
    longestStreak: 'Plus Longue Série',
    days: 'Jours',
    title: 'Série GitHub de {username}',
  },
  de: {
    totalContributions: 'Gesamte Beiträge',
    currentStreak: 'Aktuelle Serie',
    longestStreak: 'Längste Serie',
    days: 'Tage',
    title: "{username}'s GitHub Serie",
  },
  ja: {
    totalContributions: '総コントリビューション',
    currentStreak: '現在のストリーク',
    longestStreak: '最長ストリーク',
    days: '日',
    title: '{username} の GitHub ストリーク',
  },
};

export function getLocale(localeCode: string): LocaleStrings {
  return locales[localeCode] || locales['en'];
}
