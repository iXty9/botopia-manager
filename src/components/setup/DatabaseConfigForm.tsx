
import { Input } from "@/components/ui/input";
import { DatabaseCredentials } from "@/services/database";

interface DatabaseConfigFormProps {
  formData: Partial<DatabaseCredentials>;
  onChange: (data: Partial<DatabaseCredentials>) => void;
  isLoading: boolean;
}

export function DatabaseConfigForm({ formData, onChange, isLoading }: DatabaseConfigFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Database Configuration</h2>
      <div className="space-y-2">
        <Input
          placeholder="Database Host"
          value={formData.dbHost}
          onChange={(e) => onChange({ ...formData, dbHost: e.target.value })}
          required
          disabled={isLoading}
        />
        <Input
          placeholder="Port"
          value={formData.dbPort}
          onChange={(e) => onChange({ ...formData, dbPort: e.target.value })}
          required
          disabled={isLoading}
        />
        <Input
          placeholder="Database Name"
          value={formData.dbName}
          onChange={(e) => onChange({ ...formData, dbName: e.target.value })}
          required
          disabled={isLoading}
        />
        <Input
          placeholder="Username"
          value={formData.dbUser}
          onChange={(e) => onChange({ ...formData, dbUser: e.target.value })}
          required
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="Password"
          value={formData.dbPassword}
          onChange={(e) => onChange({ ...formData, dbPassword: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
