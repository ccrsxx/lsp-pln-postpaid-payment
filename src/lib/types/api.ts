import type { DefaultError, UseMutationResult } from '@tanstack/react-query';

type SlugEndPoints =
  | 'courses'
  | 'user-courses'
  | 'user-payments'
  | 'user-notifications'
  | 'course-material-status';

type SlugEndPointsWithParams = 'courses' | 'courses/me';

type ApiEndpoints =
  | 'courses'
  | 'courses/me'
  | 'user-payments'
  | 'course-categories'
  | 'user-notifications'
  | 'dashboard/statistics'
  | `${SlugEndPoints}/${string}`
  | `${SlugEndPointsWithParams}?${string}`;

export type ValidApiEndpoints = `/${ApiEndpoints}`;

export type APIResponse<T = unknown> = {
  message: string;
  data: T;
};

export type ActionsResponse =
  | {
      success: string;
    }
  | {
      error: string;
    };

export type MutationResult<T = unknown, V = unknown> = UseMutationResult<
  V,
  DefaultError,
  T,
  unknown
>;

export type ExtractMutationVariables<T> = T extends MutationResult<
  infer U,
  infer _
>
  ? U
  : never;
