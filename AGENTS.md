# Project Agents Documentation

This document provides context for implementing new features in this Next.js application.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **i18n**: Custom implementation (next-intl style)
- **Package Manager**: pnpm

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth route group (login)
│   ├── (main)/           # Protected routes (dashboard, management)
│   ├── api/              # API routes
│   └── providers/        # Client providers (AppProvider, I18nProvider)
├── components/           # Shared UI components
├── features/             # Feature-based organization
│   ├── auth/            # Authentication feature
│   │   └── config/
│   │       └── locales/ # Translations (en, es, id)
│   ├── dashboard/       # Dashboard feature
│   │   └── config/
│   │       └── locales/
│   ├── layout/          # Layout components (Navbar, Sidebar)
│   │   └── config/
│   │       └── locales/
│   ├── rbac/            # RBAC feature
│   │   └── config/
│   │       └── locales/
│   └── user/            # User management feature
│       └── config/
│           └── locales/ # Translations (en, es, id)
├── hooks/               # Shared React hooks
├── lib/                 # Utilities
│   └── i18n/           # Internationalization
├── messages/            # Common translation JSON files (en, es, id)
└── public/              # Static assets
```

## Key Patterns

### Feature Structure

Each feature follows a consistent structure:

```
features/[feature-name]/
├── components/          # React components
├── config/             # Configuration (translation keys, constants)
├── hooks/              # Feature-specific hooks
├── services/           # API calls
├── types/              # TypeScript types
└── index.ts           # Public exports
```

### Component Props Pattern

- Use interface for props
- Export types that are used externally
- Use `isLoading` prop for loading states

### i18n Implementation

Translations are organized per feature for better modularity and to avoid merge conflicts:

1. **Common translations**: `messages/{locale}.json` (shared across features)
2. **Feature translations**: `features/{feature}/config/locales/{locale}.json`
3. **Config Files**: Each feature has a config file with `*Key` properties pointing to translation keys
4. **useTranslation Hook**: Custom hook from `@/lib/i18n/useTranslation`

Example:
```tsx
// Config (features/user/config/userManagement.ts)
export const userManagementConfig = {
  pageTitleKey: "user.pageTitle",
};

// Component
const t = useTranslations();
<h1>{t(userManagementConfig.pageTitleKey)}</h1>
```

To add a new language:
1. Add locale to `I18nProvider.tsx`
2. Create `messages/{locale}.json` (common translations)
3. Create `features/{feature}/config/locales/{locale}.json` for each feature
4. Add to `LanguageSwitcher.tsx`

#### Backend i18n Support

The frontend sends the current locale to the backend via the `accept-language` header:

1. **Axios Interceptor** (`app/utils/axios.ts`): Automatically adds `accept-language` header to all API requests
2. **Locale Mapping**: Internal locale codes are mapped to full locale format:
   - `id` → `id-ID`
   - `es` → `es-ES`
   - `en` → `en-US`
3. **I18nProvider**: Syncs current locale to axios via `setApiLocale()`

#### Next.js API Routes

When creating Next.js API routes that proxy to a backend, always forward the `accept-language` header:

```typescript
// app/api/users/route.ts
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const acceptLanguage = request.headers.get("accept-language");

  const response = await fetch(API_ENDPOINTS.USERS.LIST, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader && { Authorization: authHeader }),
      ...(acceptLanguage && { "accept-language": acceptLanguage }),
    },
    credentials: "include",
  });
  // ...
}
```

#### Using Localized Backend Responses

To display localized messages from the backend in toasts, return the message from API functions:

```typescript
// features/user/services/userApi.ts
export async function updateUser(
  id: string,
  data: UserFormData,
): Promise<{ user: User; message: string }> {
  const { data: result } = await ApiAxios.patch<ApiUserResponse>(
    `/users/${id}`,
    payload,
  );

  return {
    user: result.data,
    message: result.message,
  };
}
```

Then use it in the mutation handler:
```typescript
// features/user/hooks/useUserManagement.ts
const handleUpdateUser = (data: UserFormData) => {
  updateUser.mutate(
    { id: dialog.selectedUser.id, data },
    {
      onSuccess: (response) => {
        dialog.close();
        toast.success(response.message || "User updated successfully");
      },
    },
  );
};
```

### API Pattern

```typescript
// features/[feature]/services/api.ts
export async function fetchUsers(filters: Partial<UserFilters>) {
  const { data } = await ApiAxios.get<ApiUsersResponse>("/users", { params });
  return data;
}
```

#### Returning Localized Messages from Backend

For create/update/delete operations that need to show localized toast messages, return both data and message:

```typescript
// features/user/services/userApi.ts
export async function createUser(
  data: UserFormData,
): Promise<{ user: User; message: string }> {
  const { data: result } = await ApiAxios.post<ApiUserResponse>("/users", payload);

  return {
    user: result.data,
    message: result.message,
  };
}

