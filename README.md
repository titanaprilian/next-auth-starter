# Next Auth Starter

A production-ready Next.js 16 starter template with authentication, role-based access control (RBAC), and multi-language support.

## Features

- **Authentication** - Secure login/logout with JWT token refresh
- **Role-Based Access Control** - Define roles and permissions for users
- **User Management** - Create, edit, view, and delete users
- **Role Management** - Create, edit, view, and delete roles with permissions
- **Multi-Language Support** - English, Spanish, and Indonesian translations
- **Responsive Design** - Modern UI with Tailwind CSS and shadcn/ui components
- **React Query** - Efficient server state management
- **React Hook Form + Zod** - Type-safe form handling with validation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **i18n**: Custom implementation with per-feature translations
- **HTTP Client**: Axios
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes (login)
│   ├── (main)/            # Protected routes (dashboard, management)
│   ├── api/               # API routes (auth, users, rbac)
│   └── providers/         # Client providers
├── components/            # Shared UI components
├── features/              # Feature-based organization
│   ├── auth/              # Authentication feature
│   ├── dashboard/         # Dashboard feature
│   ├── layout/           # Layout components (Navbar, Sidebar)
│   ├── rbac/             # RBAC feature (roles, permissions)
│   └── user/             # User management feature
├── hooks/                # Shared React hooks
├── lib/                  # Utilities
│   └── i18n/            # Internationalization
├── messages/            # Common translation files
└── public/               # Static assets
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users` - List users
- `GET /api/users/[id]` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### RBAC
- `GET /api/rbac/roles` - List roles
- `GET /api/rbac/roles/[id]` - Get role by ID
- `POST /api/rbac/roles` - Create role
- `PUT /api/rbac/roles/[id]` - Update role
- `DELETE /api/rbac/roles/[id]` - Delete role
- `GET /api/rbac/features` - List features/permissions

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
```

## License

MIT
