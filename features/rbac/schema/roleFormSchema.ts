import { z } from "zod";

export const permissionSchema = z.object({
  featureId: z.string(),
  canCreate: z.boolean(),
  canRead: z.boolean(),
  canUpdate: z.boolean(),
  canDelete: z.boolean(),
  canPrint: z.boolean(),
});

export const roleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  permissions: z.array(permissionSchema),
});

export type RoleFormData = z.infer<typeof roleFormSchema>;
export type PermissionInput = z.infer<typeof permissionSchema>;
