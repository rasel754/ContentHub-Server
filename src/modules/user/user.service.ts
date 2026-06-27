import { User } from './user.model';
import { IUserDocument } from './user.interface';
import { CreateUserDTO, UpdateUserDTO } from './user.types';
import { AppError } from '../../utils/AppError';
import { Messages } from '../../constants/messages';

export class UserService {
  /**
   * Sync Clerk user data into MongoDB (creates or updates user).
   */
  public static async syncUser(data: CreateUserDTO): Promise<IUserDocument> {
    const { clerkId, email, firstName, lastName, role, profileImageUrl } = data;
    
    // Find and update or create
    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        email,
        firstName,
        lastName,
        role: role || undefined,
        profileImageUrl,
      },
      { new: true, upsert: true, runValidators: true }
    );
    
    return user;
  }

  /**
   * Get user profile by Clerk ID.
   */
  public static async getUserProfile(clerkId: string): Promise<IUserDocument> {
    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new AppError(Messages.USER.NOT_FOUND, 404);
    }
    return user;
  }

  /**
   * Update user profile by Clerk ID.
   */
  public static async updateUserProfile(
    clerkId: string,
    updateData: UpdateUserDTO
  ): Promise<IUserDocument> {
    const user = await User.findOneAndUpdate(
      { clerkId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError(Messages.USER.NOT_FOUND, 404);
    }
    return user;
  }
}
