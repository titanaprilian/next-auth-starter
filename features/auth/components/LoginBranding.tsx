import Image from "next/image";

interface LoginBrandingProps {
  logoUrl?: string;
}

export function LoginBranding({ logoUrl }: LoginBrandingProps) {
  return (
    <div className="text-center px-2">
      {logoUrl ? (
        <div className="relative w-16 h-16 mx-auto mb-4">
          <Image src={logoUrl} alt="Logo" fill className="object-contain" />
        </div>
      ) : (
        <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-foreground">N</span>
        </div>
      )}
      <h1 className="text-4xl font-bold tracking-tight">Next Auth Starter</h1>
      <p className="mt-4 text-lg text-branding">
        Secure authentication with role-based access control for your
        application.
      </p>
    </div>
  );
}
