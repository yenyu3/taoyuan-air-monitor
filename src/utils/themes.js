// 主題配置
export const themes = {
  light: {
    name: '淺色主題',
    colors: {
      primary: '#9BB7D4',
      secondary: '#E4DFD8',
      accent: '#3A4E6B',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      card: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
    },
    gradients: {
      primary: ['#9BB7D4', '#3A4E6B'],
      hero: ['#9BB7D4', '#9BB7D4', '#3A4E6B'],
    }
  },
  dark: {
    name: '深色主題',
    colors: {
      primary: '#9BB7D4',
      secondary: '#E4DFD8',
      accent: '#6B9BD2',
      background: '#1F2937',
      surface: '#374151',
      card: '#374151',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      border: '#4B5563',
      error: '#F87171',
      success: '#34D399',
      warning: '#FBBF24',
    },
    gradients: {
      primary: ['#9BB7D4', '#3A4E6B'],
      hero: ['#374151', '#1F2937', '#111827'],
    }
  }
};

export const getTheme = (themeName) => {
  return themes[themeName] || themes.light;
};