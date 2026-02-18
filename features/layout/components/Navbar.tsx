"use client";

import Link from "next/link";
import { Menu, LogOut, User, UserCog } from "lucide-react";
import { useAuth } from "@features/auth/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "./LanguageSwitcher";

/**
 * Navbar component for authenticated pages.
 * Displays page title (optional), hamburger menu (mobile), and user profile dropdown.
 *
 * @param title - Optional page title to display in the navbar
 * @param onMenuClick - Callback for hamburger menu button (mobile)
 *
 * @example
 * <Navbar title="Dashboard" onMenuClick={() => {}} />
 *
 * @example
 * // Without title
 * <Navbar onMenuClick={() => {}} />
 */
export function Navbar({
  title,
  onMenuClick,
}: {
  title?: string;
  onMenuClick?: () => void;
}) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Left side: Menu button (mobile) + Page title */}
      <div className="flex items-center gap-4">
        {/* Hamburger menu button - only visible on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page Title */}
        {title && <h1 className="text-xl font-semibold">{title}</h1>}
      </div>

      {/* User Profile Dropdown */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-2">
              <Avatar>
                <AvatarFallback className="bg-branding-dark text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account" className="flex items-center">
                <UserCog className="mr-2 h-4 w-4" />
                My Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
