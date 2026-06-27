import { ContentType } from '../../constants/enums';

export type CreateContentDTO = {
  userId: string;
  prompt: string;
  type: ContentType;
  output: string;
  metadata?: Record<string, any>;
};

export type UpdateContentDTO = {
  prompt?: string;
  type?: ContentType;
  output?: string;
  metadata?: Record<string, any>;
};
