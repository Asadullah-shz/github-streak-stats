export interface Theme {
  bg_color: string;
  text_color: string;
  title_color: string;
  border_color: string;
  ring_color: string;
  fire_color: string;
  currStreakNum_color: string;
  sideNums_color: string;
  currStreakLabel_color: string;
  sideLabels_color: string;
  dates_color: string;
}

const defaultTheme: Theme = {
  bg_color: 'FFFEFE',
  text_color: '434D58',
  title_color: '151515',
  border_color: 'E4E2E2',
  ring_color: 'FB8C00',
  fire_color: 'FB8C00',
  currStreakNum_color: '151515',
  sideNums_color: '151515',
  currStreakLabel_color: '151515',
  sideLabels_color: '151515',
  dates_color: '434D58',
};

export const themes: Record<string, Partial<Theme>> = {
  default: defaultTheme,
  dark: {
    bg_color: '151515',
    text_color: '9f9f9f',
    title_color: 'fff',
    border_color: '2e2e2e',
    ring_color: 'FB8C00',
    fire_color: 'FB8C00',
    currStreakNum_color: 'fefefe',
    sideNums_color: 'fefefe',
    currStreakLabel_color: 'fefefe',
    sideLabels_color: 'fefefe',
    dates_color: '9f9f9f'
  },
  radical: {
    bg_color: '141321',
    title_color: 'fe428e',
    text_color: 'a9fef7',
    border_color: '2e2e2e',
    ring_color: 'f8d847',
    fire_color: 'f8d847',
    currStreakNum_color: 'fe428e',
    sideNums_color: 'fe428e',
    currStreakLabel_color: 'f8d847',
    sideLabels_color: 'f8d847',
    dates_color: 'a9fef7'
  },
  merko: {
    bg_color: '0a0f0b',
    title_color: 'abd200',
    text_color: '68b587',
    border_color: '2e2e2e',
    ring_color: 'b7d364',
    fire_color: 'b7d364',
    currStreakNum_color: 'abd200',
    sideNums_color: 'abd200',
    currStreakLabel_color: 'b7d364',
    sideLabels_color: 'b7d364',
    dates_color: '68b587'
  },
  gruvbox: {
    bg_color: '282828',
    title_color: 'fabd2f',
    text_color: '8ec07c',
    border_color: '454545',
    ring_color: 'fe8019',
    fire_color: 'fe8019',
    currStreakNum_color: 'fabd2f',
    sideNums_color: 'fabd2f',
    currStreakLabel_color: 'fe8019',
    sideLabels_color: 'fe8019',
    dates_color: '8ec07c'
  },
  tokyonight: {
    bg_color: '1a1b26',
    title_color: '70a5fd',
    text_color: '38bdae',
    border_color: '2e2e2e',
    ring_color: 'bf91f3',
    fire_color: 'bf91f3',
    currStreakNum_color: '70a5fd',
    sideNums_color: '70a5fd',
    currStreakLabel_color: 'bf91f3',
    sideLabels_color: 'bf91f3',
    dates_color: '38bdae'
  },
  onedark: {
    bg_color: '282c34',
    title_color: 'e5c07b',
    text_color: 'e06c75',
    border_color: '454545',
    ring_color: '98c379',
    fire_color: '98c379',
    currStreakNum_color: 'e5c07b',
    sideNums_color: 'e5c07b',
    currStreakLabel_color: '98c379',
    sideLabels_color: '98c379',
    dates_color: 'e06c75'
  },
  cobalt: {
    bg_color: '000000',
    title_color: 'e683d9',
    text_color: '0480ef',
    border_color: '2e2e2e',
    ring_color: '75eab6',
    fire_color: '75eab6',
    currStreakNum_color: 'e683d9',
    sideNums_color: 'e683d9',
    currStreakLabel_color: '75eab6',
    sideLabels_color: '75eab6',
    dates_color: '0480ef'
  },
  synthwave: {
    bg_color: '2b213a',
    title_color: 'e2e9ec',
    text_color: 'ef8539',
    border_color: '2e2e2e',
    ring_color: 'e5289e',
    fire_color: 'e5289e',
    currStreakNum_color: 'e2e9ec',
    sideNums_color: 'e2e9ec',
    currStreakLabel_color: 'e5289e',
    sideLabels_color: 'e5289e',
    dates_color: 'ef8539'
  },
  highcontrast: {
    bg_color: '000000',
    title_color: 'e7f216',
    text_color: 'ffffff',
    border_color: '555555',
    ring_color: '00ffff',
    fire_color: '00ffff',
    currStreakNum_color: 'e7f216',
    sideNums_color: 'e7f216',
    currStreakLabel_color: '00ffff',
    sideLabels_color: '00ffff',
    dates_color: 'ffffff'
  },
  dracula: {
    bg_color: '282a36',
    title_color: 'ff79c6',
    text_color: 'f8f8f2',
    border_color: '44475a',
    ring_color: 'bd93f9',
    fire_color: 'bd93f9',
    currStreakNum_color: 'ff79c6',
    sideNums_color: 'ff79c6',
    currStreakLabel_color: 'bd93f9',
    sideLabels_color: 'bd93f9',
    dates_color: 'f8f8f2'
  },
  prussian: {
    bg_color: '172f45',
    title_color: 'bddfff',
    text_color: '38a0ff',
    border_color: '2e2e2e',
    ring_color: '6e93b5',
    fire_color: '6e93b5',
    currStreakNum_color: 'bddfff',
    sideNums_color: 'bddfff',
    currStreakLabel_color: '6e93b5',
    sideLabels_color: '6e93b5',
    dates_color: '38a0ff'
  },
  monokai: {
    bg_color: '272822',
    title_color: 'eb1f6a',
    text_color: 'f8f8f2',
    border_color: '2e2e2e',
    ring_color: 'e28905',
    fire_color: 'e28905',
    currStreakNum_color: 'eb1f6a',
    sideNums_color: 'eb1f6a',
    currStreakLabel_color: 'e28905',
    sideLabels_color: 'e28905',
    dates_color: 'f8f8f2'
  },
  vue: {
    bg_color: 'fffefe',
    title_color: '41b883',
    text_color: '273849',
    border_color: 'e4e2e2',
    ring_color: '41b883',
    fire_color: '41b883',
    currStreakNum_color: '41b883',
    sideNums_color: '41b883',
    currStreakLabel_color: '41b883',
    sideLabels_color: '41b883',
    dates_color: '273849'
  },
  'vue-dark': {
    bg_color: '273849',
    title_color: '41b883',
    text_color: 'fffefe',
    border_color: '2e2e2e',
    ring_color: '41b883',
    fire_color: '41b883',
    currStreakNum_color: '41b883',
    sideNums_color: '41b883',
    currStreakLabel_color: '41b883',
    sideLabels_color: '41b883',
    dates_color: 'fffefe'
  },
  shades: {
    bg_color: '0d1117',
    title_color: '58a6ff',
    text_color: 'c9d1d9',
    border_color: '30363d',
    ring_color: '3fb950',
    fire_color: '3fb950',
    currStreakNum_color: '58a6ff',
    sideNums_color: '58a6ff',
    currStreakLabel_color: '3fb950',
    sideLabels_color: '3fb950',
    dates_color: 'c9d1d9'
  },
  outrun: {
    bg_color: '141439',
    title_color: 'ff00ff',
    text_color: '00ffff',
    border_color: '2e2e2e',
    ring_color: 'ff00ff',
    fire_color: 'ff00ff',
    currStreakNum_color: 'ff00ff',
    sideNums_color: 'ff00ff',
    currStreakLabel_color: 'ff00ff',
    sideLabels_color: 'ff00ff',
    dates_color: '00ffff'
  },
  cyberpunk: {
    bg_color: 'fcee0a',
    title_color: '000000',
    text_color: '000000',
    border_color: '000000',
    ring_color: '00ffff',
    fire_color: '00ffff',
    currStreakNum_color: '000000',
    sideNums_color: '000000',
    currStreakLabel_color: '000000',
    sideLabels_color: '000000',
    dates_color: '000000'
  }
};

export function getTheme(themeName: string): Theme {
  const selectedTheme = themes[themeName] || themes.default;
  return { ...defaultTheme, ...selectedTheme };
}
