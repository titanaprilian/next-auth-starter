import { LoginForm, LoginBranding } from "@/features/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex flex-1 items-center justify-center bg-branding-dark text-branding-foreground">
        <LoginBranding />
      </div>
      <div className="flex-1 flex items-center justify-center bg-grid px-4 py-12">
        <LoginForm />
      </div>
    </div>
  );
}
