/**
 * README - User Management Module
 */

# User Management Module Documentation

## Overview
The User Management module is a production-grade frontend system for managing users in the PyramidEdu platform. It provides a complete UI for CRUD operations with validation, error handling, and role-based access control.

## Features

✅ **User Management**
- Create, read, update, delete users
- Search and filter users by role and status
- Sorting and pagination support
- Responsive table and card layouts

✅ **Form Validation**
- React Hook Form + Zod integration
- Real-time validation feedback
- Strong password requirements
- Email format validation

✅ **State Management**
- Zustand store for global state
- Optimistic UI updates
- Error handling and toast notifications
- Loading states and skeletons

✅ **Security**
- Protected API routes with token-based auth
- Role-based UI rendering
- Form sanitization
- Prevent multiple form submissions

✅ **UX Features**
- Smooth animations and transitions
- Loading skeleton screens
- Toast notifications for feedback
- Confirmation dialogs for destructive actions
- Empty state illustrations
- Mobile-responsive design

## Architecture

### Folder Structure
```
src/modules/users/
├── components/       # Reusable UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── store/           # Zustand store
├── services/        # API service layer
├── types/           # TypeScript interfaces
├── validation/      # Zod schemas
└── index.ts         # Module exports
```

### Components

- **UserManagementPage**: Main page component with all features
- **UserTable**: Desktop-optimized data table with sorting
- **UserCard**: Mobile-optimized card view
- **UserForm**: Form for creating/editing users
- **AddUserModal**: Modal wrapper for user creation
- **UserStatusBadge**: Reusable status indicator
- **SearchBar**: Search input with clear functionality
- **FilterDropdown**: Reusable filter dropdown
- **ActionMenu**: Dropdown action menu for row actions
- **EmptyState**: Empty state UI component

### Custom Hooks

- **useUsers**: Main hook managing user operations and state
  - Fetches users from API
  - Handles CRUD operations
  - Manages filters and pagination
  - Provides error handling

### State Management (Zustand)

- **useUserStore**: Global state for users
  - users: User[] - List of users
  - filters: UserFilters - Current filters
  - isLoading: boolean - Loading state
  - error: string | null - Error message
  - Pagination and modal state
  - All related actions

### Services (Axios)

- **userService**: API integration layer
  - getUsers() - Fetch paginated users
  - getUser() - Fetch single user
  - createUser() - Create new user
  - updateUser() - Update user details
  - updateUserStatus() - Enable/disable user
  - deleteUser() - Delete user
  - checkEmailExists() - Validate email

### Validation (Zod)

- **createUserSchema**: Full validation for user creation
  - firstName: 2-50 chars, letters only
  - lastName: 2-50 chars, letters only
  - email: Valid email format
  - phoneNumber: 10+ digits
  - password: 8+ chars with uppercase, lowercase, number, special char
  - confirmPassword: Must match password
  - role: MANAGER | TEACHER | STUDENT

- **updateUserSchema**: Partial validation for updates

## Usage

### Basic Integration

```tsx
import { UserManagementPage } from '@/modules/users';

export default function UsersPage() {
  return <UserManagementPage />;
}
```

### Using Individual Components

```tsx
import { UserTable, useUsers } from '@/modules/users';

export function MyComponent() {
  const { users, isLoading, fetchUsers } = useUsers();

  return (
    <UserTable
      users={users}
      isLoading={isLoading}
      onEdit={(user) => console.log('Edit:', user)}
    />
  );
}
```

### Using the Hook

```tsx
import { useUsers } from '@/modules/users';

export function UsersList() {
  const {
    users,
    isLoading,
    error,
    filters,
    fetchUsers,
    createUser,
    updateUserDetails,
    toggleUserStatus,
    deleteUser,
  } = useUsers();

  return (
    // Your implementation
  );
}
```

## API Integration

The module is ready for backend integration. Update the API endpoints in `services/user.service.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
```

Expected backend endpoints:
- `GET /api/users` - List users with filters
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `PATCH /api/users/:id/status` - Update status
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/check-email` - Validate email

## Styling

All components use Tailwind CSS with the emerald green color scheme:
- Primary: `emerald-600` (#10B981)
- Hover: `emerald-700` (#059669)
- Light: `emerald-50` (#F0F7F4)

## Type Safety

Full TypeScript support with interfaces for:
- User data models
- API responses
- Props validation
- Form inputs
- Filters and pagination

## Future Enhancements

- [ ] Bulk user import (CSV)
- [ ] User role management
- [ ] Permission matrix
- [ ] User activity logs
- [ ] Batch actions
- [ ] Advanced filters
- [ ] User export (CSV/PDF)
- [ ] Two-factor authentication setup
- [ ] User impersonation
- [ ] Audit trail

## Performance Optimizations

- Memoization of components and callbacks
- Lazy loading for modals
- Pagination to limit data fetched
- Debounced search input
- Optimistic UI updates
- Request cancellation support (ready)

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in modals
- Color contrast compliance
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Part of PyramidEdu Platform - All rights reserved
