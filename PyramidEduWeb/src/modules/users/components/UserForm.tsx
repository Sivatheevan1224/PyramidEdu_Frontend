/**
 * UserForm - Reusable form for creating/editing users
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, CreateUserInput } from '../validation/user.schema';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface UserFormProps {
  onSubmit: (data: CreateUserInput) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    mode: 'onBlur',
  });

  const isLoaderActive = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="John"
            disabled={isLoaderActive}
            {...register('firstName')}
            className={`
              w-full px-4 py-2.5 rounded-lg border bg-background text-foreground
              placeholder-gray-500 focus:outline-none transition-all
              ${
                errors.firstName
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-border focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300'
                  }
                  disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed
            `}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Doe"
            disabled={isLoaderActive}
            {...register('lastName')}
            className={`
              w-full px-4 py-2.5 rounded-lg border bg-background text-foreground
              placeholder-gray-500 focus:outline-none transition-all
              ${
                errors.lastName
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-border focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300'
                  }
                  disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed
            `}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="john.doe@example.com"
          disabled={isLoaderActive}
          {...register('email')}
          className={`
            w-full px-4 py-2.5 rounded-lg border bg-background text-foreground
            placeholder-gray-500 focus:outline-none transition-all
            ${
              errors.email
                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-border focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300'
              }
              disabled:bg-muted/40 disabled:text-muted-foreground disabled:cursor-not-allowed
          `}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          placeholder="+1 (555) 000-0000"
          disabled={isLoaderActive}
          {...register('phoneNumber')}
          className={`
            w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900
            placeholder-gray-500 focus:outline-none transition-all
            ${
              errors.phoneNumber
                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300'
            }
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          `}
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>

      {/* Password Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="•••••••••"
              disabled={isLoaderActive}
              {...register('password')}
              className={`
                w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900
                placeholder-gray-500 focus:outline-none transition-all pr-10
                ${
                  errors.password
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300'
                }
                disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoaderActive}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="•••••••••"
              disabled={isLoaderActive}
              {...register('confirmPassword')}
              className={`
                w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900
                placeholder-gray-500 focus:outline-none transition-all pr-10
                ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300'
                }
                disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              `}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoaderActive}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role <span className="text-red-500">*</span>
        </label>
        <select
          disabled={isLoaderActive}
          {...register('role')}
          className={`
            w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900
            focus:outline-none transition-all
            ${
              errors.role
                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-gray-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300'
            }
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          `}
        >
          <option value="">Select a role</option>
          <option value="MANAGER">Manager</option>
          <option value="TEACHER">Teacher</option>
          <option value="STUDENT">Student</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoaderActive}
            className="
              flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700
              font-medium hover:bg-gray-50 transition-colors
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
            "
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoaderActive}
          className="
            flex-1 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg
            hover:bg-emerald-700 transition-colors
            disabled:bg-emerald-400 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
            flex items-center justify-center gap-2
          "
        >
          {isLoaderActive && (
            <div className="w-4 h-4 border-2 border-emerald-200 border-t-white rounded-full animate-spin" />
          )}
          {isLoaderActive ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </form>
  );
};
