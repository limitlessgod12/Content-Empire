import { AppShell } from "@/components/layout/app-shell";
import { PromptManager } from "@/components/prompt-library/prompt-manager";

export default function PromptLibraryPage() {
  return (
    <AppShell>
      <PromptManager />
    </AppShell>
  );
}
