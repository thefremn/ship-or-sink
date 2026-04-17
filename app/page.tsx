import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-6">
      <div className="text-center space-y-2">
        <Badge variant="secondary">Hackathon Ready</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Ship or Sink</h1>
        <p className="text-muted-foreground">Start building your feature fast.</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>Your stack is ready to go</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✅ Next.js App Router + TypeScript</p>
          <p>✅ Tailwind CSS + shadcn/ui</p>
          <p>
            ✅ Supabase client in{" "}
            <code className="font-mono text-xs bg-muted px-1 rounded">lib/supabaseClient.ts</code>
          </p>
          <p>
            ⚙️ Fill in{" "}
            <code className="font-mono text-xs bg-muted px-1 rounded">.env.local</code> with your
            Supabase keys
          </p>
        </CardContent>
      </Card>

      <a
        href="https://supabase.com/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
      >
        Open Supabase Dashboard
      </a>
    </main>
  );
}
