import { Request, Response } from 'express';
// import { AIService } from './ai.service';
import { catchAsync } from '../../utils/catchAsync';
// import { sendResponse } from '../../utils/sendResponse';
// import { Messages } from '../../constants/messages';

export class AIController {
  /**
   * Generates AI Content based on structured prompts and stores output
   */
  public static generateContent = catchAsync(async (_req: Request, res: Response): Promise<any> => {
    // TODO: Re-enable real AI API later
    /*
    const userId = req.auth!.userId;
    const { prompt, type } = req.body;
    
    const result = await AIService.generateContent(userId, prompt, type);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: Messages.CONTENT.CREATE_SUCCESS,
      data: result,
    });
    */

    const fakeResponse = {
      data: {
        output: "This is a mock AI response for testing."
      }
    };

    return res.json({
      success: true,
      data: fakeResponse.data,
    });
  });

  /**
   * Send a chat message and fetch an assistant reply with thread context preserved
   */
  public static chatWithAssistant = catchAsync(async (req: Request, res: Response): Promise<any> => {
    // TODO: Re-enable real AI API later
    /*
    const userId = req.auth!.userId;
    const { message, conversationId } = req.body;

    const result = await AIService.chatWithAssistant(userId, conversationId, message);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: Messages.CHAT.MESSAGE_SEND_SUCCESS,
      data: result,
    });
    */

    const fakeResponse = {
      data: {
        response: "This is a mock AI response for testing.",
        userMessage: {
          _id: "mock-user-msg-id",
          role: "user",
          content: req.body.message || "mock prompt",
          timestamp: new Date().toISOString()
        },
        assistantMessage: {
          _id: "mock-assistant-msg-id",
          role: "assistant",
          content: "This is a mock AI response for testing.",
          timestamp: new Date().toISOString()
        }
      }
    };

    return res.json({
      success: true,
      data: fakeResponse.data,
    });
  });
}
export default AIController;

