import { Request, Response } from 'express';
import { ChatService } from './chat.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { getPaginationOptions } from '../../utils/pagination';
import { Messages } from '../../constants/messages';

export class ChatController {
  /**
   * Create a new chat session
   */
  public static createSession = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.auth!.userId;
    const { title } = req.body;
    const session = await ChatService.createSession(userId, title);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: Messages.CHAT.SESSION_CREATE_SUCCESS,
      data: session,
    });
  });

  /**
   * Get all chat sessions of the current user
   */
  public static getSessions = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.auth!.userId;
    const { page, limit } = req.query as any;
    
    const pagination = getPaginationOptions({ page, limit });
    const { sessions, total } = await ChatService.getUserSessions(userId, pagination);
    const totalPage = Math.ceil(total / pagination.limit);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: Messages.CHAT.FETCH_SUCCESS,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPage,
      },
      data: sessions,
    });
  });

  /**
   * Get all messages within a specific session
   */
  public static getSessionMessages = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.auth!.userId;
    const { sessionId } = req.params;
    const messages = await ChatService.getSessionMessages(sessionId, userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: Messages.CHAT.FETCH_SUCCESS,
      data: messages,
    });
  });

  /**
   * Delete a chat session
   */
  public static deleteSession = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.auth!.userId;
    const { sessionId } = req.params;
    await ChatService.deleteSession(sessionId, userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Chat session deleted successfully',
    });
  });
}
export default ChatController;
