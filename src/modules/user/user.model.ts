import { Schema, model } from 'mongoose';
import { IUserDocument } from './user.interface';
import { UserRole } from '../../constants/roles';

const userSchema = new Schema<IUserDocument>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    profileImageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUserDocument>('User', userSchema);
export default User;
