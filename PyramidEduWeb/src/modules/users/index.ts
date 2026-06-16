/**
 * User Module Index - Exports all user module components and utilities
 */

// Components
export { UserStatusBadge } from './components/UserStatusBadge';
export { SearchBar } from './components/SearchBar';
export { FilterDropdown } from './components/FilterDropdown';
export { ActionMenu } from './components/ActionMenu';
export type { ActionMenuItem } from './components/ActionMenu';
export { EmptyState } from './components/EmptyState';
export { UserForm } from './components/UserForm';
export { AddUserModal } from './components/AddUserModal';
export { UserCard } from './components/UserCard';
export { UserTable } from './components/UserTable';
export { UserAvatar } from './components/UserAvatar';

// Pages
export { UserManagementPage } from './pages/UserManagementPage';
export { StudentManagementPage } from './pages/StudentManagementPage';

// Hooks
export { useUsers } from './hooks/useUsers';

// Store
export { useUserStore } from './store/user.store';

// Services
export { userService } from './services/user.service';

// Types
export type { User, UserRole, UserStatus, CreateUserPayload, UpdateUserPayload, UserFilters, PaginatedResponse, ApiError } from './types/user.types';

// Validation
export { createUserSchema, updateUserSchema } from './validation/user.schema';
export type { CreateUserInput, UpdateUserInput } from './validation/user.schema';
