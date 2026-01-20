import { ThemeConfig, ThemeName } from './types';

export const themes: Record<ThemeName, ThemeConfig> = {
  light: {
    primary: '#007bff',
    primaryDark: '#0056b3',
    primaryLight: '#e7f1ff',
    bgPrimary: '#ffffff',
    bgSecondary: '#f8f9fa',
    textPrimary: '#212529',
    textSecondary: '#6c757d',
    borderRadius: '4px',
    borderWidth: '1px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px',
    shadowSm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    shadowMd: '0 4px 6px rgba(0, 0, 0, 0.1)',
    shadowLg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  dark: {
    primary: '#0d6efd',
    primaryDark: '#0a58ca',
    primaryLight: '#084298',
    bgPrimary: '#1e1e1e',
    bgSecondary: '#2d2d2d',
    textPrimary: '#e0e0e0',
    textSecondary: '#a0a0a0',
    borderRadius: '4px',
    borderWidth: '1px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px',
    shadowSm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    shadowMd: '0 4px 6px rgba(0, 0, 0, 0.4)',
    shadowLg: '0 10px 15px rgba(0, 0, 0, 0.5)',
  },
  minimal: {
    primary: '#000000',
    primaryDark: '#333333',
    primaryLight: '#f0f0f0',
    bgPrimary: '#ffffff',
    bgSecondary: '#f5f5f5',
    textPrimary: '#000000',
    textSecondary: '#666666',
    borderRadius: '0px',
    borderWidth: '1px',
    fontFamily: 'Georgia, serif',
    fontSize: '14px',
    shadowSm: 'none',
    shadowMd: 'none',
    shadowLg: 'none',
  },
  colorful: {
    primary: '#ff6b6b',
    primaryDark: '#ee5a52',
    primaryLight: '#ffe0e0',
    bgPrimary: '#fff5f5',
    bgSecondary: '#ffe8e8',
    textPrimary: '#2d3748',
    textSecondary: '#718096',
    borderRadius: '8px',
    borderWidth: '2px',
    fontFamily: '"Inter", "Helvetica Neue", sans-serif',
    fontSize: '14px',
    shadowSm: '0 2px 4px rgba(255, 107, 107, 0.1)',
    shadowMd: '0 4px 8px rgba(255, 107, 107, 0.15)',
    shadowLg: '0 8px 16px rgba(255, 107, 107, 0.2)',
  },
  custom: {
    // Placeholder for custom theme - will be merged with user config
    primary: '#007bff',
    bgPrimary: '#ffffff',
    textPrimary: '#212529',
  },
};

export function getThemeConfig(themeName: ThemeName, customTheme?: ThemeConfig): ThemeConfig {
  const baseTheme = themes[themeName] || themes.light;
  
  if (themeName === 'custom' && customTheme) {
    return { ...baseTheme, ...customTheme };
  }
  
  return baseTheme;
}

export function generateThemeCSS(themeConfig: ThemeConfig): string {
  const vars = Object.entries(themeConfig)
    .map(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      return `${cssVarName}: ${value};`;
    })
    .join('\n  ');

  return `:root {\n  ${vars}\n}`;
}
