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
│   ├── dashboard/       # Dashboard feature
│   ├── layout/          # Layout components (Navbar, Sidebar)
│   ├── rbac/            # RBAC feature
│   └── user/            # User management feature
├── hooks/               # Shared React hooks
├── lib/                 # Utilities
│   └── i18n/           # Internationalization
├── messages/            # Translation JSON files (en, es, id)
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

1. **Translation Files**: `messages/{locale}.json`
2. **Config Files**: Each feature has a config file with `*Key` properties pointing to translation keys
3. **useTranslation Hook**: Custom hook from `@/lib/i18n/useTranslation`

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
2. Create `messages/{locale}.json`
3. Add to `LanguageSwitcher.tsx`

### API Pattern

```typescript
// features/[feature]/services/api.ts
export async function fetchUsers(filters: Partial<UserFilters>) {
  const { data } = await ApiAxios.get<ApiUsersResponse>("/users", { params });
  return data;
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
3. Add translations to `messages/` files
4. Create config file with translation keys
5. Export components in `index.ts`

### Adding Translations

1. Add keys to `messages/en.json` (base)
2. Add keys to `messages/es.json` (Spanish)
3. Add keys to `messages/id.json` (Indonesian)
4. Use `t("key.path")` in components

### Adding a New Language

1. Update `I18nProvider.tsx` to include the locale
2. Create `messages/{locale}.json`
3. Add language option to `LanguageSwitcher.tsx`

### Adding API Endpoints

1. Create API service function in `features/[feature]/services/`
2. Add React Query hook in `features/[feature]/hooks/`
3. Use in components with proper loading states
