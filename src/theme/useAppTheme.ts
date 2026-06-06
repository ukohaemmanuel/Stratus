import { useContext } from 'react';

import { AppThemeContext } from './ThemeProvider';

export function useAppTheme() {
  return useContext(AppThemeContext);
}
