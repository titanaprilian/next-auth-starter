"use client";

import { Mail, User, Shield, Activity, Circle } from "lucide-react";
import { User as UserType, Role } from "../types";

interface UserViewProps {
  user: UserType;
  roles?: Role[];
}

export function UserView({ user, roles }: UserViewProps) {
  const roleName = roles?.find((r) => r.id === user.roleId)?.name || user.roleId;

  const fields = [
    {
      label: "Name",
      value: user.name,
      icon: User,
    },
    {
      label: "Email",
      value: user.email,
      icon: Mail,
    },
    {
      label: "Role",
      value: roleName,
      icon: Shield,
    },
    {
      label: "Status",
      value: user.isActive ? "Active" : "Inactive",
      icon: Activity,
      isStatus: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-branding-dark">
          <User className="h-7 w-7 text-white" />
        </div>
        <div className="text-center">
          <h3 className="text-base font-semibold">{user.name}</h3>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="rounded-lg border">
        {fields.map((field, index) => (
          <div
            key={field.label}
            className={`flex items-center gap-3 px-3 py-2.5 ${
              index !== fields.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <field.icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{field.label}</p>
              {field.isStatus ? (
                <div className="flex items-center gap-1.5">
                  <Circle
                    className={`h-2 w-2 fill-current ${
                      user.isActive ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <span className={user.isActive ? "text-green-700 font-medium text-sm" : "text-red-700 font-medium text-sm"}>
                    {field.value}
                  </span>
                </div>
              ) : (
                <p className="font-medium text-sm">{field.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-muted-foreground space-y-0.5">
        <p>Created: {new Date(user.createdAt).toLocaleString()}</p>
        {user.updatedAt && (
          <p>Last Updated: {new Date(user.updatedAt).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}
