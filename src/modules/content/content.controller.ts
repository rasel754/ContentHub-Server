import { Request, Response } from 'express';
import { ContentService } from './content.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { getPaginationOptions } from '../../utils/pagination';
import { Messages } from '../../constants/messages';
import { AppError } from '../../utils/AppError';

export class ContentController {
  /**
   * Get single content item by ID
   */
  public static getContent = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.auth!.userId;
    const userRole = req.auth!.role;
    const content = await ContentService.getContentById(id, userId, userRole);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: Messages.CONTENT.FETCH_SUCCESS,
      data: content,
    });
  });

  /**
   * Get paginated and filtered content list for the logged-in user
   */
  public static getAllContent = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.auth!.userId;
    const userRole = req.auth!.role;
    const { type, page, limit, sortBy, sortOrder, search, dateRange, all } = req.query as any;
    
    const isAll = all === 'true';
    if (isAll && userRole !== 'admin' && userRole !== 'manager') {
      throw new AppError(Messages.FORBIDDEN, 403);
    }

    const pagination = getPaginationOptions({ page, limit, sortBy, sortOrder });
    const { contents, total } = await ContentService.getAllContent(
      userId,
      userRole,
      { type, search, dateRange, all: isAll },
      pagination
    );

    const totalPage = Math.ceil(total / pagination.limit);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: Messages.CONTENT.FETCH_SUCCESS,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPage,
      },
      data: contents,
    });
  });

  /**
   * Update content details by ID
   */
  public static updateContent = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.auth!.userId;
    const userRole = req.auth!.role;
    const updatedContent = await ContentService.updateContent(id, userId, userRole, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: Messages.CONTENT.UPDATE_SUCCESS,
      data: updatedContent,
    });
  });

  /**
   * Delete content item by ID
   */
  public static deleteContent = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.auth!.userId;
    const userRole = req.auth!.role;
    await ContentService.deleteContent(id, userId, userRole);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: Messages.CONTENT.DELETE_SUCCESS,
    });
  });
}
export default ContentController;
