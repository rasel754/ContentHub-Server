import { Request, Response } from 'express';
import { UserService } from './user.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { Messages } from '../../constants/messages';

export class UserController {
  /**
   * Get the profile of the currently logged-in user
   */
  public static getProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const clerkId = req.auth!.userId;
    const user = await UserService.getUserProfile(clerkId);
    
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    });
  });

  /**
   * Update the profile of the currently logged-in user
   */
  public static updateProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const clerkId = req.auth!.userId;
    const updatedUser = await UserService.updateUserProfile(clerkId, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: Messages.USER.UPDATE_SUCCESS,
      data: updatedUser,
    });
  });

  /**
   * Sync user session details (typically triggered via webhook or upon login redirect)
   */
  public static syncProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const user = await UserService.syncUser(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: Messages.USER.SYNC_SUCCESS,
      data: user,
    });
  });
}
export default UserController;
