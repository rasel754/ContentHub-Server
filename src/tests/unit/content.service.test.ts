import { ContentService } from '../../modules/content/content.service';
import { Content } from '../../modules/content/content.model';
import { ContentType } from '../../constants/enums';

// Mock Content model
jest.mock('../../modules/content/content.model');

describe('ContentService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createContent', () => {
    it('should instantiate and save content document', async () => {
      const payload = {
        userId: 'user_123',
        prompt: 'Clean Code principles',
        type: ContentType.SUMMARY,
        output: 'Keep it SOLID.',
        metadata: { model: 'mock' },
      };

      const mockSave = jest.fn().mockResolvedValue({ _id: 'content_id_123', ...payload });
      (Content as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
      }));

      const result = await ContentService.createContent(payload);

      expect(Content).toHaveBeenCalledWith(payload);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(result._id).toBe('content_id_123');
    });
  });

  describe('getContentById', () => {
    it('should query a single content object', async () => {
      const mockObj = {
        _id: 'content_id_123',
        userId: 'user_123',
        prompt: 'Clean Code principles',
        type: ContentType.SUMMARY,
        output: 'Keep it SOLID.',
      };

      (Content.findOne as jest.Mock).mockResolvedValue(mockObj);

      const result = await ContentService.getContentById('content_id_123', 'user_123');

      expect(Content.findOne).toHaveBeenCalledWith({ _id: 'content_id_123', userId: 'user_123' });
      expect(result).toEqual(mockObj);
    });

    it('should fail with 404 AppError if content not found', async () => {
      (Content.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        ContentService.getContentById('nonexistent_id', 'user_123')
      ).rejects.toThrow('Content not found.');
    });
  });
});
