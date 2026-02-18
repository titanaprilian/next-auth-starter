"use client";

import { useI18n } from "@/app/providers/I18nProvider";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLocale("en")}
          className={locale === "en" ? "bg-accent" : ""}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale("es")}
          className={locale === "es" ? "bg-accent" : ""}
        >
          Español
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale("id")}
          className={locale === "id" ? "bg-accent" : ""}
        >
          Indonesia
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
