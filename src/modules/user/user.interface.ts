import { Document } from 'mongoose';
import { UserRole } from '../../constants/roles';

export interface IUser {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  profileImageUrl?: string;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}