export async function updateUser(
  id: string,
  data: UserFormData,
): Promise<{ user: User; message: string }> {
  const { data: result } = await ApiAxios.patch<ApiUserResponse>(
    `/users/${id}`,
    payload,
  );

  return {
    user: result.data,
    message: result.message,
  };
}

export async function deleteUser(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const { data } = await ApiAxios.delete<ApiDeleteResponse>(`/users/${id}`);

  return {
    success: !data.error,
    message: data.message,
  };
}
```

### React Query Pattern

```typescript
// features/[feature]/hooks/useUser.ts
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  details: () => [...userKeys.all, "detail"] as const,
};

export function useFetchUser(filters) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => fetchUsers(filters),
  });
}
```

### Dialog Pattern (View/Edit with API fetch)

When creating dialogs that fetch data by ID:

1. Add `fetchById` function in services
2. Create `useFetchById` hook with React Query
3. In dialog component:
   - Use `useFetchById` hook for view/edit modes
   - Show skeleton/loading until fetch completes
   - Use `useEffect` with `form.reset()` to populate form when data arrives

```tsx
// Example Dialog Pattern
const { data: userData, isLoading: userLoading } = useFetchUserById(
  (mode === "view" || mode === "edit") && selectedUser ? selectedUser.id : null
);

// For edit mode - show empty form while loading
const defaultValues = userData 
  ? { ...userData }
  : mode === "edit" && userLoading 
    ? undefined 
    : selectedUser;

// Use useEffect to populate form when defaultValues changes
useEffect(() => {
  if (defaultValues) {
    form.reset(defaultValues);
  }
}, [defaultValues, form]);
```

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build       # Build for production
pnpm start       # Start production server
pnpm lint        # Run ESLint
```

## Common Tasks

### Adding a New Feature

1. Create directory in `features/`
2. Follow the feature structure pattern
3. Create config locales: `features/{feature}/config/locales/{en,es,id}.json`
4. Create config file with translation keys
5. Export components in `index.ts`
6. Update `I18nProvider.tsx` to import and merge the new feature translations

### Adding Translations

1. Add keys to `features/{feature}/config/locales/en.json` (base)
2. Add keys to `features/{feature}/config/locales/es.json` (Spanish)
3. Add keys to `features/{feature}/config/locales/id.json` (Indonesian)
4. Use `t("key.path")` in components

For common translations shared across features, add to `messages/{locale}.json`

### Adding a New Language

1. Update `I18nProvider.tsx` to include the locale
2. Create `messages/{locale}.json` (common translations)
3. Add locale files to each feature: `features/{feature}/config/locales/{locale}.json`
4. Add language option to `LanguageSwitcher.tsx`

### Adding API Endpoints

When adding a new API endpoint, follow this pattern:

1. **Update API endpoints config** - Add the backend URL to `app/api/api.ts`:
```typescript
// app/api/api.ts
export const API_ENDPOINTS = {
  FEATURE: {
    LIST: `${API_URL}/feature`,
    GET_BY_ID: (id: string) => `${API_URL}/feature/${id}`,
    CREATE: `${API_URL}/feature`,
    UPDATE: (id: string) => `${API_URL}/feature/${id}`,
    DELETE: (id: string) => `${API_URL}/feature/${id}`,
  },
};
```

2. **Create Next.js API route** - Create `app/api/{featureName}/route.ts` to proxy requests to backend:
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const acceptLanguage = request.headers.get("accept-language");

  const response = await fetch(API_ENDPOINTS.USERS.LIST, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader && { Authorization: authHeader }),
      ...(acceptLanguage && { "accept-language": acceptLanguage }),
    },
    credentials: "include",
  });

  const data = await response.json();
  return NextResponse.json(data);
}
```

3. **Create service function** - In `features/{feature}/services/`:
```typescript
// features/user/services/userApi.ts
import { ApiAxios } from "@utils/axios";

export async function fetchUsers(filters) {
  const { data } = await ApiAxios.get<ApiUsersResponse>("/users", { params });
  return data;
}

export async function fetchUserById(id: string) {
  const { data } = await ApiAxios.get<ApiUserResponse>(`/users/${id}`);
  return data.data;
}
```

4. **Add React Query hook** - In `features/{feature}/hooks/`:
```typescript
// features/user/hooks/useUser.ts
export function useFetchUserById(id: string | null) {
  return useQuery({
    queryKey: userKeys.detail(id || ""),
    queryFn: () => fetchUserById(id!),
    enabled: !!id,
  });
}
```

5. **Use in components** - With proper loading states and skeleton
