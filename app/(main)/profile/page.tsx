"use client";

import { useAuth } from "@features/auth/context/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from "@/lib/i18n/useTranslation";
import { profileConfig } from "@/features/auth/config/profile";
import { User, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="text-xl font-semibold">
        {t(profileConfig.pageTitleKey)}
      </h1>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
            <AvatarFallback className="bg-branding-dark text-xl text-white">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{user?.name || "User"}</CardTitle>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground">
                {t(profileConfig.fields.name)}
              </label>
              <p className="text-sm font-medium">{user?.name || "-"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground">
                {t(profileConfig.fields.email)}
              </label>
              <p className="text-sm font-medium">{user?.email || "-"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground">
                {t(profileConfig.fields.role)}
              </label>
              <p className="text-sm font-medium">{user?.roleName || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
