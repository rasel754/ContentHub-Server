import OpenAI from 'openai';
import { env } from '../../config/env';
import { ContentService } from '../content/content.service';
import { ChatService } from '../chat/chat.service';
import { ContentType, MessageRole } from '../../constants/enums';
import { AppError } from '../../utils/AppError';
import { logger } from '../../utils/logger';
import { IContentDocument } from '../content/content.interface';
import { IChatMessageDocument } from '../chat/chat.interface';

// Initialize the OpenAI SDK
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export class AIService {
  /**
   * Helper to check if OpenAI API key is a mock placeholder
   */
  private static isMockKey(): boolean {
    return env.OPENAI_API_KEY.startsWith('sk-proj-openai_api_key_mock') || env.NODE_ENV === 'test';
  }

  /**
   * Generates AI Content based on prompt and type, saving it to MongoDB Content collection.
   */
  public static async generateContent(
    userId: string,
    prompt: string,
    type: ContentType
  ): Promise<IContentDocument> {
    let generatedText = '';
    const startTime = Date.now();

    // 1. Build prompt based on content type
    let systemPrompt = 'You are a helpful and expert AI content writer.';
    let userPrompt = '';

    switch (type) {
      case ContentType.BLOG:
        systemPrompt = 'You are a professional blog writer. Write detailed, engaging, and well-structured articles with clear subheadings.';
        userPrompt = `Please write a comprehensive blog post about: "${prompt}". Organize it with a title, introduction, body sections with subheadings, and a conclusion.`;
        break;
      case ContentType.CAPTION:
        systemPrompt = 'You are a social media copywriter. Write highly engaging, snappy, and creative social media captions with relevant emojis and hashtags.';
        userPrompt = `Please write an engaging social media caption about: "${prompt}". Include appropriate emojis and 3-5 relevant hashtags.`;
        break;
      case ContentType.SUMMARY:
        systemPrompt = 'You are an executive assistant. Generate clean, highly concise summaries from text, highlighting key takeaways using bullet points.';
        userPrompt = `Please summarize the following text: "${prompt}". Structure it with a short overview followed by a bulleted list of key takeaways.`;
        break;
      default:
        throw new AppError('Invalid content type specified', 400);
    }

    try {
      // 2. Fetch from OpenAI or use Mock
      if (this.isMockKey()) {
        logger.info(`[AI Mock] Generating content of type: ${type} for user: ${userId}`);
        generatedText = `[Mock Generated ${type.toUpperCase()}]\n\nPrompt: ${prompt}\n\nHere is your mock generated content. To get real AI generation, please set a valid OpenAI API key in the .env file.`;
      } else {
        const response = await openai.chat.completions.create({
          model: env.OPENAI_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
        });
        generatedText = response.choices[0]?.message?.content || '';
      }

      const durationMs = Date.now() - startTime;

      // 3. Save to Content Database
      const savedContent = await ContentService.createContent({
        userId,
        prompt,
        type,
        output: generatedText,
        metadata: {
          model: env.OPENAI_MODEL,
          generationTimeMs: durationMs,
          wordCount: generatedText.split(/\s+/).filter(Boolean).length,
        },
      });

      return savedContent;
    } catch (error: any) {
      logger.error('Error generating AI Content:', error);
      throw new AppError(`AI Generation failed: ${error.message || error}`, 500);
    }
  }

  /**
   * AI Chat Assistant: Fetches history context, generates reply, and records user & assistant logs in DB.
   */
  public static async chatWithAssistant(
    userId: string,
    conversationId: string,
    message: string
  ): Promise<{ response: string; userMessage: IChatMessageDocument; assistantMessage: IChatMessageDocument }> {
    try {
      // 1. Retrieve session to ensure it belongs to this user
      const session = await ChatService.getSessionById(conversationId, userId);

      // 2. Retrieve last 15 messages for context window stability
      const previousMessages = await ChatService.getSessionMessages(conversationId, userId, 15);

      // 3. Construct message array for OpenAI API
      const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: 'You are an intelligent, concise, and helpful AI chat assistant. Maintain context of the conversation and answer the user.',
        },
      ];

      // Append history
      for (const msg of previousMessages) {
        apiMessages.push({
          role: msg.role === MessageRole.USER ? 'user' : 'assistant',
          content: msg.content,
        });
      }

      // Append new user message
      apiMessages.push({
        role: 'user',
        content: message,
      });

      // 4. Request completion
      let responseText = '';
      if (this.isMockKey()) {
        logger.info(`[AI Mock] Chat message received in session: ${conversationId} for user: ${userId}`);
        responseText = `[Mock Assistant Response] Thank you for your message: "${message}". Set your real OpenAI API key to start talking to GPT.`;
      } else {
        const response = await openai.chat.completions.create({
          model: env.OPENAI_MODEL,
          messages: apiMessages,
          temperature: 0.7,
        });
        responseText = response.choices[0]?.message?.content || '';
      }

      // 5. Store user message in DB
      const userMessageObj = await ChatService.addMessageToSession(
        conversationId,
        MessageRole.USER,
        message
      );

      // 6. Store assistant response in DB
      const assistantMessageObj = await ChatService.addMessageToSession(
        conversationId,
        MessageRole.ASSISTANT,
        responseText
      );

      // 7. Auto-update Chat Session title if it is default
      if (session.title.startsWith('New Chat') || session.title.toLowerCase() === 'chat session') {
        const slicedTitle = message.slice(0, 30) + (message.length > 30 ? '...' : '');
        session.title = slicedTitle || 'Chat Session';
        await session.save();
      }

      return {
        response: responseText,
        userMessage: userMessageObj,
        assistantMessage: assistantMessageObj,
      };
    } catch (error: any) {
      logger.error('Error in AI Chat assistant:', error);
      throw new AppError(`AI Chat failed: ${error.message || error}`, 500);
    }
  }
}
export default AIService;
