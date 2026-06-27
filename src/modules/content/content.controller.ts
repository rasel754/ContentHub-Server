import { Request, Response } from 'express';
import { ContentService } from './content.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { getPaginationOptions } from '../../utils/pagination';
import { Messages } from '../../constants/messages';

export class ContentController {
  /**
   * Get single content item by ID
   */
  public static getContent = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.auth!.userId;
    const content = await ContentService.getContentById(id, userId);

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
    const { type, page, limit, sortBy, sortOrder } = req.query as any;
    
    const pagination = getPaginationOptions({ page, limit, sortBy, sortOrder });
    const { contents, total } = await ContentService.getAllContent(
      userId,
      { type },
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
    const updatedContent = await ContentService.updateContent(id, userId, req.body);

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
    await ContentService.deleteContent(id, userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: Messages.CONTENT.DELETE_SUCCESS,
    });
  });
}
export default ContentController;
