import { AIService } from '../../modules/ai/ai.service';
import { ContentService } from '../../modules/content/content.service';
import { ContentType } from '../../constants/enums';

// Mock the ContentService saving logic
jest.mock('../../modules/content/content.service');

describe('AIService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateContent', () => {
    it('should correctly fall back to mock AI generation and save the output', async () => {
      const mockContent = {
        _id: 'mock_content_id',
        userId: 'user_123',
        prompt: 'Write a caption for clean code',
        type: ContentType.CAPTION,
        output: '[Mock Generated CAPTION]\n\nPrompt: Write a caption for clean code\n\nHere is your mock generated content. To get real AI generation, please set a valid OpenAI API key in the .env file.',
        metadata: { model: 'gpt-4o-mini' },
      };

      (ContentService.createContent as jest.Mock).mockResolvedValue(mockContent);

      const result = await AIService.generateContent(
        'user_123',
        'Write a caption for clean code',
        ContentType.CAPTION
      );

      // Verify that ContentService.createContent was called with correct structure
      expect(ContentService.createContent).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user_123',
          prompt: 'Write a caption for clean code',
          type: ContentType.CAPTION,
          output: expect.stringContaining('[Mock Generated CAPTION]'),
        })
      );
      expect(result).toEqual(mockContent);
    });
  });
});
