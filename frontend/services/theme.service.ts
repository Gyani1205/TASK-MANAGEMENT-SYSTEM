import { apiClient } from './api-client';

export interface ThemePreferenceDto {
  mode: 'LIGHT' | 'DARK' | 'SYSTEM';
  accent: 'BLUE' | 'AMBER' | 'PINK' | 'ROSE' | 'EMERALD' | 'BLACK';
}

export const themeService = {
  async get() {
    const { data } = await apiClient.get<ThemePreferenceDto>('/theme');
    return data;
  },
  async update(payload: Partial<ThemePreferenceDto>) {
    const { data } = await apiClient.patch<ThemePreferenceDto>('/theme', payload);
    return data;
  },
};
