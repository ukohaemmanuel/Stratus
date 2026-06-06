export const STORAGE_KEYS = {
  PREFERENCES:  'stratus:preferences',
  APPEARANCE:   'stratus:appearance',
  PLACES:       'stratus:places',
  WEATHER:      'stratus:weather',
  weatherCache: (locationId: string) => `stratus:cache:${locationId}`,
} as const;
