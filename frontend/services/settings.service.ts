import { apiClient } from './api-client';

export interface FieldVisibility {
  visiblePriority: boolean;
  visibleMembers: boolean;
  visibleStatus: boolean;
  visibleReporter: boolean;
  visibleLabels: boolean;
  visibleDueDate: boolean;
}

export const settingsService = {
  async getFieldVisibility() {
    const { data } = await apiClient.get<FieldVisibility>('/settings/field-visibility');
    return data;
  },
  async updateFieldVisibility(payload: Partial<FieldVisibility>) {
    const { data } = await apiClient.patch<FieldVisibility>('/settings/field-visibility', payload);
    return data;
  },
};
