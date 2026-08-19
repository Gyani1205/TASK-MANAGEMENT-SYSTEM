import { FieldVisibilitySettings } from '@/components/settings/field-visibility-settings';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Board appearance is preference-based and syncs across your devices.
        </p>
      </div>
      <FieldVisibilitySettings />
    </div>
  );
}
