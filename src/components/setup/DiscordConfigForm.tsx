
import { Input } from "@/components/ui/input";
import { DatabaseCredentials } from "@/services/database";

interface DiscordConfigFormProps {
  formData: Partial<DatabaseCredentials>;
  onChange: (data: Partial<DatabaseCredentials>) => void;
  isLoading: boolean;
}

export function DiscordConfigForm({ formData, onChange, isLoading }: DiscordConfigFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Discord Configuration</h2>
      <Input
        type="password"
        placeholder="Discord Bot Token"
        value={formData.discordToken}
        onChange={(e) => onChange({ ...formData, discordToken: e.target.value })}
        required
        disabled={isLoading}
      />
    </div>
  );
}
