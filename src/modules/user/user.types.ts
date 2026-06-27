import { UserRole } from '../../constants/roles';

export type CreateUserDTO = {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  profileImageUrl?: string;
};

export type UpdateUserDTO = {
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
};
