export type TemperatureUnit = 'celsius' | 'fahrenheit';

export function celsiusToFahrenheit(c: number): number {
  return Math.round(c * 9 / 5 + 32);
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(celsius) : celsius;
  return `${value}°`;
}

export function formatTemperatureValue(celsius: number, unit: TemperatureUnit): number {
  return unit === 'fahrenheit' ? celsiusToFahrenheit(celsius) : celsius;
}

export function formatTemperatureRange(
  high: number,
  low: number,
  unit: TemperatureUnit
): string {
  if (unit === 'fahrenheit') {
    return `${celsiusToFahrenheit(high)}° / ${celsiusToFahrenheit(low)}°`;
  }
  return `${high}° / ${low}°`;
}
