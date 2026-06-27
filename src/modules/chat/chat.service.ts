import { ChatSession, ChatMessage } from './chat.model';
import { IChatSessionDocument, IChatMessageDocument } from './chat.interface';
import { IPaginationResult } from '../../utils/pagination';
import { AppError } from '../../utils/AppError';
import { Messages } from '../../constants/messages';
import { MessageRole } from '../../constants/enums';

export class ChatService {
  /**
   * Create a new chat session for a user.
   */
  public static async createSession(userId: string, title: string): Promise<IChatSessionDocument> {
    const session = new ChatSession({ userId, title });
    return await session.save();
  }

  /**
   * Get a chat session by ID, verifying it belongs to the user.
   */
  public static async getSessionById(sessionId: string, userId: string): Promise<IChatSessionDocument> {
    const session = await ChatSession.findOne({ _id: sessionId, userId });
    if (!session) {
      throw new AppError(Messages.CHAT.SESSION_NOT_FOUND, 404);
    }
    return session;
  }

  /**
   * Get all chat sessions of a user, paginated.
   */
  public static async getUserSessions(
    userId: string,
    pagination: IPaginationResult
  ): Promise<{ sessions: IChatSessionDocument[]; total: number }> {
    const query = { userId };
    const total = await ChatSession.countDocuments(query);
    const sessions = await ChatSession.find(query)
      .sort({ [pagination.sortBy]: pagination.sortOrder })
      .skip(pagination.skip)
      .limit(pagination.limit);

    return { sessions, total };
  }

  /**
   * Add a message (from user or assistant) to a session.
   */
  public static async addMessageToSession(
    sessionId: string,
    role: MessageRole,
    content: string
  ): Promise<IChatMessageDocument> {
    const message = new ChatMessage({
      sessionId,
      role,
      content,
    });
    return await message.save();
  }

  /**
   * Retrieve all messages of a session, sorted chronologically.
   * Confirms session belongs to the user first.
   */
  public static async getSessionMessages(
    sessionId: string,
    userId: string,
    limit: number = 50
  ): Promise<IChatMessageDocument[]> {
    // Validate session ownership
    await this.getSessionById(sessionId, userId);

    return await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .limit(limit);
  }

  /**
   * Delete a chat session and all messages linked to it.
   */
  public static async deleteSession(sessionId: string, userId: string): Promise<void> {
    // Confirm session exists and belongs to the user
    await this.getSessionById(sessionId, userId);

    // Delete session and its messages
    await ChatSession.deleteOne({ _id: sessionId });
    await ChatMessage.deleteMany({ sessionId });
  }
}
export default ChatService;
